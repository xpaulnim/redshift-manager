import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const backendApi = createApi({
    reducerPath: 'fetchDbOutline',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/db_outline'}),
    endpoints: (builder) => ({
        
    })
})
