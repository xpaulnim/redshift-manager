import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const databasesOutlineInitState = {
    data: {},
    status: 'init',
    error: null
}

export const fetchDbOutlineThunk = createAsyncThunk(
    /* typePrefix    =*/ 'backend/fetchDbOutline',
    /* payloadCreator= */ async () => {
        // TODO: Handle error with try-catch

        const response = await axios.get('http://localhost:8000/db_outline')
        console.log(response.data)

        return response.data
    }
)

const fetchDbOutlineSlice = createSlice({
    name: 'dbOutline',
    initialState: databasesOutlineInitState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDbOutlineThunk.pending, (state, action) => {
            console.log("pending state" + state)
            console.log("pending state" + action)

            state.status = 'pending'
        }).addCase('backend/fetchDbOutline/fulfilled', (state, action) => {
            console.log("state" + state)
            console.log("state" + action)

            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchDbOutlineThunk.rejected, (state, action) => {
            console.log("failed " + state)
            console.log("failed " + action)

            state.status = 'failed'
        })
    }
})

export const { fetchDbOutline }  = fetchDbOutlineSlice.actions
export default fetchDbOutlineSlice.reducer
