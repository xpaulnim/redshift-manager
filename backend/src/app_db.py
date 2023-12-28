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
            port text not null,
            username text not null,
            password text not null,
            db_name text
        )
        """
        )

    def add_db_connection(
        self,
        connection_name: str,
        db_type: str,
        hostname: str,
        port: str,
        username: str,
        password: str,
        db_name: str = None,
    ):
        query = f"""
        insert into db_connections(
            created_at,
            connection_name,
            db_type,
            hostname,
            port,
            username,
            password,
            db_name
        ) values (
            '{datetime.utcnow().strftime('%s')}',
            '{connection_name}',
            '{db_type}',
            '{hostname}',
            '{port}',
            '{username}',
            '{password}',
            '{db_name}'
        )
        """

        self.sqlite_client.execute(query)

    def get_db_connections(self, db_connection_id: int = None):
        id_filter = f"and id = {db_connection_id}" if db_connection_id else ""
        query = f"""
        select id,
               created_at,
               connection_name,
               db_type,
               hostname,
               port,
               username,
               password,
               db_name
        from db_connections
        where 1=1
        {id_filter}
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
                port,
                username,
                password,
                db_name,
            ) in batch:
                db_connections.append(
                    {
                        "id": id,
                        "created_at": created_at,
                        "connection_name": connection_name,
                        "db_type": db_type,
                        "hostname": hostname,
                        "port": port,
                        "username": username,
                        "password": password,
                        "db_name": db_name,
                    }
                )

        return db_connections
