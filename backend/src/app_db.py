from datetime import datetime
from pathlib import Path

from db_util import SQLiteClient


class AppDb:
    sqlite_client = SQLiteClient(
        absolute_db_file_path=str(Path().absolute() / "redshift_manager.db"),
        as_dict=False,
    )

    def __init__(self) -> None:
        self.create_tables()

    def create_tables(self):
        self.sqlite_client.execute(
            """
        create table if not exists db_connections(
            id integer primary key autoincrement,
            created_at integer not null,
            connection_name text not null,
            db_type text not null,
            hostname text not null,
            username text not null,
            password text not null
        )
        """
        )

    def add_db_connection(
        self,
        connection_name: str,
        db_type: str,
        hostname: str,
        username: str,
        password: str,
    ):
        query = f"""
        insert into db_connections(
            created_at,
            connection_name,
            db_type,
            hostname,
            username,
            password
        ) values (
            '{datetime.utcnow().strftime('%s')}',
            '{connection_name}',
            '{db_type}',
            '{hostname}',
            '{username}',
            '{password}'
        )
        """

        self.sqlite_client.execute(query)

    def get_db_connection(self):
        query = """
        select id,
               created_at,
               connection_name,
               db_type,
               hostname,
               username,
               password
        from db_connections
        """

        db_connections = []
        for batch in self.sqlite_client.query(query):
            print(batch)
            for (
                id,
                created_at,
                connection_name,
                db_type,
                hostname,
                username,
                password,
            ) in batch:
                db_connections.append(
                    {
                        "id": id,
                        "created_at": created_at,
                        "connection_name": connection_name,
                        "db_type": db_type,
                        "hostname": hostname,
                        "username": username,
                        "password": password,
                    }
                )

        return db_connections
