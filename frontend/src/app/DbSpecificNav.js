import {Box, Grid} from "@mui/material"
import {FeatureNavLeft} from "./FeatureNavLeft"
import {DbObjectExplorer} from "./DbObjectExplorer"
import {UserManager} from "./UserManager"
import React, {useEffect, useState} from "react"

export default function  DbSpecificNav({dbConnectionId}) {
    const [componentState, setComponentState] = useState({
        "currentDbConnectionId": null,
        "mainNavOptionSelected": "database"  // database, users, sql_editor, masking, queries
    })

    if(componentState.currentDbConnectionId === null && dbConnectionId !== null && componentState.currentDbConnectionId !== dbConnectionId) {
        console.log("Initialising connection " + dbConnectionId)
        setComponentState({
            ...componentState,
            ["currentDbConnectionId"]: dbConnectionId
        })
    }

    const handleMainNavOptionSelected = (mainNavOptionSelected) => {
        setComponentState({
            ...componentState,
            ["mainNavOptionSelected"]: mainNavOptionSelected
        })
    }

    return (
        <Box>
            <div hidden={componentState.currentDbConnectionId === null}>
                <h1>Redshift manager {dbConnectionId}</h1>

                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <FeatureNavLeft onMainNavOptionSelected={handleMainNavOptionSelected}/>
                    </Grid>

                    <Grid item xs={10}>
                        <div hidden={!(componentState.mainNavOptionSelected === 'database')}>
                            <DbObjectExplorer dbConnectionId={dbConnectionId}/>
                        </div>

                        <div hidden={!(componentState.mainNavOptionSelected === 'users')}>
                            <UserManager dbConnectionId={dbConnectionId}/>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <div hidden={componentState.currentDbConnectionId !== null}>
                <p>Click one of the db connections in the menu</p>
            </div>
        </Box>
    )
}
