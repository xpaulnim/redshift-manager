import {Box, Grid} from "@mui/material"
import {FeatureNavLeft} from "./FeatureNavLeft"
import {DbObjectExplorer} from "./DbObjectExplorer"
import {UserManager} from "./UserManager"
import MaskTablesComponent from "./MaskTablesComponent"
import React, {useState} from "react"

export default function DbSpecificNav({dbConnectionId}) {
    const [componentState, setComponentState] = useState({
        "currentDbConnectionId": null,
        "mainNavOptionSelected": "database"  // database, users, sql_editor, masking, queries
    })

    if (componentState.currentDbConnectionId === null && dbConnectionId !== null && componentState.currentDbConnectionId !== dbConnectionId) {
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
                <h2>Redshift manager {dbConnectionId}</h2>

                <Grid container>
                    <Grid item xs={1.5} >
                        <FeatureNavLeft onMainNavOptionSelected={handleMainNavOptionSelected} />
                    </Grid>

                    <Grid item xs={10.5} >
                        <Box hidden={!(componentState.mainNavOptionSelected === 'database')} >
                            <DbObjectExplorer dbConnectionId={dbConnectionId}/>
                        </Box>

                        <Box hidden={!(componentState.mainNavOptionSelected === 'users')}>
                            <UserManager dbConnectionId={dbConnectionId}/>
                        </Box>

                        <Box hidden={!(componentState.mainNavOptionSelected === 'masking')}>
                            <MaskTablesComponent dbConnectionId={dbConnectionId}/>
                        </Box>

                        <Box hidden={componentState.currentDbConnectionId !== null}>
                            <p>Click one of the db connections in the menu</p>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </Box>
    )
}
