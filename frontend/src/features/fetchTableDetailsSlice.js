import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialTableDetailsState = {
    data: {
        "table_columns": [],
        "table_preview": []
    },
    status: 'init',
    error: null
}


export const fetchTableDetailsThunk = createAsyncThunk(
    'backend/fetchTableDetailsThunk',
    async(arg) => {
        const response = await axios.get("http://localhost:8000/" + arg["dbConnectionId"] + "/table_details/" + arg["tableName"])

        return response.data
    }
)


const fetchTableDetailsSlice = createSlice({
    name: 'tableDetails',
    initialState: initialTableDetailsState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTableDetailsThunk.fulfilled, (state, action) => {
            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchTableDetailsThunk.rejected, (state, action) => {
            state.status = 'failed'
        })
    }
})


export const {fetchTableDetails} = fetchTableDetailsSlice.actions
export default fetchTableDetailsSlice.reducer
