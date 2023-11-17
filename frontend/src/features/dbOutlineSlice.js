import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const databasesOutline = [
    {
        name: "dev",
        schemas: [
            {
                name: "public",
                tables: [
                    "transactions",
                    "click_events",
                    "purchases",
                    "sample_table"
                ]
            }
        ]
    },
    {
        name: "prod",
        schemas: [
            {
                name: "public",
                tables: [
                    "transactions",
                    "click_events",
                    "purchases"
                ]
            }
        ]
    }
]

export const fetchDbOutline = createAsyncThunk(
    'fetchDbOutline', // fetchDbOutline is an action type prefix
    async () => {
        const result = await axios.get('http://localhost:5000/db_outline')
        return result.data
    }
)

const dbOutlineSlice = createSlice({
    name: 'dbOutline',
    initialState: databasesOutline,
    reducers: {}
})

export default dbOutlineSlice.reducer