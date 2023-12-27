import os
from abc import ABC, abstractmethod
from typing import Tuple, List, Union

from db_util import DbClient


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
