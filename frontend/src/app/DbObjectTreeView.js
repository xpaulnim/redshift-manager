import React from 'react'
import {TreeItem, TreeView} from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function DatabaseTreeItemComponent({database_name, schema_obj, onDbObjectSelected}) {
    return (
        <TreeItem
            key={database_name}
            nodeId={database_name}
            label={database_name}
            onClick={() => onDbObjectSelected({"objectSelected": database_name})}>

            {
                Object.entries(schema_obj).map(([schema_name, tables_list]) =>
                    <TreeItem
                        key={database_name.concat('.', schema_name)}
                        nodeId={database_name.concat('.', schema_name)}
                        label={schema_name}
                        onClick={() => onDbObjectSelected({"objectSelected": database_name.concat('.', schema_name)})}>

                        {
                            tables_list.map((table_name) =>
                                <TreeItem
                                    key={database_name.concat('.', schema_name, '.', table_name)}
                                    nodeId={database_name.concat('.', schema_name, '.', table_name)}
                                    label={table_name}
                                    onClick={() => onDbObjectSelected({
                                        "objectSelected": database_name.concat('.', schema_name, '.', table_name)
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
                Object.entries(databaseOutline).map(([database_name, schema_obj]) =>
                    <DatabaseTreeItemComponent
                        database_name={database_name}
                        schema_obj={schema_obj}
                        onDbObjectSelected={onDbObjectSelected}/>
                )
            }
        </TreeView>
    )
}
