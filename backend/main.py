from typing import Union

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

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
                            "sample_table",
                            "google_ads",
                            "attributes",
                            "friction"
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
