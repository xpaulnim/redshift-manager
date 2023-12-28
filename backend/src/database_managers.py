import os
from abc import ABC, abstractmethod
from typing import Tuple, List, Union

from db_util import DbClient, PostgresClient, RedshiftClient


class DatabaseManager(ABC):
    def __init__(self, db_name: str):
        self.db_name = db_name
        self.db_client = self.create_db_client(db_name)

    def get_table_preview(
        self, db_name: str, schema_name: str, table_name: str, limit: int = 100
    ) -> Tuple[List[str], List[Tuple]]:
        table_columns = [
            str(col["col_name"])
            for col in self.get_table_columns(schema_name, table_name)
        ]
        print(f"table columns {table_columns}")

        query = f"""
            select {','.join(table_columns)}
            from "{db_name}"."{schema_name}"."{table_name}"
            limit {limit};
            """

        table_preview = []
        for result in self.db_client.query(query, batch_size=limit):
            table_preview.extend(result)

        return table_columns, table_preview

    @abstractmethod
    def create_db_client(self, db_name: str) -> DbClient:
        pass

    @abstractmethod
    def get_table_columns(self, schema_name: str, table_name: str):
        pass

    @abstractmethod
    def get_table_comment(self, schema_name: str, table_name: str):
        pass

    @abstractmethod
    def get_tables_in_schema(self, schema_name: str):
        pass

    @abstractmethod
    def get_db_owner(self, db_name: str):
        pass

    @abstractmethod
    def get_table_owner(self, schema_name: str, table_name: str):
        pass

    @abstractmethod
    def get_db_schema_details(self):
        pass

    @abstractmethod
    def get_db_object_hierarchy(self):
        pass

    @abstractmethod
    def get_user_groups(self, username: str):
        pass

    @abstractmethod
    def get_user_roles(self, username: str):
        pass

    @abstractmethod
    def get_users(self):
        pass

    @abstractmethod
    def get_default_schema_privileges(self, schema_name: str):
        pass

    @abstractmethod
    def get_schema_access_privileges(self, schema_name: str):
        pass

    @abstractmethod
    def get_db_access_privileges(self):
        pass


