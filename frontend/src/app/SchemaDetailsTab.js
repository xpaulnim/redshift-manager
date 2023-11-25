import {databases} from "../data";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {TabContainer} from "./TabComponent";
import React from "react";

export default function SchemaDetailsTab(props) {
    const _schema = databases[0].schemas[0]

    const tablesPanel = (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Created at</TableCell>
                        <TableCell>Size</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        _schema.tables.map((row) => (
                            <TableRow
                                key={row.id}>
                                <TableCell align="left">{row.name}</TableCell>
                                <TableCell align="left">{row.owner}</TableCell>
                                <TableCell align="left">{row.created_at}</TableCell>
                                <TableCell align="left">{row.size}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )

    const detailsPanel = (
        <TableContainer sx={{maxWidth: 300}} component={Paper}>
            <Table size="small">
                <TableBody>
                    {
                        ['id', 'name', 'owner', 'comment'].map((key) => (
                            <TableRow size="small">
                                <TableCell align="left">{key}</TableCell>
                                <TableCell align="left">{_schema[key]}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )

    const permissionsPanel = (
        <p>Permissions table ie user, action</p>
    )

    return (
        <TabContainer tabs={[
            {
                "header": "Tables",
                "content": tablesPanel
            },
            {
                "header": "Details",
                "content": detailsPanel
            },
            {
                "header": "Permissions",
                "content": permissionsPanel
            }
        ]}/>
    )
}