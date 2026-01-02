import { tool, type ToolSet } from "ai";
import { z } from "zod";
import { executeReadOnlySQL } from "./sql";
import { listSchemas, listTables, listColumns } from "./introspection";

export const mssqlTools = {
  listSchemasMssql: tool({
    description: "ONLY FOR MSSQL/SQL SERVER - List available schemas in the connected Microsoft SQL Server (MSSQL) database. Use this when the user mentions MSSQL, SQL Server, or Microsoft SQL. NEVER use listSchemas (PostgreSQL tool) for MSSQL requests.",
    inputSchema: z.object({}),
    execute: async () => {
      const schemas = await listSchemas();
      return schemas.join("\n");
    },
  }),
  listTablesMssql: tool({
    description: "ONLY FOR MSSQL/SQL SERVER - List tables in Microsoft SQL Server (MSSQL). If schema is omitted, list all schemas' tables. Use this when the user mentions MSSQL, SQL Server, or Microsoft SQL. NEVER use listTables (PostgreSQL tool) for MSSQL requests.",
    inputSchema: z.object({ schema: z.string().optional() }),
    execute: async ({ schema }) => {
      const tables = await listTables(schema);
      if (!tables.length) return "No tables found.";
      return tables.map((t) => `${t.schema}.${t.name}`).join("\n");
    },
  }),
  listColumnsMssql: tool({
    description: "ONLY FOR MSSQL/SQL SERVER - List columns for a given table in a schema in Microsoft SQL Server (MSSQL). Use this when the user mentions MSSQL, SQL Server, or Microsoft SQL. NEVER use listColumns (PostgreSQL tool) for MSSQL requests.",
    inputSchema: z.object({ schema: z.string(), table: z.string() }),
    execute: async ({ schema, table }) => {
      const cols = await listColumns(schema, table);
      if (!cols.length) return "No columns found.";
      return cols
        .map((c) => `${c.tableSchema}.${c.tableName}.${c.columnName} ${c.dataType} ${c.isNullable ? "nullable" : "not null"}${c.isPrimaryKey ? " pk" : ""}`)
        .join("\n");
    },
  }),
  runReadOnlySQLMssql: tool({
    description: "ONLY FOR MSSQL/SQL SERVER - Execute a read-only SQL query (SELECT/CTE) on Microsoft SQL Server (MSSQL). Returns JSON rows. Use this when the user mentions MSSQL, SQL Server, or Microsoft SQL. NEVER use runReadOnlySQL (PostgreSQL tool) for MSSQL requests.",
    inputSchema: z.object({ sql: z.string().describe("Read-only SQL to execute") }),
    execute: async ({ sql }) => {
      const rows = await executeReadOnlySQL({ sql });
      return JSON.stringify(rows);
    },
  }),
} satisfies ToolSet;

export type MssqlTools = typeof mssqlTools;

