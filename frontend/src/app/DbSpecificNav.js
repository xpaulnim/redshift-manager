import {Box, Grid} from "@mui/material";
import {FeatureNavLeft} from "./MainNav";
import {DbObjectExplorer} from "./DbObjectExplorer";
import {UserManager} from "./UserManager";
import React, {useState} from "react";

export default function  DbSpecificNav(props) {
    const [mainNavOptionSelected, setMainNavOptionSelected] = useState({
        "mainNavOptionSelected": "database"
    })

    return (
        <Box>
            <h1>Redshift manager</h1>

            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <FeatureNavLeft onMainNavOptionSelected={setMainNavOptionSelected}/>
                </Grid>

                <Grid item xs={10}>
                    <div hidden={!(mainNavOptionSelected.mainNavOptionSelected === 'database')}>
                        <DbObjectExplorer/>
                    </div>

                    <div hidden={!(mainNavOptionSelected.mainNavOptionSelected === 'users')}>
                        <UserManager/>
                    </div>
                </Grid>
            </Grid>
        </Box>
    )
}
