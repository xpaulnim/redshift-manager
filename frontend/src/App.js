import React, {useEffect, useState} from 'react'
import DbSpecificNav from "./app/DbSpecificNav"
import CreateDbConnection from "./app/CreateDbConnection"
import {Grid, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import {useDispatch, useSelector} from "react-redux"
import {fetchDbConnectionsThunk} from './features/fetchDbConnectionsSlice'

export function App() {
    const [componentState, setComponentState] = useState({
        "activeDbConnectionId": null,
        "typeOfNavItemSelected": "DB_CONNECTION"  // DB_CONNECTION, ADD_DB_CONNECTION
    })

    const dispatch = useDispatch()
    const dbConnections = useSelector(state => state.dbConnections)
    const dbConnectionsStatus = useSelector(state => state.dbConnections.status)

    useEffect(() => {
        if (dbConnections.status === 'init') {
            dispatch(fetchDbConnectionsThunk())
        }
    }, [dbConnectionsStatus, dispatch])

    return (
        <Grid container>
            <Grid item xs={1}>
                <nav aria-label="connected databases">
                    <List>
                        {dbConnections.data.map((row) => (
                            <ListItem disablePadding disableGutters
                                onClick={() => setComponentState({
                                    "activeDbConnectionId": row["id"],
                                    "typeOfNavItemSelected": "DB_CONNECTION"
                                })}>
                                <ListItemButton>
                                    <ListItemText>{row["connection_name"]}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding disableGutters
                            onClick={() => setComponentState({
                            "activeDbConnectionId": null,
                            "typeOfNavItemSelected": "ADD_DB_CONNECTION"
                        })}>
                            <ListItemButton>
                                <ListItemIcon >
                                    <AddIcon/>
                                </ListItemIcon>

                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Grid>

            <Grid item xs={11}>
                <Box hidden={!(componentState.typeOfNavItemSelected === 'DB_CONNECTION')}>
                    <DbSpecificNav dbConnectionId={componentState.activeDbConnectionId}/>
                </Box>

                <Box hidden={!(componentState.typeOfNavItemSelected === 'ADD_DB_CONNECTION')}>
                    <CreateDbConnection onDbConnectionAdded={fetchDbConnectionsThunk}/>
                </Box>
            </Grid>
        </Grid>
    )
}
