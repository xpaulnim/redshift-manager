import React from 'react'
import {Box, Grid} from "@mui/material"

import {DbObjectExplorer} from "./app/DbObjectExplorer";
import {FeatureNavLeft} from "./app/MainNav";

export function App() {
    return (
        <Box>
            <h1>Redshift manager</h1>

            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <FeatureNavLeft/>
                </Grid>

                <Grid item xs={10}>
                    <DbObjectExplorer />
                </Grid>
            </Grid>
        </Box>
    )
}
