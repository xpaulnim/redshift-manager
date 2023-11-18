import { configureStore } from '@reduxjs/toolkit'

import counterReducer from '../features/counterSlice'
import dbOutlineReducer from '../features/dbOutlineSlice'

export default configureStore ({
    reducer: {
        counter: counterReducer,
        dbOutline: dbOutlineReducer
    }
})
