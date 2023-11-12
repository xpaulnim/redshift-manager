import React, { useState } from 'react'
import {useSelector, useDispatch, Provider} from "react-redux"
import {add, subtract} from "./slices"
import {Box, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs} from "@mui/material"
import {TreeView, TreeItem} from "@mui/x-tree-view"
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {databases} from './data.js'

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

function SchemaDetailsTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box> {children} </Box>
      )}
    </div>
  )
}

function SchemaDetailsTab(props) {
  // props ~> [objectType, objectName]

  const [tabSelected, setTabSelected] = useState(0)

  const handleChange = (event, newValue) => {
    setTabSelected(newValue)
  }

  const _schema = databases[0].schemas[0]

  return (
    <Box>
      <Box>
        <Tabs value={tabSelected} onChange={handleChange}>
          <Tab label="Tables"></Tab>
          <Tab label="Details"></Tab>
          <Tab label="Permissions"></Tab>
        </Tabs>
      </Box>

      <SchemaDetailsTabPanel value={tabSelected} index={0}>
        
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

      </SchemaDetailsTabPanel>

      <SchemaDetailsTabPanel value={tabSelected} index={1}>

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
      </SchemaDetailsTabPanel>

      <SchemaDetailsTabPanel value={tabSelected} index={2}>
        Permissions table ie user, action
      </SchemaDetailsTabPanel>  
    </Box>
  )
}

export function App() {
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()
    const [objectSelected, showObjectDetails] = useState({
      "objectType": "",
      "objectName": ""
    })



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
               <h2>{databases[0].schemas[0].name}</h2>
               <p>Owner: {databases[0].schemas[0].owner}</p>
               <p>Comment: {databases[0].schemas[0].comment}</p>
               
               <div  hidden={!(objectSelected.objectType === 'schema')}>
                  <h3>schema {objectSelected.objectName} is selected</h3>

                  <SchemaDetailsTab
                      schema={objectSelected.objectName} />
                </div>

                <div hidden={!(objectSelected.objectType === 'database')}>
                 <h3>database {objectSelected.objectName} selected</h3>
                </div>

                <div hidden={!(objectSelected.objectType === 'table')}>
                  <h3>table {objectSelected.objectName} is selected</h3> 
                </div>
            </Grid>
        </Grid>   
    )
}
