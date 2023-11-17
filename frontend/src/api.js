import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const redshiftManagerApi = createApi({
    reducerPath: 'redshiftManagerApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'localhost:8000/' }),
    endpoints: (builder) => ({
        getUsers: builder.query({ query: (name) => `users` })
    })
})

export const { useGetUsersQuery } = redshiftManagerApi
