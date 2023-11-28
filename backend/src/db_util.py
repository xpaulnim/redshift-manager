import os

import sqlalchemy
from sqlalchemy.engine.url import URL


class Redshift:
    def __init__(
            self,
            host: str,
            port: int,
            database: str,
            username: str,
            password: str,
            as_dict: bool=True,
            drivername: str = "redshift+redshift_connector",
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


def create_redshift_client(database: str, as_dict=False):
    return Redshift(
        host=os.environ['REDSHIFT_HOST'],
        port=5439,
        database=database,
        username=os.environ['REDSHIFT_USERNAME'],
        password=os.environ['REDSHIFT_PASSWORD'],
        as_dict=as_dict,
    )
