// Demo in-memory database with sample data for the query interface
// Uses sql.js (SQLite compiled to WebAssembly) in browser
// Uses a static schema that works on server

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export interface SchemaColumn {
  name: string;
  type: string;
  notnull: boolean;
  pk: boolean;
}

export interface ForeignKey {
  table: string;
  from: string;
  toTable: string;
  to: string;
}

const STATIC_SCHEMA: { tables: SchemaTable[]; foreignKeys: ForeignKey[] } = {
  tables: [
    {
      name: "departments",
      columns: [
        { name: "id", type: "INTEGER", notnull: true, pk: true },
        { name: "name", type: "TEXT", notnull: true, pk: false },
        { name: "budget", type: "REAL", notnull: true, pk: false },
        { name: "location", type: "TEXT", notnull: true, pk: false },
        { name: "created_at", type: "TEXT", notnull: true, pk: false },
      ],
    },
    {
      name: "employees",
      columns: [
        { name: "id", type: "INTEGER", notnull: true, pk: true },
        { name: "first_name", type: "TEXT", notnull: true, pk: false },
        { name: "last_name", type: "TEXT", notnull: true, pk: false },
        { name: "email", type: "TEXT", notnull: true, pk: false },
        { name: "department_id", type: "INTEGER", notnull: true, pk: false },
        { name: "title", type: "TEXT", notnull: true, pk: false },
        { name: "salary", type: "REAL", notnull: true, pk: false },
        { name: "hire_date", type: "TEXT", notnull: true, pk: false },
        { name: "is_active", type: "INTEGER", notnull: true, pk: false },
      ],
    },
    {
      name: "customers",
      columns: [
        { name: "id", type: "INTEGER", notnull: true, pk: true },
        { name: "name", type: "TEXT", notnull: true, pk: false },
        { name: "email", type: "TEXT", notnull: true, pk: false },
        { name: "company", type: "TEXT", notnull: false, pk: false },
        { name: "city", type: "TEXT", notnull: true, pk: false },
        { name: "country", type: "TEXT", notnull: true, pk: false },
        { name: "created_at", type: "TEXT", notnull: true, pk: false },
      ],
    },
    {
      name: "products",
      columns: [
        { name: "id", type: "INTEGER", notnull: true, pk: true },
        { name: "name", type: "TEXT", notnull: true, pk: false },
        { name: "category", type: "TEXT", notnull: true, pk: false },
        { name: "price", type: "REAL", notnull: true, pk: false },
        { name: "stock_quantity", type: "INTEGER", notnull: true, pk: false },
        { name: "is_active", type: "INTEGER", notnull: true, pk: false },
      ],
    },
    {
      name: "orders",
      columns: [
        { name: "id", type: "INTEGER", notnull: true, pk: true },
        { name: "customer_id", type: "INTEGER", notnull: true, pk: false },
        { name: "product_id", type: "INTEGER", notnull: true, pk: false },
        { name: "quantity", type: "INTEGER", notnull: true, pk: false },
        { name: "total_amount", type: "REAL", notnull: true, pk: false },
        { name: "status", type: "TEXT", notnull: true, pk: false },
        { name: "order_date", type: "TEXT", notnull: true, pk: false },
      ],
    },
  ],
  foreignKeys: [
    { table: "employees", from: "department_id", toTable: "departments", to: "id" },
    { table: "orders", from: "customer_id", toTable: "customers", to: "id" },
    { table: "orders", from: "product_id", toTable: "products", to: "id" },
  ],
};

export async function getSchema(): Promise<{
  tables: SchemaTable[];
  foreignKeys: ForeignKey[];
}> {
  // Return static schema - sql.js initialization happens only in browser via QueryExecutor
  return STATIC_SCHEMA;
}

export function getSchemaDescription(): string {
  return `Database Schema:

Table: departments
  - id (INTEGER, PRIMARY KEY)
  - name (TEXT, NOT NULL) - Department name
  - budget (REAL, NOT NULL) - Annual budget in USD
  - location (TEXT, NOT NULL) - Office location
  - created_at (TEXT, NOT NULL) - Date created

Table: employees
  - id (INTEGER, PRIMARY KEY)
  - first_name (TEXT, NOT NULL)
  - last_name (TEXT, NOT NULL)
  - email (TEXT, NOT NULL)
  - department_id (INTEGER, NOT NULL, FK -> departments.id)
  - title (TEXT, NOT NULL) - Job title
  - salary (REAL, NOT NULL) - Annual salary in USD
  - hire_date (TEXT, NOT NULL) - Date hired
  - is_active (INTEGER, NOT NULL) - 1 = active, 0 = inactive

Table: customers
  - id (INTEGER, PRIMARY KEY)
  - name (TEXT, NOT NULL) - Customer/company name
  - email (TEXT, NOT NULL)
  - company (TEXT) - Company name
  - city (TEXT, NOT NULL)
  - country (TEXT, NOT NULL)
  - created_at (TEXT, NOT NULL)

Table: products
  - id (INTEGER, PRIMARY KEY)
  - name (TEXT, NOT NULL) - Product name
  - category (TEXT, NOT NULL) - Product category (Software, Infrastructure, Security, Data, Services)
  - price (REAL, NOT NULL) - Unit price in USD
  - stock_quantity (INTEGER, NOT NULL)
  - is_active (INTEGER, NOT NULL) - 1 = active, 0 = discontinued

Table: orders
  - id (INTEGER, PRIMARY KEY)
  - customer_id (INTEGER, NOT NULL, FK -> customers.id)
  - product_id (INTEGER, NOT NULL, FK -> products.id)
  - quantity (INTEGER, NOT NULL)
  - total_amount (REAL, NOT NULL) - Total order value in USD
  - status (TEXT, NOT NULL) - Order status (pending, processing, shipped, completed)
  - order_date (TEXT, NOT NULL) - Date of order

Foreign Key Relationships:
  - employees.department_id -> departments.id
  - orders.customer_id -> customers.id
  - orders.product_id -> products.id`;
}
