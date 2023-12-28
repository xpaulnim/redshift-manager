import React, {useState} from 'react'
import DbSpecificNav from "./app/DbSpecificNav"
import AddDbConnection from "./app/AddDbConnection"
import {Box, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import StorageIcon from '@mui/icons-material/Storage'
import ApprovalIcon from '@mui/icons-material/Approval'
import AddIcon from '@mui/icons-material/Add'

export function App() {
    const [dbNavOptionSelected, setDbNavOptionSelected] = useState({
        "dbNavOptionSelected": "staging_redshift"
    })

    return (
        <Grid container>
            <Grid item xs={2}  >
                <nav aria-label="connected databases">
                    <List>
                        <ListItem disablePadding onClick={() => setDbNavOptionSelected({"dbNavOptionSelected": "production_redshift"})}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <StorageIcon />
                                </ListItemIcon>
                                <ListItemText>Prod</ListItemText>
                            </ListItemButton>

                        </ListItem>

                        <ListItem disablePadding onClick={() => setDbNavOptionSelected({"dbNavOptionSelected": "staging_redshift"})}>
                            <ListItemButton>
                                <ListItemIcon disablePadding>
                                    <ApprovalIcon />
                                </ListItemIcon>
                                <ListItemText>Staging</ListItemText>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding onClick={() => setDbNavOptionSelected({"dbNavOptionSelected": "add_source"})}>
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
                <div hidden={!(dbNavOptionSelected.dbNavOptionSelected === 'staging_redshift')}>
                    <DbSpecificNav />
                </div>
                <div hidden={!(dbNavOptionSelected.dbNavOptionSelected === 'add_source')}>
                    <AddDbConnection />
                </div>
            </Grid>
        </Grid>
    )
}
