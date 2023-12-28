import React from 'react'
import {Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material"
import HistoryIcon from '@mui/icons-material/History'
import StorageIcon from '@mui/icons-material/Storage'
import TerminalIcon from '@mui/icons-material/Terminal'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import VisibilityIcon from '@mui/icons-material/Visibility'

export function FeatureNavLeft({onMainNavOptionSelected}) {

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <nav aria-label="main nav">
                <List>
                    <ListItem disablePadding onClick={() => onMainNavOptionSelected("database")}>
                        <ListItemButton>
                            <ListItemIcon disablePadding>
                                <StorageIcon />
                            </ListItemIcon>
                            <ListItemText primary="Database" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => onMainNavOptionSelected("sql_editor")}>
                        <ListItemButton>
                            <ListItemIcon>
                                <TerminalIcon />
                            </ListItemIcon>
                            <ListItemText primary="SQL Editor" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => onMainNavOptionSelected("users")}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => onMainNavOptionSelected("masking")}>
                        <ListItemButton>
                            <ListItemIcon>
                                <VisibilityIcon />
                            </ListItemIcon>
                            <ListItemText primary="Masking" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => onMainNavOptionSelected("queries")}>
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
