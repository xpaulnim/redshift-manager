import React, {useState} from 'react'
import {Grid} from "@mui/material";
import DbObjectDetails from "./DbObjectDetails";
import {DbObjectTreeView} from "./DbObjectTreeView";


let databasesOutline = [
    {
        "name": "dev",
        "schemas": [
            {
                "name": "public",
                "tables": [
                    "transactions",
                    "click_events",
                    "purchases",
                    "sample_table"
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

export function DbObjectExplorer(props) {
    const [objectSelected, showObjectDetails] = useState({
        "objectType": "database",
        "objectName": "dev"
    })

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <DbObjectTreeView
                    databaseOutline={databasesOutline}
                    onDbObjectSelected={showObjectDetails}/>
            </Grid>

            <Grid item xs={8}>
                <DbObjectDetails objectSelected={objectSelected}/>
            </Grid>
        </Grid>
    )
}
