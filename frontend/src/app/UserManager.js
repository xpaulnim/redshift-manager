import {Box} from "@mui/material"
import {TabContainer} from "./TabComponent"
import {UserManagerUserDetails} from "./UserManagerUserDetails"
import GroupManager from "./GroupManager"


export function UserManager({dbConnectionId}) {
    return (
        <Box>
            <TabContainer tabs={[
                {
                    "header": "Groups",
                    "content": <GroupManager />
                },
                {
                    "header": "Roles",
                    "content": <p>I manage roles</p>
                },
                {
                    "header": "Users",
                    "content":  <UserManagerUserDetails dbConnectionId={dbConnectionId}/>
                }
                ]}/>
        </Box>
    )
}
