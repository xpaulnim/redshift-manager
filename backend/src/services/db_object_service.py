import os
from typing import List, Tuple, Union

from db_util import Redshift, create_redshift_client


def get_table_columns(db_name: str, schema_name: str, table_name: str):
    redshift_client = create_redshift_client(db_name)

    query = f"""
    with table_columns as (
        select *
        from pg_get_cols('{schema_name}.{table_name}') cols(
            view_schema name,
            view_name name,
            col_name name,
            col_type varchar,
            col_num int
        )
    )
    select view_name,
           col_name,
           col_type,
           col_description('{schema_name}.{table_name}'::regclass, col_num) as col_comment
    from table_columns;
    """

    column_details = []
    for result in redshift_client.query(query):
        for view_name, col_name, col_type, col_comment in result:
            column_details.append(
                {
                    "table_name": view_name,
                    "col_name": col_name,
                    "col_type": col_type,
                    "col_comment": col_comment,
                }
            )

    return column_details


def get_table_preview(db_name: str, schema_name: str, table_name: str, limit: int = 100) -> Tuple[List[str], List[Tuple]]:
    redshift_client = create_redshift_client(db_name)

    table_columns = [str(col["col_name"]) for col in get_table_columns(db_name, schema_name, table_name)]
    print(f"table columns {table_columns}")

    query = f"""
    select {','.join(table_columns)}
    from "{db_name}"."{schema_name}"."{table_name}"
    limit {limit};
    """

    table_preview = []
    for result in redshift_client.query(query, batch_size=limit):
        table_preview.extend(result)

    return table_columns, table_preview


def get_table_comment(redshift_client: Redshift, schema_name: str, table_name: str):
    try:
        return redshift_client.one(f"select obj_description('{schema_name}.{table_name}'::regclass) as desc")["desc"]
    except Exception as e:
        print(e)
        return ""


def get_tables_in_schema(db_name: str, schema_name: str):
    redshift_client = create_redshift_client(db_name)

    query = f"""
    select "database" as db,
           "schema" as schema_name,
           "table" as table_name,
           create_time,
           size as table_size
    from  svv_table_info
    where database = '{db_name}' and  schema = '{schema_name}';
    """

    table_details = []
    for result in redshift_client.query(query):
        for db, schema_name, table_name, creation_time, table_size in result:
            table_owner = None
            try:
                table_owner = get_table_owner(redshift_client, schema_name, table_name)["tableowner"]
            except Exception as e:
                print(f"table_owner not found for {table_owner}")
                print(e)

            table_details.append({
                "db": db,
                "schema_name": schema_name,
                "table_name": table_name,
                "table_owner": table_owner,
                "created_at": creation_time,
                "size": table_size,
                "table_desc": get_table_comment(redshift_client, schema_name, table_name),
            })

    return table_details


def get_database_owner(redshift_client: Redshift, db_name: str):
    query = f"""
    select u.usename as db_owner,
           db.database_name as db_name
    from svv_redshift_databases db
    left join pg_user u on db.database_owner = u.usesysid
    where database_name = '{db_name}'
    ;
    """

    return redshift_client.one(query)


def get_table_owner(redshift_client: Redshift, schema_name: str, table_name: str):
    query = f"""
    select tableowner
    from pg_tables
    where schemaname = '{schema_name}' and tablename = '{table_name}'
    """

    return redshift_client.one(query)


def get_db_schema_details(redshift_client: Redshift, db_name: str):
    query = f"""
    select schema_name, schema_owner
    from svv_redshift_schemas
    left join pg_user u on schema_owner = u.usesysid
    where database_name = '{db_name}'
    """

    schema_details = []
    for database_name, schema_name, schema_owner in redshift_client.query(query):
        schema_details.append({
            "schema_name": schema_name,
            "schema_owner": schema_owner,
        })

    return schema_details


def get_database_object_hierarchy(redshift_client: Redshift) -> dict:
    query = """
    select database_name,
           schema_name,
           table_name
    from dev.pg_catalog.svv_redshift_tables
    where table_type = 'TABLE'
    """

    hierarchy = {}
    for batch in redshift_client.query(query=query):
        for database_name, schema_name, table_name in batch:
            if database_name not in hierarchy:
                hierarchy[database_name] = {}

            if schema_name not in hierarchy[database_name]:
                hierarchy[database_name][schema_name] = []

            hierarchy[database_name][schema_name].append(table_name)

    return hierarchy


def get_user_groups(redshift_client: Redshift, username: str):
    query = f"""
    select u.usename as username,
           g.groname as group_name
    from pg_user u
    left join pg_group g on u.usesysid = any (g.grolist)
    where u.usename = '{username}'
    """

    user_groups = []
    for batch in redshift_client.query(query=query):
        for username, group_name in batch:
            user_groups.append({
                "username": username,
                "group_name": group_name,
            })

    return user_groups


