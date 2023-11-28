### object comments
#### add a comment to a column
```sql
-- get a table comment
select obj_description('jnimusiima_sandbox.credit_cards'::regclass);

select *
from pg_catalog.pg_description
where objoid = (
    select oid
    from pg_class
    where relname = 'credit_cards' and relnamespace = (select oid from pg_catalog.pg_namespace where nspname = 'jnimusiima_sandbox')
);

-- add a comment to a column
comment ON column dev.jnimusiima.credit_cards.customer_id  is 'not sure what this does';

-- get the comment from the db
with table_columns as (
    select *
    from pg_get_cols('jnimusiima_sandbox.credit_cards') cols(
                                                             view_schema name,
                                                             view_name name,
                                                             col_name name,
                                                             col_type varchar,
                                                             col_num int)
)
select col_name, col_description('jnimusiima_sandbox.credit_cards'::regclass, col_num)
from table_columns;
```

#### object creation date
when tables in a database were created. works only for the database you are connected to.
so to you need to create a connection specifically to the database you want to pull table creation date from
```sql
select current_database(),
       trim(nspname)   as schema_name,
       trim(relname)   as table_name,
       relcreationtime as creation_time
from pg_class_info
left join pg_namespace on pg_class_info.relnamespace = pg_namespace.oid
where reltype != 0
  and trim(nspname) not like 'pg_%'
order by schema_name
;
```

#### questions
* what does regclass mean?