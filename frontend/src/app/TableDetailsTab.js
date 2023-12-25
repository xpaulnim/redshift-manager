import {TabContainer} from "./TabComponent"
import React, {useState} from "react"
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import {useDispatch, useSelector} from "react-redux"
import {fetchTableDetailsThunk} from "../features/fetchTableDetailsSlice"

export default function TableDetailsTab({table}) {
    const [currentTable, setCurrentTable] = useState({
        "currentTable": ""
    })

    const dispatch = useDispatch()
    const tableDetails = useSelector(state => state.tableDetails)

    if (table !== currentTable.currentTable && table.split(".").length === 3) {
        console.log("table is " + table)

        setCurrentTable(({"currentTable": table}))
        dispatch(fetchTableDetailsThunk(table))
    }

    const tableColumns = (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Comment</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        tableDetails.data.table_columns.map((row) => (
                            <TableRow
                                key={row.col_name}>
                                <TableCell align="left">{row.col_name}</TableCell>
                                <TableCell align="left">{row.col_type}</TableCell>
                                <TableCell align="left">{row.col_comment}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )

    const sampleData = (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} size="small">
                <TableHead>
                    <TableRow>
                        {
                            tableDetails.data.table_columns.map((row) => (
                                <TableCell>{row.col_name}</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        tableDetails.data.table_preview.map((colObj) => (
                            <TableRow>
                                {
                                    Object.entries(colObj).map(([colname, colvalue]) =>
                                        <TableCell align="left">{colvalue}</TableCell>
                                    )
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )

    return (
        <TabContainer tabs={[
            {
                "header": "Details",
                "content": <p>Type eg external, if external storage location & properties, Created At, table Id and
                    other stuff from table info </p>
            },
            {
                "header": "Columns",
                "content": tableColumns
            },
            {
                "header": "Sample data",
                "content": sampleData
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