import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const defaultSchemaAccessPrivileges = {
    data: [],
    status: 'init',
    error: null
}

export const fetchDefaultSchemaAccessPrivilegesThunk = createAsyncThunk(
    'backend/fetchDefaultSchemaAccessPrivileges',
    async (arg) => {
        const response = await axios.get("http://localhost:8000/" + arg["dbConnectionId"] + "/default_schema_access_privileges/" + arg["schemaName"])

        return response.data
    }
)

const fetchDefaultSchemaAccessPrivilegesSlice = createSlice({
    name: 'defaultSchemaAccessPrivileges',
    initialState: defaultSchemaAccessPrivileges,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDefaultSchemaAccessPrivilegesThunk.pending, (state, action) => {
            state.status = 'pending'
        }).addCase(fetchDefaultSchemaAccessPrivilegesThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchDefaultSchemaAccessPrivilegesThunk.rejected, (state, action) => {
            state.status = 'failed'
        })
    }
})

export default fetchDefaultSchemaAccessPrivilegesSlice.reducer
