// Colors
export const COLORS = {
  // Primary
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',

  // Secondary
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',

  // Alerts
  error: '#EF4444',
  errorLight: '#FCA5A5',
  errorDark: '#DC2626',

  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',

  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#047857',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Status
  pending: '#F59E0B',
  paid: '#10B981',
  cancelled: '#EF4444',

  // Background
  background: '#F9FAFB',
  backgroundDark: '#111827',

  // Text
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',
};

// Hindi Translations
export const LABELS_HI = {
  // Main Navigation
  dashboard: 'डैशबोर्ड',
  billing: 'बिलिंग',
  customers: 'ग्राहक',
  inventory: 'इन्वेंटरी',
  settings: 'सेटिंग्स',

  // Dashboard
  todaysSales: "आज की बिक्री",
  totalCredit: 'कुल उधार',
  lowStockItems: 'कम स्टॉक आइटम',
  totalCustomers: 'कुल ग्राहक',
  quickActions: 'त्वरित कार्य',
  newBill: 'नया बिल',
  addCredit: 'उधार जोड़ें',
  addCustomer: 'ग्राहक जोड़ें',

  // Billing
  createBill: 'बिल बनाएँ',
  selectProduct: 'उत्पाद चुनें',
  quantity: 'मात्रा',
  price: 'कीमत',
  subtotal: 'कुल',
  discount: 'छूट',
  total: 'कुल राशि',
  addItem: 'आइटम जोड़ें',
  saveBill: 'बिल सहेजें',
  generatePDF: 'PDF बनाएँ',
  shareWhatsApp: 'WhatsApp पर शेयर करें',
  selectCustomer: 'ग्राहक चुनें (वैकल्पिक)',

  // Customers
  customerName: 'ग्राहक का नाम',
  phone: 'फोन नंबर',
  email: 'ईमेल',
  address: 'पता',
  addNewCustomer: 'नया ग्राहक जोड़ें',
  editCustomer: 'ग्राहक संपादित करें',
  deleteCustomer: 'ग्राहक हटाएँ',

  // Udhaar (Credit)
  udhaar: 'उधार',
  creditHistory: 'उधार का इतिहास',
  outstandingAmount: 'बकाया राशि',
  addUdhaar: 'उधार जोड़ें',
  recordPayment: 'भुगतान दर्ज करें',
  paymentStatus: 'भुगतान स्थिति',
  pending: 'लंबित',
  paid: 'चुकाया गया',
  partialPayment: 'आंशिक भुगतान',
  dueDate: 'देय तारीख',
  paymentHistory: 'भुगतान इतिहास',

  // Inventory
  productName: 'उत्पाद का नाम',
  stock: 'स्टॉक',
  addProduct: 'उत्पाद जोड़ें',
  editProduct: 'उत्पाद संपादित करें',
  deleteProduct: 'उत्पाद हटाएँ',
  category: 'श्रेणी',
  stockAlert: 'स्टॉक अलर्ट',
  outOfStock: 'स्टॉक खत्म',
  lowStock: 'कम स्टॉक',

  // Common
  save: 'सहेजें',
  cancel: 'रद्द करें',
  delete: 'हटाएँ',
  edit: 'संपादित करें',
  add: 'जोड़ें',
  back: 'वापस',
  search: 'खोज',
  filter: 'फिल्टर',
  noData: 'कोई डेटा नहीं',
  success: 'सफल',
  error: 'त्रुटि',
  loading: 'लोड हो रहा है...',
  date: 'तारीख',
  time: 'समय',
  amount: 'राशि',
  status: 'स्थिति',
  notes: 'नोट्स',
  invoiceNumber: 'इनवॉइस नंबर',
  invoiceDate: 'इनवॉइस डेट',

  // WhatsApp
  sendReminder: 'याद दिलाना भेजें',
  paymentReminder: 'भुगतान याद दिलाना',
  invoiceMessage: 'इनवॉइस संदेश',

  // Settings
  appSettings: 'ऐप सेटिंग्स',
  lowStockThreshold: 'कम स्टॉक सीमा',
  currency: 'मुद्रा',
  backupData: 'डेटा बैकअप',
  exportData: 'डेटा निर्यात करें',
  importData: 'डेटा आयात करें',
  aboutApp: 'ऐप के बारे में',
};

