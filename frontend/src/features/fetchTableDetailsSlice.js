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
    async(tableName) => {
        console.log('http://localhost:8000/table_details/' + tableName)

        const response = await axios.get('http://localhost:8000/table_details/' + tableName)
        console.log(response)

        return response.data
    }
)


const fetchTableDetailsSlice = createSlice({
    name: 'tableDetails',
    initialState: initialTableDetailsState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTableDetailsThunk.fulfilled, (state, action) => {
            console.log("fulfilled: " + state)
            console.log("ds me state: " + action.payload.data)

            state.status = 'fulfilled'
            state.data = action.payload.data
        }).addCase(fetchTableDetailsThunk.rejected, (state, action) => {
            console.log("fulfilled: " + state)
            console.log("fialed state: " + action)
        })
    }
})


export const {fetchTableDetails} = fetchTableDetailsSlice.actions
export default fetchTableDetailsSlice.reducer
