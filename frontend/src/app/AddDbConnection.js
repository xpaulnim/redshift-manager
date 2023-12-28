import {Box} from "@mui/material"
import { FormControl } from "@mui/base/FormControl"
import {Grid, Stack, TextField} from "@mui/material"

import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import NativeSelect from '@mui/material/NativeSelect'
import Input from '@mui/material/Input'
import { useState } from "react"
import Button from "@mui/material/Button"

export default function AddDbConnection(props) {
    // const [dbConnProps, setDbConnProps] = useState({
    //     "connectionType": "Redshift",
    //     "hostname": "",
    //     "port": "",
    //     "database": "",
    //     "user": "",
    //     "password": ""
    // })

    return (
        <Box>
            <h1>Add Connection</h1>
            <FormControl >
                <Stack direction="column" sx={{maxWidth: 500}}>

                    <InputLabel htmlFor="db-type-select">Host</InputLabel>
                    <Select labelId="db-type-select">
                        <MenuItem value={"Redshift"}>Redshift</MenuItem>
                        <MenuItem value={"Postgres"}>Postgres</MenuItem>
                    </Select>

                    <InputLabel htmlFor="host-input">Host</InputLabel>
                    <Input id="host-input" required={true} aria-describedby="my-helper-text" />

                    <InputLabel htmlFor="port-input">Port</InputLabel>
                    <Input id="port-input" required={true} aria-describedby="my-helper-text" />

                    <InputLabel htmlFor="db-input">Database</InputLabel>
                    <Input id="db-input" required={true} aria-describedby="my-helper-text" />

                    <InputLabel htmlFor="user-input">User</InputLabel>
                    <Input id="user-input" required={true} aria-describedby="my-helper-text" />

                    <InputLabel htmlFor="password-input">Password</InputLabel>
                    <Input id="password-input" required={true} type={"password"} aria-describedby="my-helper-text" />

                    <Button variant="contained" sx={{margin: 1}}>Submit</Button>
                </Stack>
            </FormControl>
        </Box>
    )
}
