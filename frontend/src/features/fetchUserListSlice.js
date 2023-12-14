import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialUserListState = {
    data: [],
    status: 'init',
    error: null
}

export const fetchUserListThunk = createAsyncThunk(
    'backend/fetchUserList',
    async() => {
        console.log('http://localhost:8000/user_list')

        const response = await axios.get('http://localhost:8000/user_list')
        console.log(response.data)

        return response.data
    }
)

const fetchUserListSlice = createSlice({
    name: 'userList',
    initialState: initialUserListState,
    extraReducers: (builder) => {
        builder.addCase(fetchUserListThunk.fulfilled, (state, action) => {
            console.log("fulfilled: " + state)
            console.log("state: " + action.payload.data)

            state.status = 'fulfilled'
            state.data = action.payload.data
        })
    }
})

export default fetchUserListSlice.reducer