// English Translations (Fallback)
export const LABELS_EN = {
  // Main Navigation
  dashboard: 'Dashboard',
  billing: 'Billing',
  customers: 'Customers',
  inventory: 'Inventory',
  settings: 'Settings',

  // Dashboard
  todaysSales: "Today's Sales",
  totalCredit: 'Total Credit',
  lowStockItems: 'Low Stock Items',
  totalCustomers: 'Total Customers',
  quickActions: 'Quick Actions',
  newBill: 'New Bill',
  addCredit: 'Add Credit',
  addCustomer: 'Add Customer',

  // Billing
  createBill: 'Create Bill',
  selectProduct: 'Select Product',
  quantity: 'Quantity',
  price: 'Price',
  subtotal: 'Subtotal',
  discount: 'Discount',
  total: 'Total',
  addItem: 'Add Item',
  saveBill: 'Save Bill',
  generatePDF: 'Generate PDF',
  shareWhatsApp: 'Share on WhatsApp',
  selectCustomer: 'Select Customer (Optional)',

  // Customers
  customerName: 'Customer Name',
  phone: 'Phone Number',
  email: 'Email',
  address: 'Address',
  addNewCustomer: 'Add New Customer',
  editCustomer: 'Edit Customer',
  deleteCustomer: 'Delete Customer',

  // Udhaar (Credit)
  udhaar: 'Credit',
  creditHistory: 'Credit History',
  outstandingAmount: 'Outstanding Amount',
  addUdhaar: 'Add Credit',
  recordPayment: 'Record Payment',
  paymentStatus: 'Payment Status',
  pending: 'Pending',
  paid: 'Paid',
  partialPayment: 'Partial Payment',
  dueDate: 'Due Date',
  paymentHistory: 'Payment History',

  // Inventory
  productName: 'Product Name',
  stock: 'Stock',
  addProduct: 'Add Product',
  editProduct: 'Edit Product',
  deleteProduct: 'Delete Product',
  category: 'Category',
  stockAlert: 'Stock Alert',
  outOfStock: 'Out of Stock',
  lowStock: 'Low Stock',

  // Common
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  back: 'Back',
  search: 'Search',
  filter: 'Filter',
  noData: 'No Data',
  success: 'Success',
  error: 'Error',
  loading: 'Loading...',
  date: 'Date',
  time: 'Time',
  amount: 'Amount',
  status: 'Status',
  notes: 'Notes',
  invoiceNumber: 'Invoice Number',
  invoiceDate: 'Invoice Date',

  // WhatsApp
  sendReminder: 'Send Reminder',
  paymentReminder: 'Payment Reminder',
  invoiceMessage: 'Invoice Message',

  // Settings
  appSettings: 'App Settings',
  lowStockThreshold: 'Low Stock Threshold',
  currency: 'Currency',
  backupData: 'Backup Data',
  exportData: 'Export Data',
  importData: 'Import Data',
  aboutApp: 'About App',
};

// Default language (can be changed in settings)
export const DEFAULT_LANGUAGE = 'hi'; // 'hi' or 'en'

// Currency formatting
export const CURRENCY = '₹';

// Formatting options
export const FORMAT = {
  dateFormat: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
};

// Business constants
export const BUSINESS = {
  defaultLowStockThreshold: 10,
  invoicePrefix: 'INV',
  defaultPaymentMethod: 'cash',
  taxRate: 0, // In percentage
};

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Sizes
export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Border radius
  borderRadiusSm: 4,
  borderRadiusMd: 8,
  borderRadiusLg: 12,
  borderRadiusXl: 16,
  borderRadiusRound: 999,

  // Font sizes
  fontSizeXs: 12,
  fontSizeSm: 14,
  fontSizeMd: 16,
  fontSizeLg: 18,
  fontSizeXl: 20,
  fontSizeXxl: 24,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
};

// Shadow
export const SHADOWS = {
  light: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  medium: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  dark: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
};
