import {Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import {TabContainer} from "./TabComponent"
import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {fetchTablesInSchemaThunk} from "../features/fetchTablesInSchemaSlice"

export default function SchemaDetailsTab({schema}) {
    const [currentSchema, setCurrentSchema] = useState({
        "currentSchema": ""
    })

    const dispatch = useDispatch()
    const tablesInSchema = useSelector(state => state.tablesInSchema)

    if (schema !== currentSchema.currentSchema && schema.split(".").length === 2) {
        console.log("schema is " + schema)

        setCurrentSchema({"currentSchema": schema})
        dispatch(fetchTablesInSchemaThunk(schema))
    }

    const tablesPanel = (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Created at</TableCell>
                        <TableCell>Size (MB)</TableCell>
                        <TableCell>Comment</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        tablesInSchema.data.map((row) => (
                            <TableRow
                                key={row.id}>
                                <TableCell align="left">{row.table_name}</TableCell>
                                <TableCell align="left">{row.table_owner}</TableCell>
                                <TableCell align="left">{row.created_at}</TableCell>
                                <TableCell align="left">{row.size}</TableCell>
                                <TableCell align="left">{row.table_desc}</TableCell>
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
                                <TableCell align="left">{key}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )

    const permissionsPanel = (
        <Box>
            <h3>Access privileges</h3>


            <h3>Default privileges</h3>
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