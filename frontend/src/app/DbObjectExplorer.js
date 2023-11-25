import React, {useEffect, useState} from 'react'
import {Grid, Stack, TextField} from "@mui/material"
import DbObjectDetails from "./DbObjectDetails"
import {DbObjectTreeView} from "./DbObjectTreeView"
import {useDispatch, useSelector} from "react-redux"
import {fetchDbOutlineThunk} from "../features/fetchDbOutlineSlice"

export function DbObjectExplorer(props) {
    const [objectSelected, showObjectDetails] = useState({
        "objectSelected": "dev"
    })

    const dispatch = useDispatch()
    const dbOutline = useSelector(state => state.dbOutline)  // state store
    const dbOutlineStatus = useSelector(state => state.dbOutline.status)

    // TODO: Why does this seem to be invoked twice
    useEffect(() => {
        console.log("dbOutlineStatus:" + dbOutlineStatus)
        if (dbOutlineStatus === 'init') {
            dispatch(fetchDbOutlineThunk())
        }
    }, [dbOutlineStatus, dispatch])

    return (
        <Grid container spacing={2}>
            <Stack spacing={2}>
                <TextField label="Filter" id="outlined-basic" variant="outlined"/>

                <Grid item xs={4}>
                    <DbObjectTreeView
                        databaseOutline={dbOutline.data}
                        onDbObjectSelected={showObjectDetails}/>
                </Grid>
            </Stack>

            <Grid item xs={8}>
                <button onClick={() => dispatch(fetchDbOutlineThunk())}>fetch details</button>
                <DbObjectDetails objectSelected={objectSelected.objectSelected}/>
            </Grid>
        </Grid>
    )
}
