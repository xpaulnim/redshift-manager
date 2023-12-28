import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const createDbConnectionThunk = createAsyncThunk(
    'backend/createDbConnection',
    async (arg) => {
        const response = await axios.post('http://localhost:8000/create_db_conn', arg["dbConnectionFormValues"])

        return response.data
    }
)

const createDbConnectionSlice = createSlice({
    name: "createDbConnection",
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createDbConnectionThunk.pending, (state, action) => {
            state.status = 'pending'
        }).addCase(createDbConnectionThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(createDbConnectionThunk.rejected, (state, action) => {
            state.status = 'failed'
        })
    }
})

export const {createDbConnection} = createDbConnectionSlice.actions
export default createDbConnectionSlice.reducer
