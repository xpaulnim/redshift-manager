import {Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import {TabContainer} from "./TabComponent"
import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {fetchTablesInSchemaThunk} from "../features/fetchTablesInSchemaSlice"
import {fetchSchemaAccessPrivilegesThunk} from "../features/fetchSchemaAccessPrivilegesSlice";
import {fetchDefaultSchemaAccessPrivilegesThunk} from "../features/fetchDefaultSchemaAccessPrivilegesSlice";

function checkboxFromBool(ticked) {
    if (ticked) {
        return (<Checkbox disabled checked/>)
    }

    return (<Checkbox disabled/>)
}

export default function SchemaDetailsTab({schema}) {
    const [currentSchema, setCurrentSchema] = useState({
        "currentSchema": ""
    })

    const dispatch = useDispatch()
    const tablesInSchema = useSelector(state => state.tablesInSchema)
    const schemaAccessPrivileges = useSelector(state => state.schemaAccessPrivileges)
    const defaultSchemaAccessPrivileges = useSelector(state => state.defaultSchemaAccessPrivileges)

    if (schema !== currentSchema.currentSchema && schema.split(".").length === 2) {
        console.log("schema is " + schema)

        setCurrentSchema({"currentSchema": schema})
        dispatch(fetchTablesInSchemaThunk(schema))
        dispatch(fetchSchemaAccessPrivilegesThunk(schema))
        dispatch(fetchDefaultSchemaAccessPrivilegesThunk(schema))
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
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Grantor</TableCell>
                            <TableCell>Grantee</TableCell>
                            <TableCell>Grantee type</TableCell>
                            <TableCell>USAGE</TableCell>
                            <TableCell>CREATE</TableCell>
                            <TableCell>TEMPORARY</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            schemaAccessPrivileges.data["schema_acl"].map((row) => (
                                <TableRow key="">
                                    <TableCell align="left">{row["grantor"]}</TableCell>
                                    <TableCell align="left">{row["grantee"]}</TableCell>
                                    <TableCell align="left">{row["grantee_type"]}</TableCell>
                                    <TableCell align="left">{checkboxFromBool(row["usage"])}</TableCell>
                                    <TableCell align="left">{checkboxFromBool(row["create"])}</TableCell>
                                    <TableCell align="left">{checkboxFromBool(row["temporary"])}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <h3>Default privileges</h3>
            <h4>Tables</h4>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Grantor</TableCell>
                            <TableCell align="center">Grantee</TableCell>
                            <TableCell align="center">SELECT</TableCell>
                            <TableCell align="center">INSERT</TableCell>
                            <TableCell align="center">UPDATE</TableCell>
                            <TableCell align="center">DELETE</TableCell>
                            <TableCell align="center">REFERENCES</TableCell>
                            <TableCell align="center">TRIGGER</TableCell>
                            <TableCell align="center">DROP</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            defaultSchemaAccessPrivileges.data.filter(
                                (schema) => schema["object_type"] === "tables"
                            ).map((row) => (
                                    row["schema_acl"].map((acl) => (
                                        <TableRow key="">
                                            <TableCell align="left">{acl["grantor"]}</TableCell>
                                            <TableCell align="left">{acl["grantee"]}</TableCell>
                                            <TableCell align="center">{checkboxFromBool(acl["select"])}</TableCell>
                                            <TableCell align="center">{checkboxFromBool(acl["insert"])}</TableCell>
                                            <TableCell align="center">{checkboxFromBool(acl["update"])}</TableCell>
                                            <TableCell align="center">{checkboxFromBool(acl["delete"])}</TableCell>
                                            <TableCell align="center">{checkboxFromBool(acl["references"])}</TableCell>
                                            <TableCell align="center">{checkboxFromBool(acl["trigger"])}</TableCell>
                                            <TableCell align="center">{checkboxFromBool(acl["drop"])}</TableCell>
                                        </TableRow>
                                    ))
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <h4>Functions</h4>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Grantor</TableCell>
                            <TableCell>Grantee</TableCell>
                            <TableCell align="center">EXECUTE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            defaultSchemaAccessPrivileges.data.filter(
                                (schema) => schema["object_type"] === "functions"
                            ).map((row) => (
                                row["schema_acl"].map((acl) => (
                                    <TableRow key="">
                                        <TableCell align="left">{acl["grantor"]}</TableCell>
                                        <TableCell align="left">{acl["grantee"]}</TableCell>
                                        <TableCell align="center">{checkboxFromBool(acl["execute"])}</TableCell>
                                    </TableRow>
                                ))
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )

    return (
        <TabContainer tabs={[
            {
                "header": "Details",
                "content": detailsPanel
            },
            {
                "header": "Tables",
                "content": tablesPanel
            },
            {
                "header": "Permissions",
                "content": permissionsPanel
            }
        ]}/>
    )
}