import { SQLiteDatabase, openDatabaseAsync } from 'expo-sqlite';

const DATABASE_NAME = 'khata.db';
let db: SQLiteDatabase | null = null;

export async function initializeDatabase(): Promise<SQLiteDatabase> {
  try {
    db = await openDatabaseAsync(DATABASE_NAME);

    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables
    await db.execAsync(`
      -- Products table
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Customers table
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Invoices table
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number TEXT UNIQUE,
        customer_id INTEGER,
        total_amount REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        final_amount REAL NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );

      -- Invoice items table
      CREATE TABLE IF NOT EXISTS invoice_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      -- Udhaar (Credit) table
      CREATE TABLE IF NOT EXISTS udhaar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        invoice_id INTEGER,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        due_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (invoice_id) REFERENCES invoices(id)
      );

      -- Payments table
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        udhaar_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        payment_method TEXT DEFAULT 'cash',
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (udhaar_id) REFERENCES udhaar(id)
      );

      -- App settings table
      CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
      CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
      CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
      CREATE INDEX IF NOT EXISTS idx_invoice_items_product ON invoice_items(product_id);
      CREATE INDEX IF NOT EXISTS idx_udhaar_customer ON udhaar(customer_id);
      CREATE INDEX IF NOT EXISTS idx_udhaar_status ON udhaar(status);
      CREATE INDEX IF NOT EXISTS idx_payments_udhaar ON payments(udhaar_id);
      CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export function getDatabase(): SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

export async function resetDatabase(): Promise<void> {
  try {
    const database = getDatabase();
    await database.execAsync(`
      DROP TABLE IF EXISTS payments;
      DROP TABLE IF EXISTS udhaar;
      DROP TABLE IF EXISTS invoice_items;
      DROP TABLE IF EXISTS invoices;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS app_settings;
    `);
    await initializeDatabase();
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Failed to reset database:', error);
    throw error;
  }
}
