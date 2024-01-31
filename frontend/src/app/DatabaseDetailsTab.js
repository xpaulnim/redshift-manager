import {TabContainer} from "./TabComponent"
import React, {useState} from "react"
import {Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import {useDispatch, useSelector} from "react-redux"
import {fetchDatabaseSchemasThunk} from "../features/fetchSchemaDetailsSlice";

export default function DatabaseDetailsTab({dbConnectionId, database}) {
    const [componentState, setComponentState] = useState({
        "dbConnectionId": null,
        "database": null
    })

    const dispatch = useDispatch()
    const databaseSchemas = useSelector(state => state.databaseSchemas)

    // useEffect(() => {
    console.log("fetching database schemas " + dbConnectionId + ":" + componentState.dbConnectionId + " --- " + database)
    if (dbConnectionId !== null &&
        componentState.dbConnectionId !== dbConnectionId ||
        componentState.database !== database) {

        dispatch(fetchDatabaseSchemasThunk({"dbConnectionId": dbConnectionId,"database": database}))
        setComponentState({"dbConnectionId": dbConnectionId, "database": database})
        console.log("done fetching")
    }
    // }, [dispatch, databaseSchemas])

    const dbPermissions = (
        <Box>
            <h3>Access privileges</h3>
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
                    <TableRow key="">
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
        </Box>
    )

    const dbSchemas = (
        <Box>
            <h3>Access privileges</h3>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Schema name</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Size</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { databaseSchemas.data.map((schema) => (
                            <TableRow key={schema.schema_name}>
                                <TableCell align="left">{schema.schema_name}</TableCell>
                                <TableCell align="left">{schema.schema_owner}</TableCell>
                                <TableCell align="left">{schema.schema_type}</TableCell>
                                <TableCell align="left">100</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )

    return (
        <TabContainer tabs={[
            {
                "header": "Details",
                "content": <p>Details, like when the database was created and who created it, whether it is an external
                    db, if so what it's iam is and the store it uses - name, database name, owner, full name, created at,
                    created by, updated at, updated by, type, size</p>
            },
            {
                "header": "Schemas",
                "content": dbSchemas
            },
            {
                "header": "Permissions",
                "content": dbPermissions
            }
        ]}/>
    )
}
