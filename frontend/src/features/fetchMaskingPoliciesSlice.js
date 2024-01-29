import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const maskingPoliciesInitialState = {
    data: [],
    status: 'init',
    error: null
}

export const fetchMaskingPoliciesThunk = createAsyncThunk(
    'backend/fetchMaskingPolicies',
    async (arg) => {
        const response = await axios.get("http://localhost:8000/" + arg["dbConnectionId"] + "/masking_policies/")

        return response.data
    }
)

const fetchMaskingPoliciesSlice = createSlice({
    name: "maskingPolicies",
    initialState: maskingPoliciesInitialState,
    extraReducers: (builder) => {
        builder.addCase(fetchMaskingPoliciesThunk.pending, state => {
            state.status = 'pending'
        }).addCase(fetchMaskingPoliciesThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchMaskingPoliciesThunk.rejected, (state, action) => {
            state.status = 'failed'
        })
    }
})

export default fetchMaskingPoliciesSlice.reducer
