---
_ResourceNameForm: <% ResourceNameForm = h.inflection.camelize(resourceName)+`Form` %>
to: <%= predir+ResourceNameForm %>.tsx
force: true
---

import React from "react";
import {
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  useLocale,
} from "react-admin";
import { useMyDefaultStyles } from "../../../styles/default";

export default function <%= ResourceNameForm %>(props: any) {
  const defaultClss = useMyDefaultStyles();
  return (
    <SimpleForm {...props}>
        <% raFields.forEach((field)=>{ %>
          <%- include(templates+inputsTmpPath+field.tmp_name,{field}) -%> 
        <%})%>
    </SimpleForm>
  );
}
