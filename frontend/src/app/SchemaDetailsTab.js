import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import {TabContainer} from "./TabComponent"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {fetchTablesInSchemaThunk} from "../features/fetchTablesInSchemaSlice"

export default function SchemaDetailsTab({schema}) {
    const [currentSchema, setCurrentSchema] = useState({
        "currentSchema": ""
    })

    const dispatch = useDispatch()
    const tablesInSchema = useSelector(state => state.tablesInSchema)
    const tablesInSchemaStatus = useSelector(state => state.tablesInSchema.status)

    if (schema !== currentSchema.currentSchema && schema.split(".").length === 2) {
        console.log("schema is " + schema.split("."))

        setCurrentSchema({"currentSchema": schema})
        dispatch(fetchTablesInSchemaThunk(schema))
    }

    useEffect(() => {
        console.log("tablesInSchema: " + schema)

        if (tablesInSchemaStatus === "init") {
            dispatch(fetchTablesInSchemaThunk(schema))
        }
    }, [tablesInSchemaStatus, dispatch])

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