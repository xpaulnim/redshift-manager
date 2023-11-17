from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("db_outline")
def read_item():
    return {
        "data": [
            {
                "name": "dev",
                "schemas": [
                    {
                        "name": "public",
                        "tables": [
                            "transactions",
                            "click_events",
                            "purchases",
                            "sample_table"
                        ]
                    }
                ]
            },
            {
                "name": "prod",
                "schemas": [
                    {
                        "name": "public",
                        "tables": [
                            "transactions",
                            "click_events",
                            "purchases"
                        ]
                    }
                ]
            }
        ]
    }
