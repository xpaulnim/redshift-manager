SAMPLE_USERS = [
    {
        "id": 1,
        "name": "admin",
        "created_on": "2023-08-01 12:30:05",
        "group": "admin"
    },
    {
        "id": 2,
        "name": "jnimusiima",
        "created_on": "2023-08-01 12:30:05",
        "group": "engineering"
    },
    {
        "id": 3,
        "name": "mobjazz",
        "created_on": "2023-08-01 12:30:05",
        "group": "marketing"
    }
]


SAMPLE_GROUPS = [
    { 
        "id": 1,
        "name": "admin",
        "users": ["admin"]
    },
    {
        "id": 2,
        "name": "marketing",
        "users": ["mobjazz"]
    },
    {
        "id": 3,
        "name": "engineering", 
        "users": ["jnimusiima"]
    }
]

SAMPLE_QUERIES = [
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

SAMPLE_DATABASES = [
    {
        "id": "5",
        "name": "dev",
        "owner": "admin",
        "schemas": [
            {
                "id": "4",
                "name": "public",
                "owner": "admin",
                "comment": "default schema",
                "tables": [
                    {
                        "id": "1",
                        "name": "users",
                        "owner": "admin",
                        "size": "50",
                        "created_at": "2023-08-01 12:30:05",
                    },
                    {
                        "id": "2",
                        "name": "transaction",
                        "owner": "admin",
                        "size": "50",
                        "created_at": "2023-08-01 12:30:05",
                    },
                    {
                        "id": "3",
                        "name": "ad_events",
                        "owner": "admin",
                        "size": "500",
                        "created_at": "2023-08-01 12:30:05",
                    }
                ]
            }
        ]
    }
]
