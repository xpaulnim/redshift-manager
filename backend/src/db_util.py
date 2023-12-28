import os

import sqlalchemy
from sqlalchemy.engine.url import URL


class DbClient:
    def __init__(
        self,
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        drivername: str,
        as_dict: bool = True,
        query=None,
        pool_reset_on_return="commit",
        log_sql: bool = True,
        **kwargs,
    ):

        if query is None:
            query = dict()

        self.url = URL.create(
            drivername=drivername,
            host=host,
            port=port,
            database=database,
            username=username,
            password=password,
            query=query,
        )

        self.engine = sqlalchemy.create_engine(
            self.url,
            pool_reset_on_return=pool_reset_on_return,
        )
        self.as_dict = as_dict
        self.log_sql = log_sql

        print(f"Querying {self.url.host}:{self.url.port}")

    def query(self, query, batch_size=500):
        if self.log_sql:
            print(f"{query}\n")

        with self.engine.connect() as conn:
            result = conn.execute(query)
            line_batch = result.fetchmany(batch_size)

            while line_batch:
                yield self._as_dict(line_batch)
                line_batch = result.fetchmany(batch_size)

    def one(self, query):
        if self.log_sql:
            print(f"{query}\n")

        with self.engine.connect() as conn:
            result = conn.execute(query)

            return self._as_dict(result.one())

    def execute(self, query: str, log_query: bool = False):
        if self.log_sql:
            if log_query:
                print(f"{query}\n")
            else:
                print(f"{query[:150]} ...\n")

        with self.engine.connect() as conn:
            conn.execute(query)

    def _as_dict(self, row):
        if self.as_dict and row:
            if isinstance(row, list):
                return [dict(r) for r in row]
            else:
                return dict(row)
        else:
            return row


class PostgresClient(DbClient):
    def __init__(
        self,
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        as_dict: bool = True,
        query=None,
        pool_reset_on_return="commit",
        log_sql: bool = True,
        **kwargs,
    ):
        super().__init__(
            host=host,
            port=port,
            database=database,
            username=username,
            password=password,
            as_dict=as_dict,
            query=query,
            pool_reset_on_return=pool_reset_on_return,
            log_sql=log_sql,
            drivername="postgresql+psycopg2",
            **kwargs,
        )


class RedshiftClient(DbClient):
    def __init__(
        self,
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
        as_dict: bool = True,
        query=None,
        pool_reset_on_return="commit",
        log_sql: bool = True,
        **kwargs,
    ):
        super().__init__(
            host=host,
            port=port,
            database=database,
            username=username,
            password=password,
            as_dict=as_dict,
            query=query,
            pool_reset_on_return=pool_reset_on_return,
            log_sql=log_sql,
            drivername="redshift+redshift_connector",
            **kwargs,
        )


class SQLiteClient(DbClient):
    def __init__(
        self,
        absolute_db_file_path: str,
        as_dict: bool = True,
        log_sql: bool = True,
        **kwargs,
    ):
        super().__init__(
            host=None,
            port=None,
            database=absolute_db_file_path,
            username=None,
            password=None,
            as_dict=as_dict,
            query=None,
            log_sql=log_sql,
            drivername="sqlite",
            **kwargs,
        )
