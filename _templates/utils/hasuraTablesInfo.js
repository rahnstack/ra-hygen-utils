const Axios = require("axios").default;
const headers = {
  "Content-Type": "application/json",
  "X-Hasura-Role": "admin",
  "x-hasura-admin-secret": process.env.HASURA_SECRET,
};

async function hasuraSqlResults(sql) {
  const postData = {
    type: "run_sql",
    args: {
      sql,
    },
  };
  const { data } = await Axios.post(
    "https://caring-labrador-34.hasura.app/v2/query",
    postData,
    { headers }
  );
  return data;
}

async function restCall(location) {
  const { data } = await Axios.get(
    `https://caring-labrador-34.hasura.app/api/rest/${location}`,
    {
      headers,
    }
  );
  return data;
}

module.exports = {
  hello: async () => {
    return "hello from hasuraTablesInfo";
  },
  getTableCols: async (resource) => {
    const sql = `
    SELECT
      cols.column_name,
      cols.data_type,
      (
        SELECT pg_catalog.col_description(c.oid, cols.ordinal_position::int)
        FROM pg_catalog.pg_class c WHERE c.oid = ( SELECT cols.table_name::regclass::oid )
        AND c.relname = cols.table_name
      ) as column_comment
      FROM information_schema.columns cols WHERE cols.table_name = '${resource}';
    `;

    return await hasuraSqlResults(sql);
  },
  getSchemaTables: async () => {
    const sql = `
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
    `;
    return await hasuraSqlResults(sql);
  },
  getTableForeignKeys: async (resource) => {
    const sql = `
  SELECT
      kcu.column_name AS column_name, 
      ccu.table_name AS foreign_table,
      ccu.column_name AS foreign_column 
  FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='${resource}';
    `;
    return await hasuraSqlResults(sql);
  },
  getGenCoreSettings: async () => {
    const { core_setting } = await restCall("core_setting");
    const genCoreSetting = core_setting.filter((setting) =>
      setting.setting_name.includes("_gen_")
    );
    return genCoreSetting ? genCoreSetting : nulll;
  },
};
