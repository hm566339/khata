# Khata - Deployment Guide

This guide covers preparing and deploying the Khata application to production environments.

## Pre-Deployment Checklist

### Code Quality
- [ ] Run ESLint: `npm run lint`
- [ ] Run TypeScript check: `npm run type-check`
- [ ] Review all console.logs and remove debug statements
- [ ] Test all features manually
- [ ] Test on multiple Android devices
- [ ] Test on multiple iOS devices
- [ ] Test on low-end devices
- [ ] Verify database operations

### Performance
- [ ] Check bundle size
- [ ] Test app startup time
- [ ] Verify animations are smooth
- [ ] Test database query performance
- [ ] Verify memory usage
- [ ] Test with slow network (or offline)
- [ ] Test with large datasets

### Security
- [ ] Review database security
- [ ] Check for hardcoded credentials (should be none)
- [ ] Verify input validation
- [ ] Check error messages (no sensitive info)
- [ ] Review permissions in app.json
- [ ] Check WhatsApp linking implementation

### Testing
- [ ] Create and save invoice
- [ ] Record payments
- [ ] Update inventory
- [ ] Delete items
- [ ] Reset database
- [ ] Test all navigation
- [ ] Verify all calculations
- [ ] Test error handling

## Environment Configuration

### Version Management

Update version in `package.json`:
```json
{
  "version": "1.0.0"
}
```

Update version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.0"
  }
}
```

### Environment Variables

Create `.env` file (if needed):
```bash
# Database
REACT_APP_DB_NAME=khata.db

# API endpoints (for future)
REACT_APP_API_URL=https://api.example.com

# Feature flags
REACT_APP_ENABLE_CLOUD_SYNC=false
REACT_APP_ENABLE_ANALYTICS=true
```

### App Configuration

In `app.json`:
```json
{
  "expo": {
    "name": "खाता (Khata)",
    "slug": "khata-shopkeeper-app",
    "version": "1.0.0",
    "android": {
      "minSdkVersion": 21,
      "targetSdkVersion": 34,
      "package": "com.khata.shopkeeper"
    }
  }
}
```

## Build Process

### Android Build

#### Option 1: Using EAS (Recommended)

1. **Install EAS CLI**:
```bash
npm install -g eas-cli
```

2. **Login to Expo**:
```bash
eas login
```

3. **Initialize EAS**:
```bash
eas build:configure
```

4. **Create Preview Build** (for testing):
```bash
eas build --platform android --profile preview
```

5. **Create Production Build**:
```bash
eas build --platform android --profile production
```

6. **Download APK/AAB**:
- Preview: APK file (suitable for side-loading)
- Production: AAB file (for Play Store submission)

#### Option 2: Local Build

1. **Generate unsigned APK**:
```bash
expo run:android --release
```

2. **Sign APK**:
```bash
# Generate keystore (one-time)
keytool -genkey -v -keystore khata-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias khata-key

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore khata-key.keystore \
  app-release-unsigned.apk khata-key

# Align APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

### iOS Build

#### Using EAS

1. **Create Production Build**:
```bash
eas build --platform ios --profile production
```

2. **Submit to App Store**:
```bash
eas submit --platform ios
```

#### Local Build

1. **Generate IPA**:
```bash
expo run:ios --release
```

2. **Sign and submit** through Xcode or Application Loader

## Play Store Submission (Android)

### Preparation

