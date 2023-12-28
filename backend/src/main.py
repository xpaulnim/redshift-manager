from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app_db import AppDb

from database_managers import PostgresManager, RedshiftManager

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app_db = AppDb()


def global_db_service(db_connection_id: int, db_name: str = None):
    result = app_db.get_db_connections(db_connection_id)
    if result and len(result) == 1:
        print(result[0])
        db_connection = result[0]
        if db_connection["db_type"].lower() == "redshift":
            return RedshiftManager(
                hostname=db_connection["hostname"],
                port=int(db_connection["port"]),
                db_name=db_name or db_connection.get("db_name", "dev"),
                username=db_connection["username"],
                password=db_connection["password"],
            )
        elif db_connection["db_type"].lower() == "postgres":
            return PostgresManager(
                hostname=db_connection["hostname"],
                port=int(db_connection["port"]),
                db_name=db_name or db_connection.get("db_name", "postgres"),
                username=db_connection["username"],
                password=db_connection["password"],
            )

    print(f"unknown db connection id {db_connection_id}")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/{db_connection_id}/db_outline")
def db_outline(db_connection_id: int):
    db_service = global_db_service(db_connection_id)
    db_hierarchy = db_service.get_db_object_hierarchy()

    return {"data": db_hierarchy}


@app.get("/{db_connection_id}/database_owner/{db_name}")
def database_owner(db_connection_id: int, db_name: str):
    db_service = global_db_service(db_connection_id, db_name)
    db_owner, _db_name = db_service.get_db_owner()

    return {"data": {"db_owner": db_owner, "db_name": _db_name}}


@app.get("/{db_connection_id}/database/schemas")
def db_schema_details(db_connection_id: int, db_name: str):
    db_service = global_db_service(db_connection_id, db_name)
    schema_details = db_service.get_db_schema_details()

    return {"data": schema_details}


@app.get("/{db_connection_id}/tables_in_schema/{schema_name}")
def tables_in_schema(db_connection_id: int, schema_name: str):
    print(db_connection_id, schema_name)

    _db_name = schema_name.split(".")[0]
    _schema_name = schema_name.split(".")[1]

    db_service = global_db_service(db_connection_id, _db_name)
    tables_details = db_service.get_tables_in_schema(_schema_name)

    return {"data": tables_details}


@app.get("/{db_connection_id}/schema_access_privileges/{schema_name}")
def schema_access_privileges(db_connection_id: int, schema_name: str):
    print(db_connection_id, schema_name)

    _db_name = schema_name.split(".")[0]
    _schema_name = schema_name.split(".")[1]

    db_service = global_db_service(db_connection_id, _db_name)
    schema_privileges = db_service.get_schema_access_privileges(_schema_name)

    return {"data": schema_privileges}


@app.get("/{db_connection_id}/default_schema_access_privileges/{schema_name}")
def default_schema_access_privileges(db_connection_id: int, schema_name: str):
    _db_name = schema_name.split(".")[0]
    _schema_name = schema_name.split(".")[1]

    db_service = global_db_service(db_connection_id, _db_name)
    default_privileges = db_service.get_default_privileges(_schema_name)

    return {"data": default_privileges}


@app.get("/{db_connection_id}/table_details/{table_name}")
def table_details(db_connection_id: int, table_name: str):
    print("table_details" + table_name)

    _db_name = table_name.split(".")[0]
    _schema_name = table_name.split(".")[1]
    _table_name = table_name.split(".")[2]

    db_service = global_db_service(db_connection_id, _db_name)
    table_columns = db_service.get_table_columns(_schema_name, _table_name)
    _, table_preview = db_service.get_table_preview(_db_name, _schema_name, _table_name)

    return {
        "data": {
            "table_columns": table_columns,
            "table_preview": table_preview,
        }
    }


@app.get("/{db_connection_id}/user_list")
def list_users(
    db_connection_id: int,
):
    db_service = global_db_service(db_connection_id)
    user_list = db_service.get_users()

    return {"data": user_list}


@app.post("/create_db_conn")
async def create_db_conn(request: Request):
    body = await request.json()
    print(body)

    app_db.add_db_connection(
        connection_name=body["connectionName"],
        db_type=body["dbType"],
        hostname=body["hostname"],
        port=body["port"],
        username=body["username"],
        password=body["password"],
        db_name=body["dbName"],
    )

    return {"data": "Success"}


@app.get("/db_connections")
def db_connections():
    result = app_db.get_db_connections()

    return {"data": result}
