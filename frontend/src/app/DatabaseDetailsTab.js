import {TabContainer} from "./TabComponent";
import React from "react";

export default function DatabaseDetailsTab(props) {
    return (
        <TabContainer tabs={[
            {
                "header": "Schemas",
                "content": <p>Table with columns Name, Created at, Owner, Popularity</p>
            },
            {
                "header": "Details",
                "content": <p>Details, like when the database was created and who created it, whether it is an external
                    db, if so what it's iam is and the store it uses - name, database name, owner, full name, created at,
                created by, updated at, updated by, type, size</p>
            },
            {
                "header": "Permissions",
                "content": <p>Who can use and access this database</p>
            }
        ]}/>
    )
}
