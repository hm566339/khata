import { getDatabase } from './init';

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_id?: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  payment_status: string;
  invoice_date: string;
  notes?: string;
  created_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name?: string;
  created_at: string;
}

export interface Udhaar {
  id: number;
  customer_id: number;
  invoice_id?: number;
  amount: number;
  status: string;
  notes?: string;
  due_date?: string;
  customer_name?: string;
  created_at: string;
}

export interface Payment {
  id: number;
  udhaar_id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  notes?: string;
  created_at: string;
}

// ==================== PRODUCTS ====================
export async function addProduct(
  name: string,
  price: number,
  stock: number,
  category?: string
): Promise<number> {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)',
    [name, price, stock, category || null]
  );
  return result.lastInsertRowId;
}

export async function getProducts(): Promise<Product[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<Product>(
    'SELECT * FROM products ORDER BY name ASC'
  );
  return result || [];
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = getDatabase();
  const result = await db.getFirstAsync<Product>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function updateProduct(
  id: number,
  name: string,
  price: number,
  stock: number,
  category?: string
): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE products SET name = ?, price = ?, stock = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, price, stock, category || null, id]
  );
}

export async function deleteProduct(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
}

export async function updateProductStock(id: number, quantity: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE products SET stock = stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [quantity, id]
  );
}

export async function getLowStockProducts(threshold: number = 10): Promise<Product[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<Product>(
    'SELECT * FROM products WHERE stock <= ? ORDER BY stock ASC',
    [threshold]
  );
  return result || [];
}

// ==================== CUSTOMERS ====================
export async function addCustomer(
  name: string,
  phone?: string,
  email?: string,
  address?: string
): Promise<number> {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
    [name, phone || null, email || null, address || null]
  );
  return result.lastInsertRowId;
}

export async function getCustomers(): Promise<Customer[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<Customer>(
    'SELECT * FROM customers ORDER BY name ASC'
  );
  return result || [];
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  const db = getDatabase();
  const result = await db.getFirstAsync<Customer>(
    'SELECT * FROM customers WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function updateCustomer(
  id: number,
  name: string,
  phone?: string,
  email?: string,
  address?: string
): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE customers SET name = ?, phone = ?, email = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, phone || null, email || null, address || null, id]
  );
}

export async function deleteCustomer(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM customers WHERE id = ?', [id]);
}

export async function searchCustomers(query: string): Promise<Customer[]> {
  const db = getDatabase();
  const searchQuery = `%${query}%`;
  const result = await db.getAllAsync<Customer>(
    'SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY name ASC',
    [searchQuery, searchQuery]
  );
  return result || [];
}

// ==================== INVOICES ====================
export async function addInvoice(
  customerId: number | null,
  totalAmount: number,
  discountAmount: number,
  finalAmount: number,
  paymentStatus: string = 'pending',
  notes?: string
): Promise<number> {
  const db = getDatabase();
  const invoiceNumber = `INV-${Date.now()}`;
  const result = await db.runAsync(
    `INSERT INTO invoices (invoice_number, customer_id, total_amount, discount_amount, final_amount, payment_status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [invoiceNumber, customerId || null, totalAmount, discountAmount, finalAmount, paymentStatus, notes || null]
  );
  return result.lastInsertRowId;
}

export async function getInvoices(): Promise<Invoice[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<Invoice>(
    'SELECT * FROM invoices ORDER BY invoice_date DESC'
  );
  return result || [];
}

export async function getInvoiceById(id: number): Promise<Invoice | null> {
  const db = getDatabase();
  const result = await db.getFirstAsync<Invoice>(
    'SELECT * FROM invoices WHERE id = ?',
    [id]
  );
  return result || null;
}

export async function getTodayInvoices(): Promise<Invoice[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<Invoice>(
    `SELECT * FROM invoices WHERE DATE(invoice_date) = DATE('now') ORDER BY invoice_date DESC`
  );
  return result || [];
}

export async function getTodaySalesTotal(): Promise<number> {
  const db = getDatabase();
  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT SUM(final_amount) as total FROM invoices WHERE DATE(invoice_date) = DATE('now')`
  );
  return result?.total || 0;
}

