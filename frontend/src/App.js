import React from 'react'
import {useSelector, useDispatch} from "react-redux"
import {Box} from "@mui/material"

import {DbObjectExplorer} from "./app/DbObjectExplorer";


export function App() {
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()

    return (
        <Box>
            <h1>Redshift manager</h1>
            <DbObjectExplorer/>
        </Box>
    )
}
