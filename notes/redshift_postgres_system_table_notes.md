### redshift specific notes
#### user creation timestamp
> Audit logging is not enabled by default in Amazon Redshift.
> For the user activity log, you must enable the enable_user_activity_logging database parameter. If you enable only the audit logging feature, but not the associated parameter, the database audit logs will log information for only the connection log and user log, but not for the user activity log. The enable_user_activity_logging parameter is disabled (false) by default, but you can set it to true to enable the user activity log. Refer below link for more information.
> GOTO: Default Parameter Values
> If I’ve made a bad assumption please comment and I’ll refocus my answer.

quote linked from [this stack overflow message](https://stackoverflow.com/questions/44021531/user-creation-timestamp-in-amazon-redshift)

### user & access checks 
#### simulate a user
```sql
set session authorization  ${username};
select top 10 * from "dev"."jnimusiima_sandbox"."credit_cards";
set session authorization  default;
```
#### verify user access to an object
```sql
-- select, insert, update, delete, references
select has_table_privilege('user', 'jnimusiima.credit_cards', 'select'::text)
```

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

#### understanding acls
Links: [System catalog tables](https://docs.aws.amazon.com/redshift/latest/dg/c_intro_catalog_views.html)
Each of the letter in `arwdRxtD` represent a specific type of grant:
```
a: insert
r: select
w: update
d: delete
R: rule
x: references
t: trigger
D: drop
```
These are table levels..  you can see them in `relacl`  column in table `pg_class`, `PG_DATABASE_INFO`
Similarly for schema, there are three:
```
C: create
T: temporary
U: usage
```
These are stored in nspacl column in table pg_namespace
Also there is a standard pattern of these grants: `<grantee>=<grants>/granter`
e.g.  `group domain_core_read_write=arwdxD/owner__domain_core`
... here group `domain_core_read_write`  is grantee (to whom permissions are granted.
`owner__domain_core`  is granter (who granted the permissions) and `arwdxD`  is the list of grants.
I hope this is useful. Sorry I could not find a good document which cover these.
These are also available in `PG_DEFAULT_ACL` table for relation (table or view), 
function or stored procedures.. this tables contains all the default privileges 
(which are like default grants)

`pg_default_acl` does not include default privileges granted to roles


#### questions
* what does regclass mean?
* given an object, can I determine how the user gets access to the table, ie direct grant, role, group


#### glossary
| Term         | Description      |
|--------------|------------------|
| pg_class     | database tables  |
| pg_namespace | database schemas |
