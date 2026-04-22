# API Documentation

## Database Queries

All database queries are available in `src/database/queries.ts`

### Products

```typescript
// Add a new product
addProduct(name: string, price: number, stock: number, category?: string): Promise<number>

// Get all products
getProducts(): Promise<Product[]>

// Get product by ID
getProductById(id: number): Promise<Product | null>

// Update product
updateProduct(id: number, name: string, price: number, stock: number, category?: string): Promise<void>

// Delete product
deleteProduct(id: number): Promise<void>

// Update product stock (can be negative for deductions)
updateProductStock(id: number, quantity: number): Promise<void>

// Get low stock products
getLowStockProducts(threshold?: number): Promise<Product[]>
```

### Customers

```typescript
// Add new customer
addCustomer(name: string, phone?: string, email?: string, address?: string): Promise<number>

// Get all customers
getCustomers(): Promise<Customer[]>

// Get customer by ID
getCustomerById(id: number): Promise<Customer | null>

// Update customer
updateCustomer(id: number, name: string, phone?: string, email?: string, address?: string): Promise<void>

// Delete customer
deleteCustomer(id: number): Promise<void>

// Search customers by name or phone
searchCustomers(query: string): Promise<Customer[]>
```

### Invoices

```typescript
// Create invoice
addInvoice(
  customerId: number | null,
  totalAmount: number,
  discountAmount: number,
  finalAmount: number,
  paymentStatus?: string,
  notes?: string
): Promise<number>

// Get all invoices
getInvoices(): Promise<Invoice[]>

// Get invoice by ID
getInvoiceById(id: number): Promise<Invoice | null>

// Get today's invoices
getTodayInvoices(): Promise<Invoice[]>

// Get today's total sales
getTodaySalesTotal(): Promise<number>
```

### Invoice Items

```typescript
// Add item to invoice
addInvoiceItem(
  invoiceId: number,
  productId: number,
  quantity: number,
  unitPrice: number
): Promise<number>

// Get items from invoice
getInvoiceItems(invoiceId: number): Promise<InvoiceItem[]>
```

### Udhaar (Credit)

```typescript
// Add credit entry
addUdhaar(
  customerId: number,
  amount: number,
  invoiceId?: number,
  notes?: string,
  dueDate?: string
): Promise<number>

// Get udhaar entries for customer
getUdhaarByCustomer(customerId: number): Promise<Udhaar[]>

// Get all pending udhaar
getPendingUdhaar(): Promise<Udhaar[]>

// Get total outstanding udhaar for customer
getTotalUdhaarByCustomer(customerId: number): Promise<number>

// Get total outstanding udhaar for all customers
getTotalOutstandingUdhaar(): Promise<number>

// Update udhaar status
updateUdhaarStatus(id: number, status: string): Promise<void>
```

### Payments

```typescript
// Record payment
addPayment(
  udhaarId: number,
  amount: number,
  paymentMethod?: string,
  notes?: string
): Promise<number>

// Get payments for udhaar entry
getPaymentsByUdhaar(udhaarId: number): Promise<Payment[]>

// Get total payments for udhaar entry
getTotalPaymentByUdhaar(udhaarId: number): Promise<number>
```

### Dashboard

```typescript
// Get dashboard statistics
getDashboardStats(): Promise<{
  todaySales: number;
  totalUdhaar: number;
  lowStockCount: number;
  totalCustomers: number;
}>
```

## Components API

### Button

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

<Button
  title="Save"
  onPress={() => handleSave()}
  variant="primary"
  size="large"
/>
```

### TextInput

```typescript
interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'phone-pad' | 'email-address';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  disabled?: boolean;
}

<TextInput
  label="Product Name"
  placeholder="Enter name"
  value={name}
  onChangeText={setName}
  error={errors.name}
/>
```

### Card

```typescript
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline';
  onPress?: () => void;
}

<Card variant="elevated">
  <Text>Card content</Text>
</Card>
```

### Header

```typescript
interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

<Header
  title="Screen Title"
  subtitle="Subtitle"
  rightElement={<Button title="+" />}
/>
```

### StatusBadge

```typescript
interface StatusBadgeProps {
  status: 'pending' | 'paid' | 'cancelled' | 'partial';
  label?: string;
}

<StatusBadge status="pending" label="लंबित" />
```

### CurrencyDisplay

```typescript
interface CurrencyDisplayProps {
  amount: number;
  size?: 'small' | 'medium' | 'large';
}

<CurrencyDisplay amount={1000} size="large" />
```

### Dropdown

```typescript
interface DropdownOption {
  label: string;
  value: any;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: any;
  onSelect: (value: any) => void;
  placeholder?: string;
  error?: string;
  style?: ViewStyle;
}

