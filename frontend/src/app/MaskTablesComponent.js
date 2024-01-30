import {
    Box,
    Grid,
    Stack,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {fetchMaskingPoliciesThunk} from "../features/fetchMaskingPoliciesSlice"

function ColumnMaskDetailsComponent(props) {
    const [componentState, setComponentState] = useState({
        policy_name: "",
        policy_modified_time: "",
        policy_modified_by: "",
        input_columns: [],
        policy_expression: [],
        get_masking_policy_attachments: [],
    })
    const maskingPolicies = useSelector(state => state.maskingPolicies)

    useEffect(() => {
        if (props.mask !== "" && props.mask !== null && props.mask !== componentState.policy_name) {
            console.log("filtering masks " + props.mask)

            const maskDetails = maskingPolicies.data.filter((a) => a.policy_name === props.mask)
            if (maskDetails.length > 0) {
                console.log("this is " + JSON.stringify(maskDetails[0].get_masking_policy_attachments[0].schema_name))
                setComponentState(maskDetails[0])
            }
        }
    }, [props, maskingPolicies])

    return (
        <Box>
            <p style={{marginTop: 0}}>Name: {componentState.policy_name}</p>
            <p>Modification date: {componentState.policy_modified_time}</p>
            <p>Modified by: {componentState.policy_modified_by}</p>
            <div>
                <p>Policy</p>
                <Box sx={{borderRadius: 1}} fontFamily={'monospace'}>
                    <Box sx={{backgroundColor: '#eee', borderTopRightRadius: 3, borderTopLeftRadius: 3, padding: 0.5}}>
                        <p>
                            <b>Input columns:</b> { componentState.input_columns.map((col) => (<span>{col.colname} : {col.type}</span>)) }
                        </p>
                    </Box>
                    <Box>
                        {componentState.policy_expression.map((exp) => (
                            <p>{exp.expr}</p>
                        ))}
                    </Box>
                </Box>
            </div>
            <div>
                <p>Policy attachments</p>

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Table</TableCell>
                                <TableCell>Grantor</TableCell>
                                <TableCell>Grantee</TableCell>
                                <TableCell>Grantee Type</TableCell>
                                <TableCell>Input Columns</TableCell>
                                <TableCell>Output Columns</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {componentState.get_masking_policy_attachments.map((attachment) => (
                                <TableRow key={attachment.schema_name}>
                                    <TableCell align="left">{attachment.schema_name}.{attachment.table_name}</TableCell>
                                    <TableCell align="left">{attachment.grantor}</TableCell>
                                    <TableCell align="left">{attachment.grantee}</TableCell>
                                    <TableCell align="left">{attachment.grantee_type}</TableCell>
                                    <TableCell align="left">{attachment.input_columns}</TableCell>
                                    <TableCell align="left">{attachment.output_columns}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Box>
    )
}

export default function MaskTablesComponent({dbConnectionId}) {
    const [componentState, setComponentState] = useState("")

    const dispatch = useDispatch()
    const maskingPolicies = useSelector(state => state.maskingPolicies)
    const maskingPoliciesStatus = useSelector(state => state.maskingPolicies.status)

    useEffect(() => {
        console.log("fetching masks " + dbConnectionId)

        if (maskingPoliciesStatus === 'init' && dbConnectionId !== null) {
            console.log('dispatched: ' + dbConnectionId)
            dispatch(fetchMaskingPoliciesThunk({"dbConnectionId": dbConnectionId}))
        }
    }, [dbConnectionId])

    return (
        <Box>
            <Grid container>
                <Grid xs={3} sx={{maxHeight: '92vh', maxWidth: 250, overflow: 'auto'}}>
                    <Stack>
                        <TextField label="Filter" id="outlined-basic" variant="outlined" size="small" margin="normal"/>

                        <List dense={true}>
                            {maskingPolicies.data.map((mask) => (
                                <ListItem disablePadding key={mask.policy_name}>
                                    <ListItemButton onClick={() => {
                                        console.log("clicked " + mask.policy_name)
                                        setComponentState(mask.policy_name)
                                    }}>
                                        <ListItemText primary={mask.policy_name}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                </Grid>

                <Grid xs={9} sx={{paddingLeft: 3}}>
                    <ColumnMaskDetailsComponent mask={componentState}/>
                </Grid>
            </Grid>

        </Box>
    )
}
