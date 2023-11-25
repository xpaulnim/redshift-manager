import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialDatabaseOwnerState = {
    data: {},
    status: 'init',
    error: null
}

export const fetchDatabaseOwnerThunk = createAsyncThunk(
    'backend/fetchDatabaseOwner',
    async () => {
        const response = await axios.get('http://localhost:8000/database_owner/dev')

        console.log(response.data)

        return response.data
    }
)

const fetchDatabaseOwnerSlice = createSlice({
    name: 'databaseOwner',
    initialState: initialDatabaseOwnerState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDatabaseOwnerThunk.fulfilled, (state, action) => {
            console.log("fulfilled" + state)
            console.log("state" + action)

            state.status = 'fulfilled'
            state.data = action.payload.data
        })
    }
})

export const {fetchDatabaseOwner} = fetchDatabaseOwnerSlice.actions
export default fetchDatabaseOwnerSlice.reducer
