import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const createDbConnectionThunk = createAsyncThunk(
    'backend/createDbConnection',
    async (dbConnectionFormValues) => {
        const response = await axios.post('http://localhost:8000/create_db_conn', dbConnectionFormValues)
        console.log(response.data)

        return response.data
    }
)

const createDbConnectionSlice = createSlice({
    name: "createDbConnection",
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createDbConnectionThunk.pending, (state, action) => {
            console.log("pending state" + state)
            console.log("pending state" + action)

            state.status = 'pending'
        }).addCase(createDbConnectionThunk.fulfilled, (state, action) => {
            console.log("state" + state)
            console.log("state" + action)

            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(createDbConnectionThunk.rejected, (state, action) => {
            console.log("failed ")
            console.log(state)
            console.log(action)

            state.status = 'failed'
        })
    }
})

export const {createDbConnection} = createDbConnectionSlice.actions
export default createDbConnectionSlice.reducer
