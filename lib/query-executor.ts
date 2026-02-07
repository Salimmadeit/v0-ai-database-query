'use client';

import type { QueryResult } from "./types";
import { validateQuery } from "./query-validator";

// Re-export validateQuery for backward compatibility
export { validateQuery };

const MAX_DISPLAY_ROWS = 1000;

let cachedDatabase: any = null;
let initPromise: Promise<any> | null = null;

async function initSqlJs() {
  if (typeof window === 'undefined') {
    throw new Error('Database queries must be executed in the browser');
  }

  // Load sql.js from CDN if not already loaded
  if (!(window as any).initSqlJs) {
    const script = document.createElement('script');
    script.src = 'https://sql.js.org/dist/sql-wasm.js';
    script.async = true;
    
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return (window as any).initSqlJs;
}

async function getDatabase() {
  if (cachedDatabase) {
    return cachedDatabase;
  }

  if (!initPromise) {
    initPromise = (async () => {
      const SQL = await initSqlJs();
      const initSqlJsFunc = SQL;
      const database = new SQL.Database();

      // Initialize schema and data
      database.run(`
        CREATE TABLE departments (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          budget REAL NOT NULL,
          location TEXT NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE TABLE employees (
          id INTEGER PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          department_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          salary REAL NOT NULL,
          hire_date TEXT NOT NULL,
          is_active INTEGER NOT NULL DEFAULT 1,
          FOREIGN KEY (department_id) REFERENCES departments(id)
        );

        CREATE TABLE customers (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT,
          city TEXT NOT NULL,
          country TEXT NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE TABLE products (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          price REAL NOT NULL,
          stock_quantity INTEGER NOT NULL,
          is_active INTEGER NOT NULL DEFAULT 1
        );

        CREATE TABLE orders (
          id INTEGER PRIMARY KEY,
          customer_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          total_amount REAL NOT NULL,
          status TEXT NOT NULL,
          order_date TEXT NOT NULL,
          FOREIGN KEY (customer_id) REFERENCES customers(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        );
      `);

      // Seed data
      const deptData = [
        [1, "Engineering", 2500000, "San Francisco", "2020-01-15"],
        [2, "Marketing", 1200000, "New York", "2020-02-01"],
        [3, "Sales", 1800000, "Chicago", "2020-01-20"],
        [4, "Product", 900000, "San Francisco", "2020-03-10"],
        [5, "Human Resources", 600000, "New York", "2020-01-15"],
        [6, "Finance", 750000, "Chicago", "2020-04-01"],
        [7, "Design", 850000, "San Francisco", "2020-05-15"],
        [8, "Customer Success", 500000, "Austin", "2021-01-10"],
      ];
      for (const d of deptData) {
        database.run("INSERT INTO departments VALUES (?, ?, ?, ?, ?)", d);
      }

      const empData = [
        [1, "Alice", "Johnson", "alice@company.com", 1, "Senior Engineer", 145000, "2020-03-15", 1],
        [2, "Bob", "Smith", "bob@company.com", 1, "Staff Engineer", 175000, "2019-06-01", 1],
        [3, "Carol", "Williams", "carol@company.com", 2, "Marketing Manager", 110000, "2020-07-20", 1],
        [4, "David", "Brown", "david@company.com", 3, "Sales Director", 135000, "2019-11-15", 1],
        [5, "Eva", "Davis", "eva@company.com", 4, "Product Manager", 130000, "2021-01-10", 1],
        [6, "Frank", "Miller", "frank@company.com", 1, "Junior Engineer", 95000, "2022-03-01", 1],
        [7, "Grace", "Wilson", "grace@company.com", 5, "HR Manager", 105000, "2020-08-15", 1],
        [8, "Henry", "Moore", "henry@company.com", 6, "Financial Analyst", 98000, "2021-05-20", 1],
        [9, "Iris", "Taylor", "iris@company.com", 2, "Content Strategist", 88000, "2021-09-01", 1],
        [10, "Jack", "Anderson", "jack@company.com", 3, "Account Executive", 105000, "2020-04-15", 1],
        [11, "Kate", "Thomas", "kate@company.com", 7, "Lead Designer", 125000, "2020-06-01", 1],
        [12, "Leo", "Jackson", "leo@company.com", 1, "DevOps Engineer", 135000, "2021-02-15", 1],
        [13, "Maria", "White", "maria@company.com", 8, "CS Manager", 100000, "2021-03-20", 1],
        [14, "Nathan", "Harris", "nathan@company.com", 3, "Sales Rep", 75000, "2022-07-01", 1],
        [15, "Olivia", "Clark", "olivia@company.com", 4, "Associate PM", 95000, "2022-01-15", 1],
        [16, "Peter", "Lewis", "peter@company.com", 1, "Engineer", 120000, "2021-08-01", 1],
        [17, "Quinn", "Robinson", "quinn@company.com", 2, "SEO Specialist", 82000, "2022-04-15", 1],
        [18, "Rachel", "Walker", "rachel@company.com", 6, "Accountant", 92000, "2021-11-01", 1],
        [19, "Sam", "Young", "sam@company.com", 7, "UI Designer", 105000, "2022-02-01", 1],
        [20, "Tina", "Allen", "tina@company.com", 8, "CS Representative", 68000, "2022-09-15", 0],
        [21, "Uma", "King", "uma@company.com", 1, "QA Engineer", 100000, "2021-06-01", 1],
        [22, "Victor", "Wright", "victor@company.com", 3, "Sales Manager", 120000, "2020-09-15", 1],
        [23, "Wendy", "Lopez", "wendy@company.com", 5, "Recruiter", 78000, "2022-05-01", 1],
        [24, "Xavier", "Hill", "xavier@company.com", 1, "Data Engineer", 140000, "2020-12-01", 1],
        [25, "Yara", "Scott", "yara@company.com", 4, "Product Analyst", 88000, "2023-01-15", 1],
      ];
      for (const e of empData) {
        database.run("INSERT INTO employees VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", e);
      }

      const custData = [
        [1, "Acme Corp", "contact@acme.com", "Acme Corporation", "New York", "USA", "2021-01-15"],
        [2, "Globex Inc", "info@globex.com", "Globex Industries", "London", "UK", "2021-02-20"],
        [3, "Initech LLC", "sales@initech.com", "Initech", "San Francisco", "USA", "2021-03-10"],
        [4, "Umbrella Co", "hello@umbrella.com", "Umbrella Corporation", "Tokyo", "Japan", "2021-04-05"],
        [5, "Stark Industries", "orders@stark.com", "Stark Industries", "Los Angeles", "USA", "2021-05-15"],
        [6, "Wayne Enterprises", "procurement@wayne.com", "Wayne Enterprises", "Chicago", "USA", "2021-06-20"],
        [7, "Oscorp", "supply@oscorp.com", "Oscorp Industries", "Berlin", "Germany", "2021-07-10"],
        [8, "Cyberdyne Systems", "info@cyberdyne.com", "Cyberdyne", "Austin", "USA", "2021-08-25"],
        [9, "Soylent Corp", "orders@soylent.com", "Soylent Corporation", "Toronto", "Canada", "2021-09-15"],
        [10, "Wonka Industries", "charlie@wonka.com", "Wonka Industries", "Paris", "France", "2021-10-01"],
        [11, "Dunder Mifflin", "michael@dunder.com", "Dunder Mifflin Inc", "Scranton", "USA", "2022-01-10"],
        [12, "Pied Piper", "richard@piedpiper.com", "Pied Piper Inc", "Palo Alto", "USA", "2022-02-15"],
      ];
      for (const c of custData) {
        database.run("INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?, ?)", c);
      }

      const prodData = [
        [1, "Enterprise Suite", "Software", 2999.99, 999, 1],
        [2, "Pro Dashboard", "Software", 499.99, 999, 1],
        [3, "Analytics Plus", "Software", 899.99, 999, 1],
        [4, "Cloud Storage 1TB", "Infrastructure", 199.99, 500, 1],
        [5, "API Gateway", "Infrastructure", 349.99, 400, 1],
        [6, "Security Shield", "Security", 599.99, 300, 1],
        [7, "Data Pipeline", "Data", 1299.99, 200, 1],
        [8, "ML Platform", "Data", 1999.99, 150, 1],
        [9, "Support Premium", "Services", 999.99, 999, 1],
        [10, "Training Package", "Services", 2499.99, 100, 1],
        [11, "Starter Kit", "Software", 99.99, 999, 1],
        [12, "Legacy Module", "Software", 149.99, 50, 0],
      ];
      for (const p of prodData) {
        database.run("INSERT INTO products VALUES (?, ?, ?, ?, ?, ?)", p);
      }

      const orderData = [
        [1, 1, 1, 2, 5999.98, "completed", "2023-01-15"],
        [2, 2, 3, 5, 4499.95, "completed", "2023-01-20"],
        [3, 3, 2, 10, 4999.90, "completed", "2023-02-05"],
        [4, 5, 7, 1, 1299.99, "completed", "2023-02-15"],
        [5, 1, 9, 3, 2999.97, "completed", "2023-03-01"],
        [6, 4, 6, 2, 1199.98, "completed", "2023-03-10"],
        [7, 6, 1, 1, 2999.99, "completed", "2023-03-20"],
        [8, 2, 8, 1, 1999.99, "completed", "2023-04-01"],
        [9, 7, 4, 5, 999.95, "completed", "2023-04-15"],
        [10, 8, 5, 3, 1049.97, "shipped", "2023-05-01"],
        [11, 3, 1, 1, 2999.99, "shipped", "2023-05-10"],
        [12, 9, 11, 20, 1999.80, "shipped", "2023-05-15"],
        [13, 10, 10, 1, 2499.99, "processing", "2023-06-01"],
        [14, 5, 3, 3, 2699.97, "processing", "2023-06-05"],
        [15, 11, 2, 5, 2499.95, "processing", "2023-06-10"],
        [16, 12, 7, 2, 2599.98, "pending", "2023-06-15"],
        [17, 1, 8, 1, 1999.99, "pending", "2023-06-20"],
        [18, 6, 6, 4, 2399.96, "completed", "2023-07-01"],
        [19, 4, 9, 2, 1999.98, "completed", "2023-07-15"],
        [20, 2, 1, 1, 2999.99, "completed", "2023-08-01"],
        [21, 8, 3, 2, 1799.98, "completed", "2023-08-15"],
        [22, 3, 5, 6, 2099.94, "completed", "2023-09-01"],
        [23, 5, 4, 10, 1999.90, "shipped", "2023-09-15"],
        [24, 7, 2, 3, 1499.97, "shipped", "2023-10-01"],
        [25, 11, 1, 1, 2999.99, "processing", "2023-10-15"],
        [26, 9, 6, 1, 599.99, "pending", "2023-10-20"],
        [27, 10, 8, 1, 1999.99, "completed", "2023-11-01"],
        [28, 12, 3, 4, 3599.96, "completed", "2023-11-15"],
        [29, 1, 7, 2, 2599.98, "completed", "2023-12-01"],
        [30, 6, 10, 1, 2499.99, "shipped", "2023-12-15"],
      ];
      for (const o of orderData) {
        database.run("INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?)", o);
      }

      return database;
    })();
  }

  return initPromise;
}

export async function executeQuery(sql: string): Promise<QueryResult> {
  const validation = validateQuery(sql);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const database = await getDatabase();
  const startTime = performance.now();

  try {
    const results = database.exec(sql);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    if (results.length === 0) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs,
      };
    }

    const result = results[0];
    const columns = result.columns;
    const rows = result.values.slice(0, MAX_DISPLAY_ROWS).map((row) => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });

    return {
      columns,
      rows,
      rowCount: result.values.length,
      executionTimeMs,
    };
  } catch (error) {
    throw new Error(
      `SQL Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
