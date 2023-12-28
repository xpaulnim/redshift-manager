import {Box} from "@mui/material"
import { FormControl } from "@mui/base/FormControl"
import {Stack} from "@mui/material"

import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Input from "@mui/material/Input"
import { useState } from "react"
import Button from "@mui/material/Button"
import { useDispatch } from "react-redux"
import { createDbConnectionThunk } from "../features/createDbConnectionSlice"

export default function AddDbConnection(props) {
    const [dbConnectionFormValues, setDbConnectionFormValues] = useState({})

    const dispatch = useDispatch()

    function handleDbSelectChanged(event) {
        console.log(event.target.name + " " + event.target.value)

        const {name, value} = event.target
        setDbConnectionFormValues({
            ...dbConnectionFormValues,
            [name]: value
        })
    }

    function handleInputChanged(event) {
        const {name, value} = event.target
        setDbConnectionFormValues({
            ...dbConnectionFormValues,
            [name]: value
        })
    }

    function handleOnAddConnectionSubmitClicked(event) {
        console.log(dbConnectionFormValues)
        dispatch(createDbConnectionThunk(dbConnectionFormValues))
        console.log("form sent to backend")
    }

    return (
        <Box>
            <h1>Add Connection</h1>
            <FormControl >
                <Stack direction="column" sx={{maxWidth: 500}}>

                    <InputLabel htmlFor="db-type-select">Type</InputLabel>
                    <Select labelId="db-type-select"
                            name="dbTypeSelect"
                            value={dbConnectionFormValues["dbTypeSelect"]}
                            onChange={handleDbSelectChanged}>

                        <MenuItem value={"Redshift"}>Redshift</MenuItem>
                        <MenuItem value={"Postgres"}>Postgres</MenuItem>
                    </Select>

                    <InputLabel htmlFor="host-input">Host</InputLabel>
                    <Input id="host-input" name="hostInput" required={true} onChange={handleInputChanged} />

                    <InputLabel htmlFor="port-input">Port</InputLabel>
                    <Input id="port-input" name="portInput" required={true} onChange={handleInputChanged} />

                    <InputLabel htmlFor="db-input">Database</InputLabel>
                    <Input id="db-input" name="dbInput" required={true}  onChange={handleInputChanged}/>

                    <InputLabel htmlFor="username-input">User</InputLabel>
                    <Input id="username-input" name="usernameInput" required={true} onChange={handleInputChanged} />

                    <InputLabel htmlFor="password-input">Password</InputLabel>
                    <Input id="password-input" name="passwordInput" required={true} type={"password"} onChange={handleInputChanged} />

                    <Button variant="contained" sx={{margin: 1}} onClick={handleOnAddConnectionSubmitClicked}>Submit</Button>
                </Stack>
            </FormControl>
        </Box>
    )
}
