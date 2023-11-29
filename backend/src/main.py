import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db_util import Redshift
from services.db_object_service import get_database_object_hierarchy, get_database_owner, get_tables_in_schema, get_db_schema_details, \
    get_table_columns, get_table_preview

app = FastAPI()
redshift_client = Redshift(
    host=os.environ['REDSHIFT_HOST'],
    port=5439,
    database=os.environ.get('REDSHIFT_DATABASE', 'dev'),
    username=os.environ['REDSHIFT_USERNAME'],
    password=os.environ['REDSHIFT_PASSWORD'],
    as_dict=False,
)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/db_outline")
def db_outline():
    db_hierarchy = get_database_object_hierarchy(redshift_client)

    return {"data": db_hierarchy}


@app.get("/database_owner/{db_name}")
def database_owner(db_name: str):
    db_owner, _db_name = get_database_owner(redshift_client, db_name)

    return {
        "data": {
            "db_owner": db_owner,
            "db_name": _db_name
        }
    }


@app.get("/database/schemas")
def db_schema_details(db_name: str):
    schema_details = get_db_schema_details(redshift_client, db_name)

    return {"data": schema_details}


@app.get("/tables_in_schema/{schema_name}")
def tables_in_schema(schema_name: str):
    print(schema_name)

    _db_name = schema_name.split(".")[0]
    _schema_name = schema_name.split(".")[1]
    tables_details = get_tables_in_schema(_db_name, _schema_name)

    return {
        "data": tables_details
    }


@app.get("/table_details/{table_name}")
def table_details(table_name: str):
    print("table_details" + table_name)

    _db_name = table_name.split(".")[0]
    _schema_name = table_name.split(".")[1]
    _table_name = table_name.split(".")[2]

    table_columns = get_table_columns(_db_name, _schema_name, _table_name)
    _, table_preview = get_table_preview(_db_name, _schema_name, _table_name)

    return {
        "data": {
            "table_columns": table_columns,
            "table_preview": table_preview,
        }
    }
