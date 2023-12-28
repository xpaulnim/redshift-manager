import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const schemaAccessPrivilegesInitialState = {
    data: {
        "schema_owner": "wr_admin",
        "schema_name": "playground",
        "schema_acl": []
    },
    status: 'init',
    error: null
}

export const fetchSchemaAccessPrivilegesThunk = createAsyncThunk(
    'backend/fetchSchemaAccessPrivileges',
    async (arg) => {
        const response = await axios.get("http://localhost:8000/" + arg["dbConnectionId"] + "/schema_access_privileges/" + arg["schemaName"])

        return response.data
    }
)

const fetchSchemaAccessPrivilegesSlice = createSlice({
    name: 'schemaAccessPrivileges',
    initialState: schemaAccessPrivilegesInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSchemaAccessPrivilegesThunk.pending, (state, action) => {
            state.status = 'pending'
        }).addCase(fetchSchemaAccessPrivilegesThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchSchemaAccessPrivilegesThunk.rejected, (state, action) => {
            state.status = 'failed'
        })
    }
})

export default fetchSchemaAccessPrivilegesSlice.reducer
