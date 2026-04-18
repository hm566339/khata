# Khata Setup Guide

This guide will help you set up and run the Khata application on your development machine.

## Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher (comes with Node.js)
- **RAM**: Minimum 4GB for comfortable development
- **Storage**: At least 5GB free space

### For Android Development

- **Android Studio**: Latest version
- **Android SDK**: API Level 21 or higher
- **Android Emulator** or **Physical Device** with USB debugging enabled

### For iOS Development (macOS only)

- **Xcode**: Latest version
- **CocoaPods**: Latest version
- **iOS Simulator** or **Physical Device**

## Step-by-Step Installation

### 1. Install Node.js

Download and install from [nodejs.org](https://nodejs.org)

Verify installation:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### 2. Install Expo CLI

```bash
npm install -g expo-cli
```

Verify installation:
```bash
expo --version
```

### 3. Clone or Extract Project

```bash
cd path/to/khata
```

### 4. Install Dependencies

```bash
npm install
# or if using yarn
yarn install
```

This will install all required packages including:
- react-native
- expo
- react-navigation
- sqlite3
- typescript
- and all other dependencies listed in package.json

### 5. Verify Installation

```bash
npm run type-check
```

This should run without errors.

## Running the App

### Option 1: Start Development Server

```bash
npm start
```

This starts the Expo development server. You'll see a terminal interface with options to:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web
- Scan QR code with Expo Go app

### Option 2: Run on Android Emulator

```bash
npm run android
```

Requires Android Studio and an emulator running.

### Option 3: Run on iOS Simulator (macOS)

```bash
npm run ios
```

Requires Xcode and iOS simulator configured.

### Option 4: Run on Physical Device

1. **Install Expo Go** from Google Play Store or Apple App Store
2. **Start development server**: `npm start`
3. **Scan QR code** displayed in terminal with your phone
4. App opens in Expo Go app

## Troubleshooting

### "npm command not found"
- Reinstall Node.js
- Restart terminal/command prompt after installation

### "expo command not found"
```bash
npm install -g expo-cli
# Add to PATH if needed (Windows)
setx PATH "%PATH%;%AppData%\npm"
```

### Android Emulator won't start
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd <emulator_name>
```

### "Metro bundler error"
```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Database initialization error
- Ensure `src/database/init.ts` is present
- Check file permissions in project directory
- Try clearing node_modules and reinstalling

### Port already in use (typically port 8081)
```bash
# Kill process on port 8081
# On Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:8081 | xargs kill -9
```

## Development Workflow

### Hot Reload

The app supports hot reload. Make changes to files and save:
- Small changes reload instantly
- Database schema changes require full reload

### Debugging

1. **React Native Debugger**:
```bash
# Install
npm install -g react-native-debugger

# Run and open in Debugger
npm start
# Then select "d" for debugger
```

2. **Console Logs**:
```typescript
console.log('Debug info:', variable);
```

3. **Alert Debugging**:
```typescript
import { Alert } from 'react-native';
Alert.alert('Debug', JSON.stringify(data));
```

## Building for Production

### Web Build

```bash
npm run web
```

### Android APK

```bash
# Requires EAS account
eas build --platform android --profile preview
```

## Project Configuration

### app.json

Configure app settings:
- App name: `खाता (Khata)`
- Package name: `com.khata.shopkeeper`
- Version: `1.0.0`
- Permissions and features

### tsconfig.json

TypeScript configuration:
- Path aliases for imports
- Strict type checking
- ES2020 target

### babel.config.js

Babel configuration:
- Module resolution
- Plugin configuration
- Expo preset

## Performance Optimization

### For Low-End Devices

1. **Reduce Bundle Size**:
```bash
npm run type-check
```

2. **Optimize Images**:
- Use appropriate formats
- Compress before adding

3. **Monitor Performance**:
- Use React Profiler
- Check database query performance

### Database Performance

1. **Check Indexes**:
```sql
PRAGMA index_list(products);
```

2. **Analyze Queries**:
```sql
EXPLAIN QUERY PLAN SELECT ...
```

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [React Navigation Guide](https://reactnavigation.org)

## Getting Help

### Common Issues

1. **Can't connect to Expo server**:
   - Check internet connection
   - Restart development server
   - Check firewall settings

2. **Database locked error**:
   - Close all instances of app
   - Restart development server
   - Clear app cache

3. **Module not found**:
   - Clear node_modules: `rm -rf node_modules`
   - Reinstall: `npm install`
   - Check import paths

### Support

For additional help:
1. Check README.md in project root
2. Review console logs for error messages
3. Check .gitignore for which files are tracked
4. Review package.json for available scripts

## Next Steps

Once setup is complete:

1. **Explore the Codebase**:
   - Review `src/` directory structure
   - Read component comments
   - Understand database schema

2. **Try Features**:
   - Add test products
   - Create sample customers
   - Generate test invoices

3. **Customize for Your Use**:
   - Adjust colors in `src/constants.ts`
   - Add custom screens
   - Modify business logic

4. **Prepare for Deployment**:
   - Test on multiple devices
   - Verify all features work
   - Prepare for production build

Happy coding! 🚀
