import React, {useEffect} from "react"

import {databases} from "../data"
import {Box} from "@mui/material"
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

    // const [objectSelected, showObjectDetails] = useState({
    //     "objectSelected": "dev"
    // })

    const dispatch = useDispatch()
    const dbOwner = useSelector(state => state.dbOwner)
    const dbOwnerStatus = useSelector(state => state.dbOwner.status)

    useEffect(() => {
        console.log("dbOwner:" + dbOwnerStatus)
        if (dbOwnerStatus === 'init') {
            dispatch(fetchDatabaseOwnerThunk())
        }
    }, [dbOwnerStatus, dispatch]);

    return (
        <Box>
            <h2>{objectSelected}</h2>
            <p>Owner: {dbOwner.data.db_owner}</p>
            <p>Comment: not sure how to get this yet</p>

            <div hidden={!(objectType === 'database')}>
                <h3>database {objectSelected} selected</h3>

                <DatabaseDetailsTab database={databases[0]}/>
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
