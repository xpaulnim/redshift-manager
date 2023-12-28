import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const defaultSchemaAccessPrivileges = {
    data: [],
    status: 'init',
    error: null
}

export const fetchDefaultSchemaAccessPrivilegesThunk = createAsyncThunk(
    'backend/fetchDefaultSchemaAccessPrivileges',
    async (schemaName) => {
        const response = await axios.get('http://localhost:8000/default_schema_access_privileges/' + schemaName)
        console.log(response.data)

        return response.data
    }
)

const fetchDefaultSchemaAccessPrivilegesSlice = createSlice({
    name: 'defaultSchemaAccessPrivileges',
    initialState: defaultSchemaAccessPrivileges,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDefaultSchemaAccessPrivilegesThunk.pending, (state, action) => {
            console.log("pending state" + state)
            console.log("pending state" + action)

            state.status = 'pending'
        }).addCase(fetchDefaultSchemaAccessPrivilegesThunk.fulfilled, (state, action) => {
            console.log("state" + state)
            console.log("state" + action)

            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchDefaultSchemaAccessPrivilegesThunk.rejected, (state, action) => {
            console.log("failed " + state)
            console.log("failed " + action)

            state.status = 'failed'
        })
    }
})

export default fetchDefaultSchemaAccessPrivilegesSlice.reducer
