import {TabContainer} from "./TabComponent";
import React from "react";

export default function TableDetailsTab({tableId}) {
    return (
        <TabContainer tabs={[
            {
                "header": "Columns",
                "content": <p>A table of column name, type and comment</p>
            },
            {
                "header": "Sample data",
                "content": <p>Select top n from the table</p>
            },
            {
                "header": "details",
                "content": <p>Type eg external, if external storage location & properties, Created At, table Id and
                    other stuff from table info </p>
            },
            {
                "header": "Permissions",
                "content": <p>Who can access this table and what can they do</p>
            },
            {
                "header": "History",
                "content": <p>DDL statements that have previously been run against this table</p>
            },
            {
                "header": "Insights",
                "content": <p>Breakdown of the previous access to this table. eg queries over the last n days, who
                    queries the table and how much it has grown</p>
            }
        ]}/>
    )
}