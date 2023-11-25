import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db_util import Redshift
from services.db_object_service import get_database_object_hierarchy, get_database_owner

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
    database_name = "dbt"
    db_owner, _db_name = get_database_owner(redshift_client, database_name)

    return {
        "data": {
            "db_owner": db_owner,
            "db_name": _db_name
        }
    }
