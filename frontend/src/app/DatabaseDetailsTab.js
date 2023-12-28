import {TabContainer} from "./TabComponent"
import React from "react"
import {Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"

export default function DatabaseDetailsTab(props) {
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
                "content": <p>Table with columns Name, Created at, Owner, Popularity</p>
            },
            {
                "header": "Permissions",
                "content": dbPermissions
            }
        ]}/>
    )
}
