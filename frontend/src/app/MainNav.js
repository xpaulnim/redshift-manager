import React from 'react'
import {Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import HistoryIcon from '@mui/icons-material/History'
import StorageIcon from '@mui/icons-material/Storage'
import TerminalIcon from '@mui/icons-material/Terminal'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function FeatureNavLeft({onMainNavOptionSelected}) {

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <nav aria-label="main mailbox folders">
                <List>
                    <ListItem disablePadding onClick={() => onMainNavOptionSelected({"mainNavOptionSelected": "sql_editor"})}>
                        <ListItemButton>
                            <ListItemIcon>
                                <TerminalIcon />
                            </ListItemIcon>
                            <ListItemText primary="SQL Editor" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => onMainNavOptionSelected({"mainNavOptionSelected": "database"})}>
                        <ListItemButton>
                            <ListItemIcon disablePadding>
                                <StorageIcon />
                            </ListItemIcon>
                            <ListItemText primary="Database" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => onMainNavOptionSelected({"mainNavOptionSelected": "users"})}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => onMainNavOptionSelected({"mainNavOptionSelected": "queries"})}>
                        <ListItemButton>
                            <ListItemIcon>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="Queries" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>

            <Divider />

            <nav aria-label="other options">
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Usage analytics" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>
        </Box>
    )
}