class PostgresManager(DatabaseManager):
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
        query = """
        select datname as db_name,
               pg_get_userbyid(datdba) as db_owner,
               'local' as database_type,
               description,
               datallowconn,
               datconfig,
               datacl,
               database_options
        from pg_database;
        """

        db_privileges = []
        for batch in self.db_client.query(query=query):
            for (
                db_name,
                db_owner,
                database_type,
                description,
                datallowconn,
                datconfig,
                datacl,
                database_options,
            ) in batch:
                db_privileges.append(
                    {
                        "db_name": db_name,
                        "db_owner": db_owner,
                        "database_type": database_type,
                        "description": description,
                        "datallowconn": datallowconn,
                        "datconfig": datconfig,
                        "datacl": self.parse_acl(datacl, "databases"),
                        "database_options": database_options,
                    }
                )

        return db_privileges

    def get_db_object_hierarchy(self):
        hierarchy = {}

        for db_name in self.get_database_names():
            db_client = self.create_db_client(db_name)

            query = """
            select table_catalog as db_name,
                   table_schema,
                   table_name,
                   table_type
            from information_schema.tables;
            """
            for result in db_client.query(query):
                for _, table_schema, table_name, table_type in result:
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
        db_client = self.create_db_client(self.db_name)

        query = """
        select nspname  as schema_name,
               nspowner as schema_owner,
               'local'  as schema_type
        from pg_namespace
        """

        schema_details = []
        for _, schema_name, schema_owner in db_client.query(query):
            schema_details.append(
                {
                    "schema_name": schema_name,
                    "schema_owner": schema_owner,
                }
            )

        return schema_details

    def get_user_roles(self, username):
        raise NotImplementedError()

    def get_table_columns(self, schema_name: str, table_name: str):
        query = f"""
        select table_name,
               column_name,
               data_type as col_type,
               'unknown' as col_comment
        from information_schema.columns
        where table_schema = '{schema_name}' and table_name = '{table_name}';
        """

        column_details = []
        for result in self.db_client.query(query):
            for table_name, column_name, col_type, col_comment in result:
                column_details.append(
                    {
                        "table_name": table_name,
                        "col_name": column_name,
                        "col_type": col_type,
                        "col_comment": "unknown",
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
        table_details = []

        query = """
        select table_catalog as db_name,
               table_schema,
               table_name,
               table_type
        from information_schema.tables;
        """
        for result in self.db_client.query(query):
            for actual_db_name, table_schema, table_name, table_type in result:

                table_owner = None
                try:
                    table_owner = self.get_table_owner(schema_name, table_name)[
                        "tableowner"
                    ]
                except Exception as e:
                    print(f"table_owner not found for {table_owner}")
                    print(e)

                table_details.append(
                    {
                        "db": actual_db_name,
                        "schema_name": schema_name,
                        "table_name": table_name,
                        "table_owner": table_owner,
                        "created_at": "unknown",
                        "size": "unknown",
                        "table_desc": self.get_table_comment(schema_name, table_name),
                    }
                )

        return table_details

    def get_db_owner(self, db_name: str):
        query = f"""
        select pg_get_userbyid(datdba) as db_owner,
               datname as db_name
        from pg_database db
        where datname = '{self.db_name}'
        """

        return self.db_client.one(query)

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


class RedshiftManager(PostgresManager):
    def __init__(self, db_name: str = "dev"):
        super().__init__(db_name)

    def create_db_client(self, db_name: str, as_dict=False):
        # TODO: Make this generic and inject it into the class
        return RedshiftClient(
            host=os.environ["REDSHIFT_HOST"],
            port=5439,
            database=db_name,
            username=os.environ["REDSHIFT_USERNAME"],
            password=os.environ["REDSHIFT_PASSWORD"],
            as_dict=as_dict,
        )

    def get_tables_in_schema(self, schema_name: str):
        query = f"""
        select "database" as db,
               "schema" as schema_name,
               "table" as table_name,
               create_time,
               size as table_size
        from  svv_table_info
        where database = '{self.db_name}' and  schema = '{schema_name}';
        """

        table_details = []
        for result in self.db_client.query(query):
            for db_name, schema_name, table_name, creation_time, table_size in result:
                table_owner = None
                try:
                    table_owner = self.get_table_owner(schema_name, table_name)[
                        "tableowner"
                    ]
                except Exception as e:
                    print(f"table_owner not found for {table_owner}")
                    print(e)

                table_details.append(
                    {
                        "db": db_name,
                        "schema_name": schema_name,
                        "table_name": table_name,
                        "table_owner": table_owner,
                        "created_at": creation_time,
                        "size": table_size,
                        "table_desc": self.get_table_comment(schema_name, table_name),
                    }
                )

        return table_details

    def get_db_owner(self, db_name: str):
        query = f"""
        select pg_get_userbyid(database_owner) as db_owner,
               db.database_name as db_name
        from svv_redshift_databases db
        where database_name = '{self.db_name}'
        ;
        """

        return self.db_client.one(query)

    def get_db_schema_details(self):
        query = f"""
        select schema_name,
               schema_owner,
               schema_type
        from svv_redshift_schemas
        left join pg_user u on schema_owner = u.usesysid
        where database_name = '{self.db_name}'
        """

        schema_details = []
        for _, schema_name, schema_owner in self.db_client.query(query):
            schema_details.append(
                {
                    "schema_name": schema_name,
                    "schema_owner": schema_owner,
                }
            )

        return schema_details

    def get_db_object_hierarchy(self) -> dict:
        query = """
        select database_name,
               schema_name,
               table_name
        from svv_redshift_tables
        where table_type = 'TABLE'
        """

        hierarchy = {}
        for batch in self.db_client.query(query=query):
            for database_name, schema_name, table_name in batch:
                if database_name not in hierarchy:
                    hierarchy[database_name] = {}

                if schema_name not in hierarchy[database_name]:
                    hierarchy[database_name][schema_name] = []

                hierarchy[database_name][schema_name].append(table_name)

        return hierarchy

    def get_user_roles(self, username: str):
        query = f"""
        select user_name as username,
               role_name,
               admin_option
        from svv_user_grants
        where user_name = '{username}';
        """

        user_roles = []
        for batch in self.db_client.query(query=query):
            for username, role_name, admin_option in batch:
                user_roles.append(
                    {
                        "username": username,
                        "role_name": role_name,
                        "admin_option": admin_option,
                    }
                )

        return user_roles

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

    def get_db_access_privileges(self):
        query = """
        select datname as db_name,
               pg_get_userbyid(datdba) as db_owner,
               b.database_type as database_type,
               description,
               datallowconn,
               datconfig,
               datacl,
               database_options
        from pg_database
        left join svv_redshift_databases b on pg_database.datname = b.database_name
        left join pg_description on pg_database.oid = pg_description.objoid;
        """

        db_privileges = []
        for batch in self.db_client.query(query=query):
            for (
                db_name,
                db_owner,
                database_type,
                description,
                datallowconn,
                datconfig,
                datacl,
                database_options,
            ) in batch:
                db_privileges.append(
                    {
                        "db_name": db_name,
                        "db_owner": db_owner,
                        "database_type": database_type,
                        "description": description,
                        "datallowconn": datallowconn,
                        "datconfig": datconfig,
                        "datacl": self.parse_acl(datacl, "databases"),
                        "database_options": database_options,
                    }
                )

        return db_privileges
