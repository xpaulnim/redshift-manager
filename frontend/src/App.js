import React, {useEffect, useState} from 'react'
import DbSpecificNav from "./app/DbSpecificNav"
import CreateDbConnection from "./app/CreateDbConnection"
import {Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import StorageIcon from '@mui/icons-material/Storage'
import AddIcon from '@mui/icons-material/Add'
import { useDispatch, useSelector } from "react-redux"
import { fetchDbConnectionsThunk } from './features/fetchDbConnectionsSlice'

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
            <Grid item xs={2}  >
                <nav aria-label="connected databases">
                    <List>
                        {dbConnections.data.map((row) => (
                            <ListItem disablePadding onClick={() => setComponentState({"activeDbConnectionId": row["id"], "typeOfNavItemSelected": "DB_CONNECTION"})}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <StorageIcon />
                                    </ListItemIcon>
                                    <ListItemText>{row["connection_name"]}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}

                        <ListItem disablePadding onClick={() => setComponentState({"typeOfNavItemSelected": "ADD_DB_CONNECTION"})}>
                            <ListItemButton alignItems="center">
                                <ListItemIcon disablePadding >
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText>New</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Grid>

            <Grid item xs={10}>
                <div hidden={!(componentState.typeOfNavItemSelected === 'DB_CONNECTION')}>
                    <DbSpecificNav dbConnectionId={componentState.activeDbConnectionId}/>
                </div>

                <div hidden={!(componentState.typeOfNavItemSelected === 'ADD_DB_CONNECTION')}>
                    <CreateDbConnection onDbConnectionAdded={fetchDbConnectionsThunk}/>
                </div>
            </Grid>
        </Grid>
    )
}
