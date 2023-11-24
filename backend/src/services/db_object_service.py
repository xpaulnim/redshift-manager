import os

from db_util import Redshift


def get_database_object_hierarchy(redshift_client: Redshift) -> dict:
    query = """
    select database_name,
           schema_name,
           table_name
    from dev.pg_catalog.svv_redshift_tables
    """

    hierarchy = {}
    for batch in redshift_client.query(query=query):
        for database_name, schema_name, table_name in batch:
            if database_name not in hierarchy:
                hierarchy[database_name] = {}

            if schema_name not in hierarchy[database_name]:
                hierarchy[database_name][schema_name] = []

            hierarchy[database_name][schema_name].append(table_name)

    return hierarchy


if __name__ == '__main__':
    client = Redshift(
        host=os.environ['REDSHIFT_HOST'],
        port=5439,
        database=os.environ.get('REDSHIFT_DATABASE', 'dev'),
        username=os.environ['REDSHIFT_USERNAME'],
        password=os.environ['REDSHIFT_PASSWORD'],
        as_dict=False
    )

    objs = get_database_object_hierarchy(client)
    print(objs)
