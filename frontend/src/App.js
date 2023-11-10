import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {add, subtract} from "./slices";
import {Grid} from "@mui/material";
import {TreeView, TreeItem} from "@mui/x-tree-view"

export function App() {
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <TreeView>
                    <TreeItem nodeId="1" label="dev" >
                        <TreeItem nodeId="2" label="schema">
                            <TreeItem nodeId="3" label="tree"/>
                        </TreeItem>
                    </TreeItem>
                </TreeView>
            </Grid>
            <Grid item xs={8}>
                <div>world</div>
            </Grid>

            {/*<p>a paragraph</p>*/}
            {/*<h2>{count}</h2>*/}
            {/*<button onClick={() => dispatch(add())}>add</button>*/}
            {/*<button onClick={() => dispatch(subtract())}>subtract</button>*/}
        </Grid>
    )
}
