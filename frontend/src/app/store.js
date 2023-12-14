import { configureStore } from '@reduxjs/toolkit'

import fetchDbOutlineReducer from '../features/fetchDbOutlineSlice'
import fetchDbOwnerReducer from '../features/fetchDatabaseOwnerSlice'
import fetchTablesInSchemaReducer from "../features/fetchTablesInSchemaSlice";
import fetchTableDetailsReducer from "../features/fetchTableDetailsSlice";
import fetchTableUserList from "../features/fetchUserListSlice";

export default configureStore ({
    reducer: {
        dbOutline: fetchDbOutlineReducer,
        dbOwner: fetchDbOwnerReducer,
        tablesInSchema: fetchTablesInSchemaReducer,
        tableDetails: fetchTableDetailsReducer,
        userList: fetchTableUserList,
    }
})
