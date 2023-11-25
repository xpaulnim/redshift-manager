import { configureStore } from '@reduxjs/toolkit'

import fetchDbOutlineReducer from '../features/fetchDbOutlineSlice'
import fetchDbOwnerReducer from '../features/fetchDatabaseOwnerSlice'

export default configureStore ({
    reducer: {
        dbOutline: fetchDbOutlineReducer,
        dbOwner: fetchDbOwnerReducer,
    }
})
