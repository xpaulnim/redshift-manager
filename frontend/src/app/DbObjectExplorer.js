import React, {useEffect, useState} from 'react'
import {Grid, Stack, TextField} from "@mui/material"
import DbObjectDetails from "./DbObjectDetails"
import {DbObjectTreeView} from "./DbObjectTreeView"
import {useDispatch, useSelector} from "react-redux"
import {queryBackendThunk} from "../features/dbOutlineSlice"

export function DbObjectExplorer(props) {
    const [objectSelected, showObjectDetails] = useState({
        "objectType": "database",
        "objectName": "dev"
    })

    const dispatch = useDispatch()
    const dbOutline = useSelector(state => state.dbOutline)  // state store
    const dbOutlineStatus = useSelector(state => state.dbOutline.status)
    
    // TODO: Seems to be invoked twice
    useEffect(() => {
        console.log("dbOutlineStatus:" + dbOutlineStatus)
        if (dbOutlineStatus === 'init') {
            dispatch(queryBackendThunk())
        }
    }, [dbOutlineStatus, dispatch]) 

    return (
        <Grid container spacing={2}>
            <Stack spacing={2}>
                <TextField label="Filter" id="outlined-basic" variant="outlined" />

                <Grid item xs={4}>
                    <DbObjectTreeView
                        databaseOutline={dbOutline.data}
                        onDbObjectSelected={ showObjectDetails }/>
                </Grid>
            </Stack>

            <Grid item xs={8}>
                <button onClick={ () => dispatch(queryBackendThunk()) }>fetch details</button>
                <DbObjectDetails objectSelected={objectSelected}/>
            </Grid>
        </Grid>
    )
}
