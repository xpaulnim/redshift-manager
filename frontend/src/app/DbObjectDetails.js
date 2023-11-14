import React from "react"

import {databases} from "../data"
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {TabContainer} from "./TabComponent";

function DatabaseDetails(props) {
    return (
        <TabContainer tabs={[
            {
                "header": "Tables",
                "content": <p>This database has the following schemas</p>
            },
            {
                "header": "Details",
                "content": <p>Details, like when the database was created and who created it, whether it is an external
                    db, if so what it's iam is and the store it uses</p>
            },
            {
                "header": "Permissions",
                "content": <p>Who can use this database</p>
            }
        ]}/>
    )
}

function SchemaDetailsTab(props) {
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

function TableDetailsTab({tableId}) {
    return (
        <TabContainer tabs={[
            {
                "header": "Columns",
                "content": <p>A table of column name, type and comment</p>
            },
            {
                "header": "Sample data",
                "content": <p>Select top n from the table</p>
            },
            {
                "header": "details",
                "content": <p>Type eg external, if external storage location & properties, Created At, table Id and
                    other stuff from table info </p>
            },
            {
                "header": "Permissions",
                "content": <p>Who can access this table and what can they do</p>
            },
            {
                "header": "History",
                "content": <p>DDL statements that have previously been run against this table</p>
            },
            {
                "header": "Insights",
                "content": <p>Breakdown of the previous access to this table. eg queries over the last n days, who
                    queries the table and how much it has grown</p>
            }
        ]}/>
    )
}

export default function DbObjectDetails({objectSelected}) {

    return (
        <Box>
            <h2>{databases[0].schemas[0].name}</h2>
            <p>Owner: {databases[0].schemas[0].owner}</p>
            <p>Comment: {databases[0].schemas[0].comment}</p>

            <div hidden={!(objectSelected.objectType === 'database')}>
                <h3>database {objectSelected.objectName} selected</h3>

                <DatabaseDetails database={databases[0]}/>
            </div>

            <div hidden={!(objectSelected.objectType === 'schema')}>
                <h3>schema {objectSelected.objectName} is selected</h3>

                <SchemaDetailsTab schema={objectSelected.objectName}/>
            </div>

            <div hidden={!(objectSelected.objectType === 'table')}>
                <h3>table {objectSelected.objectName} is selected</h3>

                <TableDetailsTab table={objectSelected.objectName}/>
            </div>
        </Box>
    )
}
