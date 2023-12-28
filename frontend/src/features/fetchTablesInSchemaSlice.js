import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialTablesInSchemaState = {
    data: [],
    status: 'init',
    error: null
}

export const fetchTablesInSchemaThunk = createAsyncThunk(
    'backend/fetchTablesInSchema',
    async(arg) => {
        const response = await axios.get("http://localhost:8000/" + arg["dbConnectionId"] + "/tables_in_schema/" + arg["schemaName"])
        return response.data
    }
)

const fetchTablesInSchemaSlice = createSlice({
    name: 'tablesInSchema',
    initialState: initialTablesInSchemaState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase('backend/fetchTablesInSchema/fulfilled', (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        })
    }
})

export const {fetchTablesInSchema} = fetchTablesInSchemaSlice.actions
export default fetchTablesInSchemaSlice.reducer
