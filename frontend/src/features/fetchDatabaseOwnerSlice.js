import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialDatabaseOwnerState = {
    data: {},
    status: 'init',
    error: null
}

export const fetchDatabaseOwnerThunk = createAsyncThunk(
    'backend/fetchDatabaseOwner',
    async (arg) => {
        const response = await axios.get("http://localhost:8000/" + arg["dbConnectionId"]  +"/database_owner/" + arg["databaseName"])
        return response.data
    }
)

const fetchDatabaseOwnerSlice = createSlice({
    name: 'databaseOwner',
    initialState: initialDatabaseOwnerState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDatabaseOwnerThunk.fulfilled, (state, action) => {
            console.log("fulfilled")
            console.log(state)
            console.log(action)

            state.status = 'fulfilled'
            state.data = action.payload.data
        })
    }
})

export const {fetchDatabaseOwner} = fetchDatabaseOwnerSlice.actions
export default fetchDatabaseOwnerSlice.reducer
