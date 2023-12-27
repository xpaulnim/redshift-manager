import os

from db_util import RedshiftClient
from services.postgres_service import PostgresManagerService


class RedshiftManagerService(PostgresManagerService):
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
