import { tool, type ToolSet } from "ai";
import { z } from "zod";
import { executeUnsafeSQL } from "./sql";

const confirmSchema = z.object({ confirm: z.literal(true).describe("You must set confirm=true to execute this write operation.") });

export const mssqlWriteTools = {
  createTableMssql: tool({
    description: "Create a table with provided DDL in MSSQL. Requires confirm=true.",
    inputSchema: confirmSchema.extend({ ddl: z.string().describe("CREATE TABLE ... statement") }),
    execute: async ({ ddl }) => {
      await executeUnsafeSQL({ sql: ddl });
      return "Table created.";
    },
  }),
  createIndexMssql: tool({
    description: "Create an index in MSSQL. Requires confirm=true.",
    inputSchema: confirmSchema.extend({ ddl: z.string().describe("CREATE INDEX ... statement") }),
    execute: async ({ ddl }) => {
      await executeUnsafeSQL({ sql: ddl });
      return "Index created.";
    },
  }),
  createViewMssql: tool({
    description: "Create a view in MSSQL. Requires confirm=true.",
    inputSchema: confirmSchema.extend({ ddl: z.string().describe("CREATE VIEW ... AS SELECT ...") }),
    execute: async ({ ddl }) => {
      await executeUnsafeSQL({ sql: ddl });
      return "View created.";
    },
  }),
  dropObjectMssql: tool({
    description: "Drop a table/index/view/schema object in MSSQL. Requires confirm=true.",
    inputSchema: confirmSchema.extend({ ddl: z.string().describe("DROP TABLE/INDEX/VIEW ...") }),
    execute: async ({ ddl }) => {
      await executeUnsafeSQL({ sql: ddl });
      return "Object dropped.";
    },
  }),
  insertRowsMssql: tool({
    description: "Insert rows via explicit INSERT statement in MSSQL. Requires confirm=true.",
    inputSchema: confirmSchema.extend({ sql: z.string().describe("INSERT INTO ... VALUES ...") }),
    execute: async ({ sql }) => {
      const rows = await executeUnsafeSQL({ sql });
      return JSON.stringify(rows);
    },
  }),
  updateRowsMssql: tool({
    description: "Update rows via explicit UPDATE statement in MSSQL. Requires confirm=true.",
    inputSchema: confirmSchema.extend({ sql: z.string().describe("UPDATE ... SET ... WHERE ...") }),
    execute: async ({ sql }) => {
      const rows = await executeUnsafeSQL({ sql });
      return JSON.stringify(rows);
    },
  }),
  deleteRowsMssql: tool({
    description: "Delete rows via explicit DELETE statement in MSSQL. Requires confirm=true.",
    inputSchema: confirmSchema.extend({ sql: z.string().describe("DELETE FROM ... WHERE ...") }),
    execute: async ({ sql }) => {
      const rows = await executeUnsafeSQL({ sql });
      return JSON.stringify(rows);
    },
  }),
} satisfies ToolSet;

export type MssqlWriteTools = typeof mssqlWriteTools;

