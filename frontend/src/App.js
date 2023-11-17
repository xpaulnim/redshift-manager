import React, { useState } from 'react'
import {useSelector, useDispatch, Provider} from "react-redux"
import {Box, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs} from "@mui/material"
import {TreeView, TreeItem} from "@mui/x-tree-view"
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {add, subtract} from "./slices"
import { TabContainer, TabPanel } from './components/TabComponent.js'

import {databases} from './data.js'
import { useGetUsersQuery } from './api.js'

function DatabaseTreeItemComponent(props) {
  return (
    <TreeItem 
      key={props.database.id} 
      nodeId={props.database.id} 
      label={props.database.name}
      onClick={() => props.onDbObjectSelected({"objectType":'database', "objectName": props.database.name})} >

       {
          props.database.schemas.map((schema) => 
      
          <TreeItem 
            key={schema.id} 
            nodeId={schema.id} 
            label={schema.name}
            onClick={() => props.onDbObjectSelected({"objectType":'schema', "objectName": schema.name})}>

             { schema.tables.map((table) => 
                <TreeItem 
                    key={table.id} 
                    nodeId={table.id} 
                    label={table.name}
                    onClick={() => props.onDbObjectSelected({"objectType": 'table', "objectName": table.name})} />
                ) 
              }
          </TreeItem>
        )
      }
    </TreeItem>
  )
}

function DatabaseDetails(props) {
  return (
    <TabContainer tabs={[
      {
        "header": "Tables", 
        "content": <p>This database has the following schemas</p>
      },
      {
        "header": "Details",
        "content": <p>Details, like when the database was created and who created it, whether it is an external db, if so what it's iam is and the store it uses</p>
      }, 
      {
        "header": "Permissions",
        "content": <p>Who can use this database</p>
      }
    ]} />
  )
}

function SchemaDetailsTab(props) {
  const _schema = databases[0].schemas[0]

  const tablesPanel = (       
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell>Size</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              _schema.tables.map((row) => (
                <TableRow 
                  key={row.id}>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.owner}</TableCell>
                  <TableCell align="left">{row.created_at}</TableCell>
                  <TableCell align="left">{row.size}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
  )
          
  const detailsPanel = (
      <TableContainer sx={{ maxWidth: 300 }} component={Paper}>
        <Table size="small">
          <TableBody>
            {
              ['id', 'name', 'owner', 'comment'].map((key) => (
                <TableRow size="small">
                  <TableCell align="left">{key}</TableCell>
                  <TableCell align="left">{_schema[key]}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
  )

  const permissionsPanel = (
      <p>Permissions table ie user, action</p>
  )

  return (
      <TabContainer tabs={[
        {
          "header": "Tables", 
          "content": tablesPanel
        },
        {
          "header": "Details",
          "content": detailsPanel
        }, 
        {
          "header": "Permissions",
          "content": permissionsPanel
        }
      ]} />
  )
}

function TableDetailsTab(props) {
  return (
    <TabContainer tabs={[
      {
        "header": "Columns", 
        "content": <p>A table of column name, type and comment</p>
      },
      {
        "header": "Sample data",
        "content": <p>Select top n from the table</p>
      }, 
      {
        "header": "details",
        "content": <p>Type eg external, if external storage location & properties, Created At, table Id and other stuff from table info </p>
      },
      {
        "header": "Permissions",
        "content": <p>Who can access this table and what can they do</p>
      },
      {
        "header": "History",
        "content": <p>DDL statements that have previously been run against this table</p>
      },
      {
        "header": "Insights",
        "content": <p>Breakdown of the previous access to this table. eg queries over the last n days, who queries the table and how much it has grown</p>
      }
    ]} />
  )
}

export function App() {
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()
    const [objectSelected, showObjectDetails] = useState({
      "objectType": "database",
      "objectName": "dev"
    })

    const [state, setState] = useState({})

    const {userData, error, isLoading} = useGetUsersQuery()

    return (
        <Grid container spacing={2} >
          <Grid item xs={4}>
              <TreeView 
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />} >
                
                { 
                  databases.map((database) => 
                    <DatabaseTreeItemComponent 
                      database={database} 
                      onDbObjectSelected={showObjectDetails}/>
                  )
                }
              </TreeView>
          </Grid>

          <Grid item xs={8}>
              <div > userData : {userData} </div>

              <h2>{databases[0].schemas[0].name}</h2>
              <p>Owner: {databases[0].schemas[0].owner}</p>
              <p>Comment: {databases[0].schemas[0].comment}</p>
              
              <div hidden={!(objectSelected.objectType === 'database')}>
                <h3>database {objectSelected.objectName} selected</h3>

                <DatabaseDetails database={databases[0]} />
              </div>

              <div  hidden={!(objectSelected.objectType === 'schema')}>
                <h3>schema {objectSelected.objectName} is selected</h3>

                <SchemaDetailsTab schema={objectSelected.objectName} />
              </div>

              <div hidden={!(objectSelected.objectType === 'table')}>
                <h3>table {objectSelected.objectName} is selected</h3>

                <TableDetailsTab table={objectSelected.objectName} />
              </div>
          </Grid>
        </Grid>   
    )
}
