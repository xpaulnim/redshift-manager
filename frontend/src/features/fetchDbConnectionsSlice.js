import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialDbConnectionState = {
    data: [],
    status: 'init',
    error: null
}

export const fetchDbConnectionsThunk = createAsyncThunk(
    "backend/fetchDbConnections",
    async (arg) => {
        const response = await axios.get('http://localhost:8000/db_connections')
        return response.data
    }
)

const fetchDbConnectionSlice = createSlice({
    name: "fetchDbConnection",
    initialState: initialDbConnectionState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDbConnectionsThunk.pending, (state, action) => {
            state.status = 'pending'
        }).addCase(fetchDbConnectionsThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchDbConnectionsThunk.rejected, (state, action) => {
            state.status = "failed"
        })
    }
})

export const {fetchDbConnections} = fetchDbConnectionSlice.actions
export default fetchDbConnectionSlice.reducer
