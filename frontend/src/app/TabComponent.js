import {Box, Tab, Tabs} from "@mui/material"
import React, {useState} from 'react'

function TabPanel(props) {
    const {children, value, index, ...other} = props;

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

export function TabContainer({tabs}) {
    const [tabSelected, setTabSelected] = useState(0)

    const handleChange = (event, newValue) => {
        setTabSelected(newValue)
    }

    return (
        <Box>
            <Box>
                <Tabs value={tabSelected} onChange={handleChange}>
                    {tabs.map((tab) => <Tab label={tab.header}></Tab>)}
                </Tabs>
            </Box>

            {
                Array(tabs.length).fill(1).map((item, index, b) =>
                    <TabPanel value={tabSelected} index={index}>{tabs[index].content}</TabPanel>
                )
            }

        </Box>
    )
}
