import {Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {users} from "../data";
import React, {useState} from "react";
import {canUseDOM} from "react-redux/es/utils/useIsomorphicLayoutEffect";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserListThunk} from "../features/fetchUserListSlice";

function checkboxFromBool(ticked) {
    if (ticked) {
        return (<Checkbox disabled checked/>)
    }

    return (<Checkbox disabled/>)
}

export const UserManagerUserDetails = function (props) {
    const [currentUserList, setUserList] = useState({
        "currentUserList": ""
    })

    const dispatch = useDispatch()
    const userList = useSelector(state => state.userList)

    if (currentUserList.currentUserList === "") {
        console.log("fetching user list -> should happen once")

        dispatch(fetchUserListThunk())
        setUserList(userList)
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Username</TableCell>
                        <TableCell align="left">Super user</TableCell>
                        <TableCell align="left">Create db</TableCell>
                        <TableCell align="left">Roles</TableCell>
                        <TableCell align="left">Groups</TableCell>
                        <TableCell align="left">Valid until</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userList.data.map((row) => (
                        <TableRow>
                            <TableCell align="left">{row.username}</TableCell>
                            <TableCell align="left">{checkboxFromBool(row.usesuper)}</TableCell>
                            <TableCell align="left">{checkboxFromBool(row.usecreatedb)}</TableCell>
                            <TableCell align="left">{row.roles.length}</TableCell>
                            <TableCell align="left">{row.groups.length}</TableCell>
                            <TableCell align="left">{row.valuntil}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}