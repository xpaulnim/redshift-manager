import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialFetchSchemaDetailsSlice = {
    data: [],
    status: 'init',
    error: null
}

export const fetchDatabaseSchemasThunk = createAsyncThunk(
    'backend/fetchDatabaseSchemas',
    async(arg) => {
        const response = await axios.get("http://localhost:8000/" + arg['dbConnectionId'] + '/' + arg['database'] + '/schemas')

        return response.data
    }
)

const fetchDatabaseSchemasSlice = createSlice({
    name: 'databaseSchemas',
    initialState: initialFetchSchemaDetailsSlice,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDatabaseSchemasThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchDatabaseSchemasThunk.rejected, (state, action) => {
            console.log(state)
            console.log(action)
            state.status = 'failed'
        })
    }
})

export default fetchDatabaseSchemasSlice.reducer
