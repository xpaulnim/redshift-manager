import { configureStore } from '@reduxjs/toolkit'

import fetchDbOutlineReducer from '../features/fetchDbOutlineSlice'
import fetchDbOwnerReducer from '../features/fetchDatabaseOwnerSlice'
import fetchTablesInSchemaReducer from "../features/fetchTablesInSchemaSlice";

export default configureStore ({
    reducer: {
        dbOutline: fetchDbOutlineReducer,
        dbOwner: fetchDbOwnerReducer,
        tablesInSchema: fetchTablesInSchemaReducer,
    }
})
