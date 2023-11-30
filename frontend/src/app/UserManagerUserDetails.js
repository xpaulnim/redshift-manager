import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {users} from "../data";

export const UserManagerUserDetails = function (props) {
    const userEmailElem = (userName, userEmail) => {
        return (
            <div>
                <p>{userName}</p>
                <p>{userEmail}</p>
            </div>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Name & Email</TableCell>
                        <TableCell align="left">Created on</TableCell>
                        <TableCell align="left">Groups</TableCell>
                        <TableCell align="left">Roles</TableCell>
                        <TableCell align="left">Last Login</TableCell>
                        <TableCell align="left">Password Changed</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((row) => (
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">{userEmailElem(row.name, row.email)}</TableCell>
                            <TableCell align="left">{row.created_on}</TableCell>
                            <TableCell align="left">{row.groups.length}</TableCell>
                            <TableCell align="left">{row.roles.length}</TableCell>
                            <TableCell align="left">{row.last_login}</TableCell>
                            <TableCell align="left">{row.password_changed}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}