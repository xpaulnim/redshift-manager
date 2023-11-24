import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db_util import Redshift
from services.db_object_service import get_database_object_hierarchy

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
def read_item():
    db_hierarchy = get_database_object_hierarchy(redshift_client)

    return {
        "data": db_hierarchy
    }