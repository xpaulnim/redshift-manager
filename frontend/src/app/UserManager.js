import {Box} from "@mui/material";
import {TabContainer} from "./TabComponent";
import {UserManagerUserDetails} from "./UserManagerUserDetails";


export function UserManager(props) {
    const users = (
        <UserManagerUserDetails/>
    )

    return (
        <Box>
            <TabContainer tabs={[
                {
                    "header": "Groups",
                    "content": <p>I manage groups</p>
                },
                {
                    "header": "Roles",
                    "content": <p>I manage roles</p>
                },
                {
                    "header": "Users",
                    "content": users
                }
                ]}/>
        </Box>
    )
}