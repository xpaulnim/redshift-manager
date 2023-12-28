import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialTablesInSchemaState = {
    data: [],
    status: 'init',
    error: null
}

export const fetchTablesInSchemaThunk = createAsyncThunk(
    'backend/fetchTablesInSchema',
    async(schemaName) => {
        console.log('http://localhost:8000/tables_in_schema/' + schemaName)

        const response = await axios.get('http://localhost:8000/tables_in_schema/' + schemaName)
        console.log(response.data)

        return response.data
    }
)

const fetchTablesInSchemaSlice = createSlice({
    name: 'tablesInSchema',
    initialState: initialTablesInSchemaState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase('backend/fetchTablesInSchema/fulfilled', (state, action) => {
            console.log("fulfilled: " + state)
            console.log("state: " + action.payload.data)

            state.status = 'fulfilled'
            state.data = action.payload.data
        })
    }
})

export const {fetchTablesInSchema} = fetchTablesInSchemaSlice.actions
export default fetchTablesInSchemaSlice.reducer
