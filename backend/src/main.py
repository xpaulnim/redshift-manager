from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.postgres_service import PostgresManagerService

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

global_db_service = PostgresManagerService


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/db_outline")
def db_outline():
    db_service = global_db_service()
    db_hierarchy = db_service.get_db_object_hierarchy()

    return {"data": db_hierarchy}


@app.get("/database_owner/{db_name}")
def database_owner(db_name: str):
    db_service = global_db_service(db_name)
    db_owner, _db_name = db_service.get_db_owner(db_name)

    return {"data": {"db_owner": db_owner, "db_name": _db_name}}


@app.get("/database/schemas")
def db_schema_details(db_name: str):
    db_service = global_db_service(db_name)
    schema_details = db_service.get_db_schema_details()

    return {"data": schema_details}


@app.get("/tables_in_schema/{schema_name}")
def tables_in_schema(schema_name: str):
    print(schema_name)

    _db_name = schema_name.split(".")[0]
    _schema_name = schema_name.split(".")[1]

    db_service = global_db_service(_db_name)
    tables_details = db_service.get_tables_in_schema(_schema_name)

    return {"data": tables_details}


@app.get("/schema_access_privileges/{schema_name}")
def schema_access_privileges(schema_name: str):
    print(schema_name)

    _db_name = schema_name.split(".")[0]
    _schema_name = schema_name.split(".")[1]

    db_service = global_db_service(_db_name)
    schema_privileges = db_service.get_schema_access_privileges(_schema_name)

    return {"data": schema_privileges}


@app.get("/default_schema_access_privileges/{schema_name}")
def default_schema_access_privileges(schema_name: str):
    _db_name = schema_name.split(".")[0]
    _schema_name = schema_name.split(".")[1]

    db_service = global_db_service(_db_name)
    default_privileges = db_service.get_default_privileges(_schema_name)

    return {"data": default_privileges}


@app.get("/table_details/{table_name}")
def table_details(table_name: str):
    print("table_details" + table_name)

    _db_name = table_name.split(".")[0]
    _schema_name = table_name.split(".")[1]
    _table_name = table_name.split(".")[2]

    db_service = global_db_service(_db_name)
    table_columns = db_service.get_table_columns(_schema_name, _table_name)
    _, table_preview = db_service.get_table_preview(_db_name, _schema_name, _table_name)

    return {
        "data": {
            "table_columns": table_columns,
            "table_preview": table_preview,
        }
    }


@app.get("/user_list")
def list_users():
    db_service = global_db_service()
    user_list = db_service.get_users()

    return {"data": user_list}
