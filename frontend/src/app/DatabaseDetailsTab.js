import {TabContainer} from "./TabComponent";
import React from "react";

export default function DatabaseDetailsTab(props) {
    return (
        <TabContainer tabs={[
            {
                "header": "Schemas",
                "content": <p>This database has the following schemas</p>
            },
            {
                "header": "Details",
                "content": <p>Details, like when the database was created and who created it, whether it is an external
                    db, if so what it's iam is and the store it uses</p>
            },
            {
                "header": "Permissions",
                "content": <p>Who can use this database</p>
            }
        ]}/>
    )
}