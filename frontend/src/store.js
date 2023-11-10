import { configureStore } from '@reduxjs/toolkit'

import counterReducer from './slices'

export default configureStore ({
    reducer: {
        counter: counterReducer
    }
})