<Dropdown
  label="Select Product"
  options={productOptions}
  value={selectedProduct}
  onSelect={setSelectedProduct}
/>
```

### Loading

```typescript
interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

<Loading size="large" />
```

## Utility Functions

### Date Utils

```typescript
// Format date to Hindi format (dd/MM/yyyy)
formatDate(dateString: string): string

// Format datetime (dd/MM/yyyy HH:mm)
formatDateTime(dateString: string): string

// Format time (HH:mm)
formatTime(dateString: string): string

// Get relative time (e.g., "2 days ago" in Hindi)
getRelativeTime(dateString: string): string

// Format currency with ₹
formatCurrency(amount: number, decimals?: number): string

// Format percentage
formatPercentage(value: number, decimals?: number): string

// Check if date is today
isToday(dateString: string): boolean

// Get day of week in Hindi
getDayOfWeek(dateString: string): string
```

### Validation

```typescript
// Validate email format
validateEmail(email: string): boolean

// Validate Indian phone number
validatePhoneNumber(phone: string): boolean

// Validate amount
validateAmount(amount: string): boolean

// Validate product name
validateProductName(name: string): boolean

// Validate customer name
validateCustomerName(name: string): boolean

// Validate quantity
validateQuantity(quantity: string): boolean

// Validate price
validatePrice(price: string): boolean

// Validate stock
validateStock(stock: string): boolean

// Get error message
getValidationError(field: string, type: string): string
```

## Custom Hooks

### useForm

```typescript
interface UseFormOptions<T> {
  initialValues: T;
  onSubmit?: (values: T) => void;
}

const {
  values,           // Current form values
  errors,           // Field errors
  touched,          // Touched fields
  isSubmitting,     // Submission state
  handleChange,     // Change handler factory
  handleBlur,       // Blur handler factory
  handleSubmit,     // Form submission handler
  resetForm,        // Reset to initial values
  setFieldError,    // Set error for field
  setFieldValue,    // Set value for field
  setValues         // Set all values
} = useForm({
  initialValues: { name: '', price: '' },
  onSubmit: async (values) => { ... }
});
```

## Types

All TypeScript types are defined in `src/database/queries.ts`:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

interface Invoice {
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

interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name?: string;
  created_at: string;
}

interface Udhaar {
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

interface Payment {
  id: number;
  udhaar_id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  notes?: string;
  created_at: string;
}
```

## Constants

Access all constants from `src/constants.ts`:

```typescript
// Colors
COLORS.primary, COLORS.secondary, COLORS.error, etc.

// Labels (Hindi)
LABELS_HI.dashboard, LABELS_HI.billing, etc.

// Labels (English)
LABELS_EN.dashboard, LABELS_EN.billing, etc.

// Currency
CURRENCY // '₹'

// Sizes and spacing
SIZES.md, SIZES.lg, SIZES.borderRadiusMd, etc.

// Business constants
BUSINESS.defaultLowStockThreshold // Default: 10
```

## Screen Props

All screens receive navigation props:

```typescript
interface ScreenProps {
  route?: any;
  navigation?: any;
}

// In component:
const MyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // Navigate to another screen
  navigation.navigate('ScreenName');
  navigation.navigate('ScreenName', { param: 'value' });
}
```

## Examples

### Using Database Queries

```typescript
import * as db from '@database/queries';

// Add product
const productId = await db.addProduct('Milk', 40, 100, 'Dairy');

// Get all products
const products = await db.getProducts();

// Update stock after sale
await db.updateProductStock(productId, -5);
```

### Using Components

```typescript
import { Button, Card, TextInput, Header } from '@components';

export const MyScreen = () => {
  const [name, setName] = useState('');

  return (
    <>
      <Header title="My Screen" />
      <Card>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
        />
        <Button
          title="Save"
          onPress={() => handleSave()}
        />
      </Card>
    </>
  );
};
```

### Using Utilities

```typescript
import { formatCurrency, formatDate, validatePhoneNumber } from '@utils';

const amount = 1500;
const formattedAmount = formatCurrency(amount); // '₹ 1500.00'

const date = '2024-01-15T10:30:00';
const formattedDate = formatDate(date); // '15/01/2024'

const valid = validatePhoneNumber('9876543210'); // true
```

## Best Practices

1. **Always use TypeScript types**
2. **Import from barrel files** (index.ts)
3. **Use constants** for hardcoded values
4. **Handle errors** with try-catch
5. **Test on low-end devices**
6. **Use consistent naming** conventions
7. **Add comments** for complex logic
8. **Keep components small** and focused
9. **Reuse components** instead of duplicating
10. **Follow existing code style**
