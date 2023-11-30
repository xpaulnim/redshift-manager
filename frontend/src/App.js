import React, {useState} from 'react'
import DbSpecificNav from "./app/DbSpecificNav"
import {Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import StorageIcon from '@mui/icons-material/Storage'
import ApprovalIcon from '@mui/icons-material/Approval'

export function App() {
    const [dbNavOptionSelected, setDbNavOptionSelected] = useState({
        "dbNavOptionSelected": ""
    })

    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <nav aria-label="main mailbox folders">
                    <List>
                        <ListItem disablePadding onClick={() => setDbNavOptionSelected({"dbNavOptionSelected": "production_redshift"})}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <StorageIcon />
                                </ListItemIcon>
                                <ListItemText primary="Production" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding onClick={() => setDbNavOptionSelected({"dbNavOptionSelected": "staging_redshift"})}>
                            <ListItemButton>
                                <ListItemIcon disablePadding>
                                    <ApprovalIcon />
                                </ListItemIcon>
                                <ListItemText primary="Staging" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Grid>

            <Grid item xs={10}>
                <div hidden={!(dbNavOptionSelected.dbNavOptionSelected === 'staging_redshift')}>
                    <DbSpecificNav />
                </div>
            </Grid>
        </Grid>
    )
}
