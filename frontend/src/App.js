import React, {useState} from 'react'
import DbSpecificNav from "./app/DbSpecificNav"
import {Grid, List, ListItem, ListItemButton, ListItemIcon} from "@mui/material"
import StorageIcon from '@mui/icons-material/Storage'
import ApprovalIcon from '@mui/icons-material/Approval'
import AddIcon from '@mui/icons-material/Add'

export function App() {
    const [dbNavOptionSelected, setDbNavOptionSelected] = useState({
        "dbNavOptionSelected": ""
    })

    return (
        <Grid container>
            <Grid item xs={1}  >
                <nav aria-label="connected databases">
                    <List>
                        <ListItem disablePadding onClick={() => setDbNavOptionSelected({"dbNavOptionSelected": "production_redshift"})}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <StorageIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding onClick={() => setDbNavOptionSelected({"dbNavOptionSelected": "staging_redshift"})}>
                            <ListItemButton>
                                <ListItemIcon disablePadding>
                                    <ApprovalIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding onClick={() => setDbNavOptionSelected({"dbNavOptionSelected": "staging_redshift"})}>
                            <ListItemButton>
                                <ListItemIcon disablePadding>
                                    <AddIcon />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Grid>

            <Grid item xs={11}>
                <div hidden={!(dbNavOptionSelected.dbNavOptionSelected === 'staging_redshift')}>
                    <DbSpecificNav />
                </div>
            </Grid>
        </Grid>
    )
}
