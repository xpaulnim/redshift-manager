import React, {useEffect, useState} from "react"
import {Grid, Stack, TextField} from "@mui/material"
import DbObjectDetails from "./DbObjectDetails"
import {DbObjectTreeView} from "./DbObjectTreeView"
import {useDispatch, useSelector} from "react-redux"
import {fetchDbOutlineThunk} from "../features/fetchDbOutlineSlice"
import {fetchTablesInSchemaThunk} from "../features/fetchTablesInSchemaSlice"

export function DbObjectExplorer({dbConnectionId}) {
    const [objectSelected, showObjectDetails] = useState({
        "objectSelected": ""
    })

    const dispatch = useDispatch()
    const dbOutline = useSelector(state => state.dbOutline)  // state store
    const dbOutlineStatus = useSelector(state => state.dbOutline.status)

    if (dbOutlineStatus === 'init' && dbConnectionId !== null) {
        dispatch(fetchDbOutlineThunk({"dbConnectionId": dbConnectionId}))
    }

    return (
        <Grid container spacing={2}>
            <Stack spacing={2}>
                <TextField label="Filter" id="outlined-basic" variant="outlined" size="small"/>

                <Grid item xs={4}>
                    <DbObjectTreeView
                        databaseOutline={dbOutline.data}
                        onDbObjectSelected={showObjectDetails}/>
                </Grid>
            </Stack>

            <Grid item xs={8}>
                <DbObjectDetails dbConnectionId={dbConnectionId} objectSelected={objectSelected.objectSelected}/>
            </Grid>
        </Grid>
    )
}
