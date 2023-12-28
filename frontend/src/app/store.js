import { configureStore } from '@reduxjs/toolkit'

import fetchDbOutlineReducer from '../features/fetchDbOutlineSlice'
import fetchDbOwnerReducer from '../features/fetchDatabaseOwnerSlice'
import fetchTablesInSchemaReducer from "../features/fetchTablesInSchemaSlice"
import fetchTableDetailsReducer from "../features/fetchTableDetailsSlice"
import fetchTableUserListReducer from "../features/fetchUserListSlice"
import fetchSchemaAccessPrivilegesReducer from "../features/fetchSchemaAccessPrivilegesSlice"
import fetchDefaultSchemaAccessPrivilegesReducer from "../features/fetchDefaultSchemaAccessPrivilegesSlice"
import createDbConnectionReducer from "../features/createDbConnectionSlice"
import fetchDbConnectionsReducer from "../features/fetchDbConnectionsSlice"

export default configureStore ({
    reducer: {
        dbOutline: fetchDbOutlineReducer,
        dbOwner: fetchDbOwnerReducer,
        tablesInSchema: fetchTablesInSchemaReducer,
        tableDetails: fetchTableDetailsReducer,
        userList: fetchTableUserListReducer,
        schemaAccessPrivileges: fetchSchemaAccessPrivilegesReducer,
        defaultSchemaAccessPrivileges: fetchDefaultSchemaAccessPrivilegesReducer,
        createDbConnection: createDbConnectionReducer,
        dbConnections: fetchDbConnectionsReducer,
    }
})
