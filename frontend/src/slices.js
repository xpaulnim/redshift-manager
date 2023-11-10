import {createSlice} from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
      value: 0
    },
    reducers: {
        add: (state) => {
            state.value += 1
        },
        subtract: (state) => {
            state.value -= 1
        },
        changeExact: (state, action) => {
            state.value += action.payload
        }
    }
})

export const { add, subtract, changeExact}  = counterSlice.actions
export default counterSlice.reducer
