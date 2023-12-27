import os
from typing import List, Union

from services.db_service import DatabaseManager
from db_util import PostgresClient


class PostgresManagerService(DatabaseManager):
    def __init__(self, db_name: str = "postgres"):
        super().__init__(db_name)

    @staticmethod
    def create_db_client(db_name: str, as_dict=False):
        # TODO: Make this generic and inject it into the class
        return PostgresClient(
            host=os.environ["POSTGRES_HOST"],
            port=int(os.environ.get("POSTGRES_PORT", 5432)),
            database=db_name,
            username=os.environ["POSTGRES_USERNAME"],
            password=os.environ["POSTGRES_PASSWORD"],
            as_dict=as_dict,
        )

    def get_db_access_privileges(self):
        raise NotImplementedError()

    def get_db_object_hierarchy(self):
        hierarchy = {}

        for db_name in self.get_database_names():
            print(db_name)
            db_client = self.create_db_client(db_name)

            query = """
            select table_catalog as db_name,
                   table_schema,
                   table_name,
                   table_type
            from information_schema.tables;
            """
            for result in db_client.query(query):
                for db_name, table_schema, table_name, table_type in result:
                    if db_name not in hierarchy:
                        hierarchy[db_name] = {}

                    if table_schema not in hierarchy[db_name]:
                        hierarchy[db_name][table_schema] = []

                    hierarchy[db_name][table_schema].append(table_name)

        return hierarchy

    def get_database_names(self):
        query = """
        select datname from pg_database where datallowconn = true;
        """

        db_names = []
        for result in self.db_client.query(query):
            for (datname,) in result:
                db_names.append(datname)

        return db_names

    def get_db_schema_details(self):
        raise NotImplementedError()

    def get_user_roles(self, username):
        raise NotImplementedError()

    def get_table_columns(self, schema_name: str, table_name: str):
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
        for result in self.db_client.query(query):
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

    def get_table_comment(self, schema_name: str, table_name: str):
        try:
            return self.db_client.one(
                f"select obj_description('{schema_name}.{table_name}'::regclass) as desc"
            )["desc"]
        except Exception as e:
            print(e)
            return ""

    def get_tables_in_schema(self, schema_name: str):
        raise NotImplementedError()

    def get_db_owner(self, db_name: str):
        raise NotImplementedError()

    def get_table_owner(self, schema_name: str, table_name: str):
        query = f"""
        select tableowner
        from pg_tables
        where schemaname = '{schema_name}' and tablename = '{table_name}'
        """

        return self.db_client.one(query)

    def get_user_groups(self, username: str):
        query = f"""
        select u.usename as username,
            g.groname as group_name
        from pg_user u
        left join pg_group g on u.usesysid = any (g.grolist)
        where u.usename = '{username}'
        """

        user_groups = []
        for batch in self.db_client.query(query=query):
            for username, group_name in batch:
                user_groups.append(
                    {
                        "username": username,
                        "group_name": group_name,
                    }
                )

        return user_groups

    def get_users(self):
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
        for batch in self.db_client.query(query=query):
            for username, usesuper, usecreatedb, valuntil, useconfig in batch:
                user_list.append(
                    {
                        "username": username,
                        "usesuper": usesuper,
                        "usecreatedb": usecreatedb,
                        "valuntil": valuntil,
                        "groups": self.get_user_groups(username),
                        "roles": self.get_user_roles(username),
                        "useconfig": useconfig,
                    }
                )

        return user_list

    def get_default_schema_privileges(self, schema_name: str):
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
        for batch in self.db_client.query(query=query):
            for schema_name, object_type, default_acl in batch:
                default_privileges.append(
                    {
                        "schema_name": schema_name,
                        "object_type": object_type,
                        "schema_acl": self.parse_acl(
                            acl=default_acl, object_type=object_type
                        ),
                    }
                )

        return default_privileges

    def get_schema_access_privileges(self, schema_name: str):
        query = f"""
        select pg_get_userbyid(nspowner) as schema_owner,
            pg_namespace.nspname as schema_name,
            pg_namespace.nspacl as schema_acl
        from pg_namespace
        where pg_namespace.nspname = '{schema_name}'
        """

        schema_privileges = []
        for batch in self.db_client.query(query=query):
            for schema_owner, schema_name, schema_acl in batch:
                schema_privileges.append(
                    {
                        "schema_name": schema_name,
                        "schema_owner": schema_owner,
                        "schema_acl": self.parse_acl(
                            acl=schema_acl, object_type="schemas"
                        ),
                    }
                )

        return schema_privileges[0] if schema_privileges else []

    @staticmethod
    def extract_acl_permissions(permission_string: str, object_type: str):
        if object_type == "tables":
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
            return {"execute": "X" in permission_string}
        elif object_type in {"schemas", "databases"}:
            return {
                "create": "C" in permission_string,
                "temporary": "T" in permission_string,
                "usage": "U" in permission_string,
            }

        raise Exception(f"{object_type} not recognised")

    def parse_acl(self, acl: Union[str, List[str]], object_type: str):
        grants = []

        if not acl:
            return grants

        if isinstance(acl, str):
            acl = acl.replace("{", "").replace("}", "").split(",")

        for aclstr in acl:
            grantor = aclstr.split("/")[1]
            grantee = aclstr.split("/")[0].split("=")[0]
            permissions = self.extract_acl_permissions(
                aclstr.split("/")[0].split("=")[1], object_type
            )
            grantee_type = "user"
            if len(grantee.split(" ")) == 2:
                grantee_type = grantee.split(" ")[0]
                grantee = grantee.split(" ")[1]

            grants.append(
                {
                    "grantor": grantor,
                    "grantee_type": grantee_type,
                    "grantee": grantee,
                    **permissions,
                }
            )

        return grants

    def get_default_privileges(self, schema_name: str):
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
        for batch in self.db_client.query(query=query):
            for schema_name, object_type, default_acl in batch:
                default_privileges.append(
                    {
                        "schema_name": schema_name,
                        "object_type": object_type,
                        "schema_acl": self.parse_acl(
                            default_acl, object_type=object_type
                        ),
                    }
                )

        return default_privileges