1. **Create Google Play Account**:
   - Visit [Google Play Console](https://play.google.com/console)
   - Pay $25 registration fee
   - Accept agreements

2. **Create App**:
   - Click "Create app"
   - Fill app information
   - Set language to Hindi or English

3. **Fill Store Listing**:
   - App name: खाता (Khata)
   - Short description: Billing & Inventory for Shopkeepers
   - Full description: (See below)
   - Screenshots: Create 2-4 screenshots
   - Feature graphic: Create 1024x500px image
   - Icon: 512x512px PNG

### Store Listing Content

**Short Description (50 characters)**:
```
Simple billing app for shopkeepers
```

**Full Description (4000 characters)**:
```
खाता - आपके छोटे व्यापार के लिए सबसे सरल बिलिंग ऐप

मुख्य विशेषताएं:
• बिल बनाएं और सहेजें
• इन्वेंटरी प्रबंधन
• ग्राहक उधार ट्रैकिंग
• WhatsApp के माध्यम से याद दिलाना

Benefits:
- Offline support (no internet required)
- Fast and simple interface
- Hindi language support
- Works on low-end devices
- Free to use

Perfect for:
- Small shops
- Kirana stores
- General stores
- Small businesses
```

### Release Notes

Create release notes for each version:

```
Version 1.0.0 - Initial Release

Features:
✅ Complete billing system
✅ Inventory management
✅ Customer credit tracking
✅ WhatsApp integration
✅ Offline support
✅ Hindi interface

Bug Fixes:
- Database initialization improved
- Navigation improved

Performance:
- Optimized for low-end devices
- Fast app startup
```

### Submission

1. **Upload APK/AAB**:
   - Go to "Release" section
   - Create new release
   - Upload AAB file

2. **Review and Submit**:
   - Review all information
   - Accept content rating questionnaire
   - Set target audience
   - Submit for review

3. **Wait for Approval**:
   - Google reviews within 24-48 hours
   - Check email for updates

## App Store Submission (iOS)

### Preparation

1. **Create Apple Developer Account**:
   - Visit [Apple Developer](https://developer.apple.com)
   - Pay $99/year
   - Accept agreements

2. **Create App**:
   - Use [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app
   - Fill information

3. **Prepare Screenshots**:
   - 5.5-inch display: 1242x2208px (iPhone 6s Plus)
   - iPad Pro: 2048x2732px
   - Create screenshots for each language

### Submission Steps

1. **Upload IPA** through App Store Connect
2. **Add app information**:
   - App name
   - Subtitle
   - Description
   - Keywords
   - Support URL
3. **Set up pricing and distribution**
4. **Submit for review**
5. **Wait for Apple review** (typically 24-48 hours)

## Post-Deployment

### Monitoring

1. **Track Installations**:
   - Monitor Play Store/App Store metrics
   - Track active users
   - Check crash reports

2. **Handle Feedback**:
   - Respond to reviews
   - Address reported issues
   - Collect user feedback

3. **Monitor Performance**:
   - Check app crashes
   - Monitor performance metrics
   - Track user sessions

### Updates

1. **Bug Fixes**:
   - Create fixes
   - Test thoroughly
   - Build new version
   - Update version number
   - Submit to stores

2. **Feature Updates**:
   - Plan features
   - Implement changes
   - Test features
   - Create release notes
   - Submit to stores

3. **Version Numbering**:
   - Major.Minor.Patch format
   - 1.0.0 → 1.1.0 (minor features)
   - 1.0.0 → 1.0.1 (bug fixes)
   - 1.0.0 → 2.0.0 (major redesign)

## Distribution

### Direct Installation

For beta testing or direct distribution:

1. **Generate signed APK**:
```bash
eas build --platform android --profile preview
```

2. **Share APK**:
   - Email or file sharing service
   - Users can install directly
   - Enable unknown sources in Android settings

### Web Version

For web access:

```bash
npm run web
```

Deploy to:
- Vercel
- Netlify
- Firebase Hosting
- Your own server

## Troubleshooting

### Build Failures

**"react-native-reanimated plugin not found"**:
```bash
npm install react-native-reanimated
```

**"Module not found"**:
```bash
rm -rf node_modules
npm install
```

**"Gradle error"**:
```bash
# Clear gradle cache
rm -rf ~/.gradle/caches/
```

### Submission Issues

**"App rejected for permissions"**:
- Review permissions in app.json
- Only request necessary permissions
- Explain why each permission is needed

**"App rejected for content"**:
- Ensure no inappropriate content
- Follow store guidelines
- Use proper keywords
- Appropriate screenshots

## Security Checklist

- [ ] No hardcoded secrets
- [ ] Input validation implemented
- [ ] Database access secured
- [ ] Error messages are user-friendly
- [ ] No sensitive data in logs
- [ ] HTTPS for any API calls
- [ ] Proper permission handling
- [ ] Data privacy respected

## Performance Checklist

- [ ] App loads in < 2 seconds
- [ ] No janky animations
- [ ] Database queries optimized
- [ ] Bundle size < 50MB
- [ ] Memory usage reasonable
- [ ] Battery usage acceptable
- [ ] Network usage minimal

## Release Calendar

### Version 1.0.0 (Current)
- Release Date: April 2026
- Features: Core functionality
- Status: Stable

### Version 1.1.0 (Planned)
- PDF invoice generation
- Data export/import
- Enhanced analytics

### Version 2.0.0 (Future)
- Cloud synchronization
- Multi-user support
- Advanced features

## Support

For deployment issues:

1. Check build logs for errors
2. Review console output
3. Check official documentation
4. Search Stack Overflow
5. Post on GitHub issues

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [Google Play Console Help](https://support.google.com/googleplay)
- [Apple App Store Help](https://help.apple.com/app-store-connect)
- [React Native Docs](https://reactnative.dev)

---

**Last Updated**: April 2026
**Status**: Ready for Production
