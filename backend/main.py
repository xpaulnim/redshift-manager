from typing import Union

from fastapi import FastAPI

from sample_data import SAMPLE_USERS, SAMPLE_GROUPS, SAMPLE_QUERIES, SAMPLE_DATABASES

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/users")
def users():
    return SAMPLE_USERS


@app.get("/groups")
def groups():
    return SAMPLE_GROUPS


@app.get("/queries")
def queries():
    return SAMPLE_QUERIES


@app.get("/databases")
def databases():
    return SAMPLE_DATABASES
