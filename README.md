# खाता (Khata) - Shopkeeper's Billing & Inventory App

A production-ready, mobile-first billing, inventory, and credit (udhaar) tracking application for small shopkeepers in India, especially in rural and semi-urban markets.

## Features

### Core Functionality

- **Dashboard**: Quick metrics display (today's sales, total credit, low stock, customers)
- **Billing System**: Create and manage invoices with automatic calculations
- **Udhaar (Credit) Management**: Track customer credit with complete payment history
- **Inventory Management**: Add, edit, delete products with stock tracking
- **Customers**: Manage customer information with credit balances
- **WhatsApp Integration**: Send payment reminders and share invoices via WhatsApp

### Key Characteristics

- **Offline-First**: Works completely without internet using SQLite
- **Hindi-First UI**: All interfaces in Hindi with Hinglish support
- **Low-End Device Optimized**: Runs smoothly on devices with 2GB+ RAM
- **Production-Ready**: Clean, maintainable, scalable codebase
- **Fast**: App load time under 2 seconds

## Tech Stack

- **Framework**: React Native (Expo)
- **Database**: SQLite (expo-sqlite)
- **Navigation**: React Navigation with Bottom Tab Navigation
- **Animations**: React Native Reanimated
- **State Management**: Built-in React hooks
- **Language**: TypeScript

## Project Structure

```
khata/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── TextInput.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Loading.tsx
│   │   └── index.ts
│   ├── screens/            # Screen components
│   │   ├── DashboardScreen.tsx
│   │   ├── BillingScreen.tsx
│   │   ├── CustomersScreen.tsx
│   │   ├── CustomerDetailScreen.tsx
│   │   ├── InventoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── index.ts
│   ├── database/           # Database setup and queries
│   │   ├── init.ts         # Database initialization
│   │   ├── queries.ts      # All database operations
│   │   └── index.ts
│   ├── navigation/         # Navigation setup
│   │   └── RootNavigator.tsx
│   └── constants.ts        # Colors, labels, constants
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── tsconfig.json          # TypeScript config
└── .gitignore
```

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio or iOS development tools (for running on device)

### Setup

1. **Clone or navigate to the project directory**:
```bash
cd khata
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
```

3. **Start the development server**:
```bash
npm start
# or
yarn start
```

4. **Run on Android**:
```bash
npm run android
# or
expo run:android
```

5. **Run on iOS** (macOS only):
```bash
npm run ios
# or
expo run:ios
```

## Database Schema

### Tables

1. **products**: id, name, price, stock, category, created_at, updated_at
2. **customers**: id, name, phone, email, address, created_at, updated_at
3. **invoices**: id, invoice_number, customer_id, total_amount, discount_amount, final_amount, payment_status, invoice_date, notes, created_at
4. **invoice_items**: id, invoice_id, product_id, quantity, unit_price, total_price, created_at
5. **udhaar**: id, customer_id, invoice_id, amount, status, notes, due_date, created_at
6. **payments**: id, udhaar_id, amount, payment_method, payment_date, notes, created_at
7. **app_settings**: id, key, value, created_at, updated_at

### Features

- Foreign key constraints enabled
- Indexes on frequently queried columns for performance
- Automatic timestamps for all records

## UI/UX Highlights

### Navigation

- **Bottom Tab Navigation**: Five main sections
  - Dashboard
  - Billing
  - Customers
  - Inventory
  - Settings

### Design

- **Color Scheme**: Blue primary, green secondary, red for alerts
- **Typography**: Clear hierarchy with large, touch-friendly buttons
- **Cards**: Clean card-based layouts for readability
- **Status Indicators**: Visual badges for payment status and stock levels
- **Animations**: Smooth micro-interactions using Reanimated

### Accessibility

- Large buttons (minimum 44px touch targets)
- Clear labels in Hindi
- High contrast colors
- Simple, intuitive workflows

## Core Features Walkthrough

### Dashboard
- View today's sales total
- See total outstanding credit
- Check low stock items count
- Access quick action buttons

### Billing
1. Select customer (optional)
2. Choose products and quantities
3. System automatically calculates totals
4. Apply discount if needed
5. Save invoice to database
6. Automatic stock reduction
7. Create udhaar entry for credit customers

### Udhaar Management
1. View customer credit history
2. Record payments against outstanding amounts
3. Track payment status (pending/paid/partial)
4. Send WhatsApp payment reminders
5. Complete payment history visualization

### Inventory
1. Add new products with prices
2. Track stock quantities
3. Edit product information
4. Delete obsolete items
5. Visual alerts for low/out-of-stock items
6. Automatic stock updates on sales

### Customers
1. Add new customers with phone numbers
2. View customer credit balance
3. See complete transaction history
4. Send reminders via WhatsApp
5. Quick access to customer details

## Business Logic

- **Automatic Calculations**: Prices calculated from product master, quantities, and discounts
- **Stock Management**: Inventory automatically reduced on each sale
- **Credit Tracking**: All credit amounts aggregated per customer
- **Payment History**: Complete audit trail of all payments
- **Status Management**: Automatic status updates based on payment completeness

## Performance Optimizations

- SQLite indexes on frequently queried columns
- Lazy loading of customer credit data
- Efficient database queries with JOIN operations
- Optimized re-renders using React hooks
- Fast app startup through efficient initialization

## WhatsApp Integration

- Deep linking to WhatsApp using customer phone numbers
- Pre-filled messages for payment reminders
- Invoice sharing capability (future: PDF generation)
- Formatted message templates with amounts

## Future Enhancements

- PDF invoice generation and sharing
- Cloud synchronization (Firebase or custom backend)
- Advanced analytics and reporting
- App lock with PIN security
- Data backup and export
- Barcode/QR code scanning for products
- Multi-user support
- Expense tracking
- Customer ratings and notes

## Configuration

### Business Settings

Edit `src/constants.ts` to customize:

```typescript
export const BUSINESS = {
  defaultLowStockThreshold: 10,      // Stock alert threshold
  invoicePrefix: 'INV',               // Invoice number prefix
  defaultPaymentMethod: 'cash',       // Default payment method
  taxRate: 0,                        // Tax percentage
};
```

### Languages

Switch between Hindi and English in constants:

```typescript
export const DEFAULT_LANGUAGE = 'hi'; // 'hi' or 'en'
```

## Development

### Adding a New Screen

1. Create component in `src/screens/`
2. Add to `src/screens/index.ts`
3. Create navigation stack in `src/navigation/RootNavigator.tsx`
4. Update Tab Navigator with new screen

### Adding Database Tables

1. Add table creation SQL in `src/database/init.ts`
2. Create query functions in `src/database/queries.ts`
3. Export from `src/database/index.ts`

### Styling

All components use constants from `src/constants.ts`:
- Colors: `COLORS` object
- Sizes: `SIZES` object
- Labels: `LABELS_HI` (Hindi) or `LABELS_EN` (English)

## Building for Release

### Android

```bash
eas build --platform android --profile production
```

### iOS

```bash
eas build --platform ios --profile production
```

## Troubleshooting

### Database Not Initializing
- Check SQLite permissions in `app.json`
- Verify database path is writable
- Clear app cache and reinstall

### Navigation Issues
- Ensure `RootNavigator` is properly exported
- Check navigation prop passing in screens
- Verify screen names match navigation definitions

### Performance Issues
- Check database indexes
- Profile using React DevTools
- Consider lazy loading for large lists

## Contributing

When contributing:
1. Follow TypeScript best practices
2. Use constants for all hardcoded values
3. Add proper error handling
4. Test on low-end devices
5. Maintain Hindi-first interface design

## License

MIT License - Open for commercial and personal use

## Support

For issues, questions, or suggestions, please create an issue in the project repository.

## Disclaimer

This application is designed for small shopkeepers and is provided "as-is". Users are responsible for maintaining proper backups of their business data. The developers are not liable for any data loss or business disruptions.

---

**Made with ❤️ for small shopkeepers in rural India**

खाता - आपके व्यापार के लिए सबसे सरल बिलिंग ऐप
