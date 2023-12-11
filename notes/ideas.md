#### feature set
- [ ] filter users by group & role
- [ ] database object hierarchy (db, schema, table/view/function)
- [ ] display user privilege manager
- [ ] edit user privileges eg I can see what the user can do and visually edit it (and undo)
- [ ] display role hierarchy
- [ ] permissions outline
- [ ] user, group and role management eg assign users to groups
- [ ] retain table stats for longer
- [ ] search - query history and database objects
- [ ] table / view popularity - determine this by checking the query history 
- [ ] generate plans for already queries
- [ ] create and manage column masks visually eg search for a column and choose what mask to use - policy can be created for you
- [ ] add comments to objects
- [ ] search object comments & encourage comments
- [ ] table, schema, database growth over time
- [ ] upload common file formats into redshift table
- [ ] for redshift, WYSIWYG WLM management
- [ ] materialized view hierarchy (stv_mv_deps)
- [ ] actually apply default privileges to all objects in schema - show ui that allows user selection, but has option for all  
- [ ] filter by destructive ddls eg drop & alter
- [ ] how does the user inherit specific permissions?

#### divergent features - 
- [ ] upload common data formats for visualisation - sold as a way to stop users uploading company data to random websites 

#### UX
- [ ]  create generic masks like last name, email, phone number or address mask, then apply masks by selecting column and choosing one 
    from drop down or allow upload of file containing columns to be masked and mask to use
- [ ] distinguish between tables and view
- [ ] when a new redshift database connection, ask if user wants to enable certain useful defaults like user_activity_logging,
      retaining query history longer than a week, etc. For each, explain why its needed
- [ ] dots under potentially unknown terms that define what the term does

#### name ideas
* redshift buddy
* redshift partner
* redshift config
* redshift manager
* data companion
* data workmake

#### taglines
* stop managing databases with sql queries
* improve redshift configuration productivity by 50%

