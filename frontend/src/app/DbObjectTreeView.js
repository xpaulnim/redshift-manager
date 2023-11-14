import React from 'react'
import {TreeItem, TreeView} from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function DatabaseTreeItemComponent({database, onDbObjectSelected}) {
    return (
        <TreeItem
            key={database.name}
            nodeId={database.name}
            label={database.name}
            onClick={() => onDbObjectSelected({"objectType": 'database', "objectName": database.name})}>

            {
                database.schemas.map((schema) =>

                    <TreeItem
                        key={database.name.concat('.', schema.name)}
                        nodeId={database.name.concat('.', schema.name)}
                        label={schema.name}
                        onClick={() => onDbObjectSelected({"objectType": 'schema', "objectName": schema.name})}>

                        {
                            schema.tables.map((table) =>
                                <TreeItem
                                    key={database.name.concat('.', schema.name, '.', table)}
                                    nodeId={database.name.concat('.', schema.name, '.', table)}
                                    label={table}
                                    onClick={() => onDbObjectSelected({
                                        "objectType": 'table',
                                        "objectName": table
                                    })}
                                />
                            )
                        }
                    </TreeItem>
                )
            }
        </TreeItem>
    )
}

export function DbObjectTreeView({databaseOutline, onDbObjectSelected}) {
    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}>

            {
                databaseOutline.map((database) =>
                    <DatabaseTreeItemComponent
                        database={database}
                        onDbObjectSelected={onDbObjectSelected}/>
                )
            }
        </TreeView>
    )
}
