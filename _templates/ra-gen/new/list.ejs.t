---
_ResourceNameList: <% ResourceNameList = h.inflection.camelize(resourceName)+`List` %>
to: <%= predir+ResourceNameList %>.tsx
force: true
---

import React from "react";
import {
  Datagrid,
  DateField,
  List,
  ListProps,
  NumberField,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  TextField,
  TextInput,
  useLocale,
  Datagrid
} from "react-admin";
import { useMyDefaultStyles } from "../../../styles/default";

export default function <%= ResourceNameList %>(props: any) {
  const defaultClss = useMyDefaultStyles();
  return (
    <>
    <%# 
    * use _gen_ with jsonb
     %>
      <List {...props}>
        <Datagrid rowClick="edit">
            <% raFields.forEach((field)=>{ %>
              <%- include(templates+fieldsTmpPath+field.tmp_name,{field}) -%> 
            <%})%>
        </Datagrid>
      </List>
    </>
  );
}
