import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const databasesOutlineInitState = {
    data: {},
    status: 'init',
    error: null
}

export const queryBackendThunk = createAsyncThunk(
    /* typePrefix    =*/ 'database/fetchDbOutline',  
    /* payloadCreator= */ async () => {
        // TODO: Handle error with try-catch

        const response = await axios.get('http://localhost:8000/db_outline')
        
        console.log(response.data)

        return response.data
    }
)

const dbOutlineSlice = createSlice({
    name: 'dbOutline',
    initialState: databasesOutlineInitState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(queryBackendThunk.pending, (state, action) => {
            console.log("pending state" + state)
            console.log("pending state" + action)
            state.status = 'pending'
        }).addCase('database/fetchDbOutline/fulfilled', (state, action) => {
            console.log("state" + state)
            console.log("state" + action)

            state.status = 'succeeded'
            state.data = action.payload.data
        }).addCase(queryBackendThunk.rejected, (state, action) => {
            console.log("failed " + state)
            console.log("failed " + action)
            state.status = 'failed'
        })
    }
})

export const { fetchDbOutline }  = dbOutlineSlice.actions
export default dbOutlineSlice.reducer
