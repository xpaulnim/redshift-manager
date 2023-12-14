import os
from typing import List, Tuple

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


if __name__ == '__main__':
    client = Redshift(
        host=os.environ['REDSHIFT_HOST'],
        port=5439,
        database=os.environ.get('REDSHIFT_DATABASE', 'dev'),
        username=os.environ['REDSHIFT_USERNAME'],
        password=os.environ['REDSHIFT_PASSWORD'],
        as_dict=False
    )

    cols, values = get_table_preview(db_name='dev', schema_name='jnimusiima_sandbox', table_name='credit_cards')

    print(cols)
    for obj in values:
        print(obj)

    cols = get_table_columns(db_name='dev', schema_name='jnimusiima_sandbox', table_name='credit_cards')
    for i in cols:
        print(i)