def get_user_roles(redshift_client: Redshift, username: str):
    query = f"""
    select user_name as username,
           role_name,
           admin_option 
    from svv_user_grants 
    where user_name = '{username}';
    """

    user_roles = []
    for batch in redshift_client.query(query=query):
        for username, role_name, admin_option in batch:
            user_roles.append({
                "username": username,
                "role_name": role_name,
                "admin_option": admin_option,
            })

    return user_roles


def get_users(redshift_client: Redshift):
    query = f"""
    select usename as username,
           usesuper,
           usecreatedb,
           valuntil,
           useconfig
    from pg_user
    order by username
    """

    user_list = []
    for batch in redshift_client.query(query=query):
        for username, usesuper, usecreatedb, valuntil, useconfig in batch:
            user_list.append({
                "username": username,
                "usesuper": usesuper,
                "usecreatedb": usecreatedb,
                "valuntil": valuntil,
                "groups": get_user_groups(redshift_client, username),
                "roles": get_user_roles(redshift_client, username),
                "useconfig": useconfig,
            })

    return user_list


def extract_acl_permissions(permission_string: str, object_type: str):
    assert object_type in {"tables", "sequences", "functions", "procedures", "types", "schemas"}

    if object_type == 'tables':
        return {
            "insert": "a" in permission_string,
            "select": "r" in permission_string,
            "update": "w" in permission_string,
            "delete": "d" in permission_string,
            "rule": "R" in permission_string,
            "references": "x" in permission_string,
            "trigger": "t" in permission_string,
            "drop": "D" in permission_string,
        }
    elif object_type in {"functions", "procedures"}:
        return {
            "execute": "X" in permission_string
        }
    elif object_type in {"schemas", "database"}:
        return {
            "create": "C" in permission_string,
            "temporary": "T" in permission_string,
            "usage": "U" in permission_string,
        }

    raise Exception(f"{object_type} not recognised")


def parse_acl(acl: Union[str, List[str]], object_type: str):
    grants = []

    if not acl:
        return grants

    if isinstance(acl, str):
        acl = acl.replace("{", "").replace("}", "").split(",")

    for aclstr in acl:
        grantor = aclstr.split('/')[1]
        grantee = aclstr.split('/')[0].split("=")[0]
        permissions = extract_acl_permissions(aclstr.split('/')[0].split("=")[1], object_type)
        grantee_type = "user"
        if len(grantee.split(" ")) == 2:
            grantee_type = grantee.split(" ")[0]
            grantee = grantee.split(" ")[1]

        grants.append({
            "grantor": grantor,
            "grantee_type": grantee_type,
            "grantee": grantee,
            **permissions,
        })

    return grants


def get_default_privileges(database_name: str, schema_name: str):
    redshift_client = create_redshift_client(database_name)
    query = f"""
    select nspname as schema_name, 
           case 
            when defaclobjtype = 'r' then 'tables' 
            when defaclobjtype = 'f' then 'functions' 
            when defaclobjtype = 'p' then 'procedures' 
           end as object_type,
           defaclacl as default_acl
    from pg_namespace
     left join pg_default_acl on pg_namespace.oid = pg_default_acl.defaclnamespace
    where nspname = '{schema_name}';
    """

    default_privileges = []
    for batch in redshift_client.query(query=query):
        for schema_name, object_type, default_acl in batch:
            default_privileges.append({
                "schema_name": schema_name,
                "object_type": object_type,
                "schema_acl": parse_acl(default_acl, object_type=object_type)
            })

    return default_privileges


def get_schema_access_privileges(database_name: str, schema_name: str):
    redshift_client = create_redshift_client(database_name)
    query = f"""
    select pg_user.usename as schema_owner,
           pg_namespace.nspname as schema_name,
           pg_namespace.nspacl as schema_acl
    from pg_namespace
    left join pg_user on pg_namespace.nspowner = pg_user.usesysid
    where pg_namespace.nspname = '{schema_name}'
    """

    schema_privileges = []
    for batch in redshift_client.query(query=query):
        for schema_owner, schema_name, schema_acl in batch:
            schema_privileges.append({
                "schema_name": schema_name,
                "schema_owner": schema_owner,
                "schema_acl": parse_acl(schema_acl, object_type='schemas'),
            })

    return schema_privileges[0] if schema_privileges else []


if __name__ == '__main__':
    client = Redshift(
        host=os.environ['REDSHIFT_HOST'],
        port=5439,
        database=os.environ.get('REDSHIFT_DATABASE', 'dev'),
        username=os.environ['REDSHIFT_USERNAME'],
        password=os.environ['REDSHIFT_PASSWORD'],
        as_dict=False
    )

    result = get_default_privileges(database_name='dev', schema_name='jnimusiima_sandbox')
    for i in result:
        print(i)
