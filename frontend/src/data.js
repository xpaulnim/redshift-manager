export const users = [
    {
        "id": 1,
        "name": "admin",
        "email": "admin@email.com",
        "created_on": "2023-08-01 12:30:05",
        "groups": ["admin"],
        "roles": ["reader"],
        "last_login": "2023-02-06 09:00:00 UTC",
        "password_changed": "2021-02-06 09:00:00 UTC",
    },
    {
        "id": 2,
        "name": "pnim",
        "email": "pnim@email.com",
        "created_on": "2023-08-01 12:30:05",
        "groups": ["engineering"],
        "roles": ["reader", "creator"],
        "last_login": "2023-02-06 09:00:00 UTC",
        "password_changed": "2022-02-06 09:00:00 UTC",
    },
    {
        "id": 3,
        "name": "mobjazz",
        "email": "mobjazz@email.com",
        "created_on": "2023-08-01 12:30:05",
        "groups": ["marketing"],
        "roles": ["reader", "creator"],
        "last_login": "2023-02-06 09:00:00 UTC",
        "password_changed": "2023-02-06 09:00:00 UTC",
    }
]

export const groups = [
    { 
        "id": 1,
        "name": "admin",
        "users": ["admin"]
    },
    {
        "id": 2,
        "name": "marketing",
        "users": ["mobjazz"],
    },
    {
        "id": 3,
        "name": "engineering", 
        "users": ["jnimusiima"]
    }
]

export const user_queries = [
    {
        "user": "jnimusiima", 
        "queries": [
            {
                "id": 1,
                "query": "select * from transaction"
            },
            {
                "id": 2,
                "query": "select * from users"
            },
            {
                "id": 3,
                "query": "select * from transaction limit 10"
            }
        ]
    },
    {
        "user": "mobjazz",
        "queries": [
            {
                "id": 4,
                "query": "select * from ad_events"
            },
            {
                "id": 5,
                "query": "select * from users"
            },
            {
                "id": 6,
                "query": "select * from ad_events join users on userid"
            }
        ]
    }
]
