import React, {useEffect} from "react"

import {Box, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import DatabaseDetailsTab from "./DatabaseDetailsTab"
import TableDetailsTab from "./TableDetailsTab"
import SchemaDetailsTab from "./SchemaDetailsTab"
import {useDispatch, useSelector} from "react-redux";
import {fetchDatabaseOwnerThunk} from "../features/fetchDatabaseOwnerSlice";


function objectTypeFromName(fullObjectName) {
    console.log(fullObjectName)

    switch(fullObjectName.split(".").length) {
        case 1:
            return 'database'
        case 2:
            return 'schema'
        case 3:
            return 'table'
        default:
            console.log('There should not be that many dots in the object name lol')

            return ''
    }
}

export default function DbObjectDetails({objectSelected}) {
    const objectType = objectTypeFromName(objectSelected)

    const dispatch = useDispatch()
    const dbOwner = useSelector(state => state.dbOwner)
    const dbOwnerStatus = useSelector(state => state.dbOwner.status)

    useEffect(() => {
        console.log("dbOwner:" + dbOwnerStatus)

        if (dbOwnerStatus === 'init') {
            console.log('dispatched')
            dispatch(fetchDatabaseOwnerThunk(objectSelected))
        }
    }, [dbOwnerStatus, dispatch]);

    return (
        <Box>
            <h2>{objectSelected}</h2>
            <p>Owner: {dbOwner.data.db_owner}</p>
            <p>Comment: not sure how to get this yet</p>

            <div hidden={!(objectType === 'database')}>
                <h3>database {objectSelected} selected</h3>

                <DatabaseDetailsTab database={dbOwner.data.db_name}/>
            </div>

            <div hidden={!(objectType === 'schema')}>
                <h3>schema {objectSelected} is selected</h3>

                <SchemaDetailsTab schema={objectSelected}/>
            </div>

            <div hidden={!(objectType === 'table')}>
                <h3>table {objectSelected} is selected</h3>

                <TableDetailsTab table={objectSelected}/>
            </div>
        </Box>
    )
}
