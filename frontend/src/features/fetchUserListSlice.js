import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialUserListState = {
    data: [],
    status: 'init',
    error: null
}

export const fetchUserListThunk = createAsyncThunk(
    'backend/fetchUserList',
    async(arg) => {
        const response = await axios.get("http://localhost:8000/" + arg["dbConnectionId"] +"/user_list")
        return response.data
    }
)

const fetchUserListSlice = createSlice({
    name: 'userList',
    initialState: initialUserListState,
    extraReducers: (builder) => {
        builder.addCase(fetchUserListThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        })
    }
})

export default fetchUserListSlice.reducer
