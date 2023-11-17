import { configureStore } from '@reduxjs/toolkit'

import counterReducer from './slices'
import { redshiftManagerApi } from './api'
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore ({
    reducer: {
        counter: counterReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(redshiftManagerApi.middleware)
})

setupListeners(store.dispatch)
