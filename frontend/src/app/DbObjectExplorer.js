import React, {useState} from "react"
import {Grid, Stack, Box, TextField} from "@mui/material"
import DbObjectDetails from "./DbObjectDetails"
import {DbObjectTreeView} from "./DbObjectTreeView"
import {useDispatch, useSelector} from "react-redux"
import {fetchDbOutlineThunk} from "../features/fetchDbOutlineSlice"

export function DbObjectExplorer({dbConnectionId}) {
    const [objectSelected, showObjectDetails] = useState({
        "objectSelected": ''
    })

    const dispatch = useDispatch()
    const dbOutline = useSelector(state => state.dbOutline)  // state store
    const dbOutlineStatus = useSelector(state => state.dbOutline.status)

    if (dbOutlineStatus === 'init' && dbConnectionId !== null) {
        dispatch(fetchDbOutlineThunk({"dbConnectionId": dbConnectionId}))
    }

    return (
        <Grid container>
            <Grid item xs={2}>
                <Stack item>
                    <TextField label="Filter" id="outlined-basic" variant="outlined" size="small"/>

                    <Box >
                        <DbObjectTreeView
                            databaseOutline={dbOutline.data}
                            onDbObjectSelected={showObjectDetails}
                            sx={{ maxHeight: '100vh', maxWidth: 250, overflow: 'auto' }}
                        />
                    </Box>
                </Stack>
            </Grid>

            <Grid item xs={10} paddingLeft={1} >
                <DbObjectDetails dbConnectionId={dbConnectionId} objectSelected={objectSelected.objectSelected} />
            </Grid>
        </Grid>
    )
}
