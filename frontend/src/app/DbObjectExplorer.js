import React, {useState} from 'react'
import {Grid} from "@mui/material";
import DbObjectDetails from "./DbObjectDetails";
import {DbObjectTreeView} from "./DbObjectTreeView";
import {useDispatch, useSelector} from "react-redux";

export function DbObjectExplorer(props) {
    const [objectSelected, showObjectDetails] = useState({
        "objectType": "database",
        "objectName": "dev"
    })

    const dispatch = useDispatch()
    const dbOutline = useSelector(state => state.dbOutline)

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <DbObjectTreeView
                    databaseOutline={dbOutline}
                    onDbObjectSelected={showObjectDetails}/>
            </Grid>

            <Grid item xs={8}>
                <DbObjectDetails objectSelected={objectSelected}/>
            </Grid>
        </Grid>
    )
}
