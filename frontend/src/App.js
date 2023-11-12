import React from 'react'
import {useSelector, useDispatch} from "react-redux"
import {add, subtract} from "./slices"
import {Grid} from "@mui/material"
import {TreeView, TreeItem} from "@mui/x-tree-view"
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {databases} from './data.js'

function DatabaseTreeItemComponent(props) {
  return (
    <TreeItem nodeId={props.database.id} label={props.database.name}>
       {
          props.database.schemas.map((schema) => 
      
          <TreeItem nodeId={schema.id} label={schema.name}>
             { schema.tables.map((table) => <TreeItem nodeId={table.id} label={table.name}/>) }
          </TreeItem>
        )
      }
    </TreeItem>
  )
}

export function App() {
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <TreeView 
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />} >
                  
                  { databases.map((database) => <DatabaseTreeItemComponent database={database}/>) }
                </TreeView>
            </Grid>

            <Grid item xs={8}>
                <p>a paragraph</p>
                <h2>{count}</h2>
                <button onClick={() => dispatch(add())}>add</button>
                <button onClick={() => dispatch(subtract())}>subtract</button>
            </Grid>
        </Grid>   
    )
}