// ==================== INVOICE ITEMS ====================
export async function addInvoiceItem(
  invoiceId: number,
  productId: number,
  quantity: number,
  unitPrice: number
): Promise<number> {
  const db = getDatabase();
  const totalPrice = quantity * unitPrice;
  const result = await db.runAsync(
    'INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
    [invoiceId, productId, quantity, unitPrice, totalPrice]
  );
  return result.lastInsertRowId;
}

export async function getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<InvoiceItem>(
    `SELECT ii.*, p.name as product_name FROM invoice_items ii
     LEFT JOIN products p ON ii.product_id = p.id
     WHERE ii.invoice_id = ?`,
    [invoiceId]
  );
  return result || [];
}

// ==================== UDHAAR (CREDIT) ====================
export async function addUdhaar(
  customerId: number,
  amount: number,
  invoiceId?: number,
  notes?: string,
  dueDate?: string
): Promise<number> {
  const db = getDatabase();
  const result = await db.runAsync(
    `INSERT INTO udhaar (customer_id, invoice_id, amount, notes, due_date)
     VALUES (?, ?, ?, ?, ?)`,
    [customerId, invoiceId || null, amount, notes || null, dueDate || null]
  );
  return result.lastInsertRowId;
}

export async function getUdhaarByCustomer(customerId: number): Promise<Udhaar[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<Udhaar>(
    `SELECT u.*, c.name as customer_name FROM udhaar u
     LEFT JOIN customers c ON u.customer_id = c.id
     WHERE u.customer_id = ? ORDER BY u.created_at DESC`,
    [customerId]
  );
  return result || [];
}

export async function getPendingUdhaar(): Promise<Udhaar[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<Udhaar>(
    `SELECT u.*, c.name as customer_name FROM udhaar u
     LEFT JOIN customers c ON u.customer_id = c.id
     WHERE u.status = 'pending' ORDER BY u.created_at DESC`
  );
  return result || [];
}

export async function getTotalUdhaarByCustomer(customerId: number): Promise<number> {
  const db = getDatabase();
  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT SUM(CASE WHEN p.id IS NULL THEN u.amount ELSE u.amount - COALESCE(SUM(p.amount), 0) END) as total
     FROM udhaar u
     LEFT JOIN payments p ON u.id = p.udhaar_id
     WHERE u.customer_id = ? AND u.status = 'pending'
     GROUP BY u.customer_id`,
    [customerId]
  );
  return result?.total || 0;
}

export async function getTotalOutstandingUdhaar(): Promise<number> {
  const db = getDatabase();
  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT SUM(u.amount) - COALESCE(SUM(p.amount), 0) as total
     FROM udhaar u
     LEFT JOIN payments p ON u.id = p.udhaar_id
     WHERE u.status = 'pending'`
  );
  return result?.total || 0;
}

export async function updateUdhaarStatus(id: number, status: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE udhaar SET status = ? WHERE id = ?',
    [status, id]
  );
}

// ==================== PAYMENTS ====================
export async function addPayment(
  udhaarId: number,
  amount: number,
  paymentMethod: string = 'cash',
  notes?: string
): Promise<number> {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO payments (udhaar_id, amount, payment_method, notes) VALUES (?, ?, ?, ?)',
    [udhaarId, amount, paymentMethod, notes || null]
  );
  return result.lastInsertRowId;
}

export async function getPaymentsByUdhaar(udhaarId: number): Promise<Payment[]> {
  const db = getDatabase();
  const result = await db.getAllAsync<Payment>(
    'SELECT * FROM payments WHERE udhaar_id = ? ORDER BY payment_date DESC',
    [udhaarId]
  );
  return result || [];
}

export async function getTotalPaymentByUdhaar(udhaarId: number): Promise<number> {
  const db = getDatabase();
  const result = await db.getFirstAsync<{ total: number }>(
    'SELECT SUM(amount) as total FROM payments WHERE udhaar_id = ?',
    [udhaarId]
  );
  return result?.total || 0;
}

// ==================== DASHBOARD STATS ====================
export async function getDashboardStats(): Promise<{
  todaySales: number;
  totalUdhaar: number;
  lowStockCount: number;
  totalCustomers: number;
}> {
  const todaySales = await getTodaySalesTotal();
  const totalUdhaar = await getTotalOutstandingUdhaar();
  const lowStockProducts = await getLowStockProducts();
  const customers = await getCustomers();

  return {
    todaySales,
    totalUdhaar,
    lowStockCount: lowStockProducts.length,
    totalCustomers: customers.length,
  };
}
