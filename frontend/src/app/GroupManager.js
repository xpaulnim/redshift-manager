import {
    Box,
    Checkbox,
    Grid, List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material"
import React from "react"

export default function GroupManager(props) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <List dense>
                    <ListItem disablePadding onClick={() => onMainNavOptionSelected({"mainNavOptionSelected": "sql_editor"})}>
                        <ListItemButton>
                            <ListItemText primary="reader" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding onClick={() => onMainNavOptionSelected({"mainNavOptionSelected": "database"})}>
                        <ListItemButton>
                            <ListItemText primary="admin" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Grid>

            <Grid item xs={8}>
                <Box>
                    <h4>Databases</h4>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Grantor</TableCell>
                                    <TableCell>Grantee</TableCell>
                                    <TableCell>connection limit</TableCell>
                                    <TableCell>create</TableCell>
                                    <TableCell>temporary</TableCell>
                                    <TableCell>usage</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    key="">
                                    <TableCell align="left">grantor</TableCell>
                                    <TableCell align="left">grantee</TableCell>
                                    <TableCell align="left">unlimited</TableCell>
                                    <TableCell align="left">
                                        <Checkbox disabled checked/>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Checkbox disabled checked/>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Checkbox disabled/>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <h4>Schemas</h4>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Grantor</TableCell>
                                    <TableCell>Grantee</TableCell>
                                    <TableCell>connection limit</TableCell>
                                    <TableCell>create</TableCell>
                                    <TableCell>temporary</TableCell>
                                    <TableCell>usage</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableRow
                                key="">
                                <TableCell align="left">grantor</TableCell>
                                <TableCell align="left">grantee</TableCell>
                                <TableCell align="left">unlimited</TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled checked/>
                                </TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled checked/>
                                </TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled/>
                                </TableCell>
                            </TableRow>
                            <TableBody>

                            </TableBody>
                        </Table>
                    </TableContainer>

                    <h4>Tables</h4>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Grantor</TableCell>
                                    <TableCell>Grantee</TableCell>
                                    <TableCell>Object Type</TableCell>
                                    <TableCell>select</TableCell>
                                    <TableCell>insert</TableCell>
                                    <TableCell>update</TableCell>
                                    <TableCell>delete</TableCell>
                                    <TableCell>references</TableCell>
                                    <TableCell>trigger</TableCell>
                                    <TableCell>drop</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableRow
                                key="">
                                <TableCell align="left">grantor</TableCell>
                                <TableCell align="left">grantee</TableCell>
                                <TableCell align="left">object type</TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled checked/>
                                </TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled checked/>
                                </TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled/>
                                </TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled />
                                </TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled checked/>
                                </TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled checked/>
                                </TableCell>
                                <TableCell align="left">
                                    <Checkbox disabled/>
                                </TableCell>
                            </TableRow>
                            <TableBody>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Grid>
        </Grid>
    )
}
