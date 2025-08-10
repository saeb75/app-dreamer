# Apple Sign In Setup Guide

## Current Error

You're getting "The authorization attempt failed for an unknown reason" which typically indicates configuration issues.

## Required Setup Steps

### 1. Apple Developer Console Configuration

**You MUST complete these steps in your Apple Developer account:**

1. **Go to Apple Developer Console** (https://developer.apple.com/account/)
2. **Navigate to Certificates, Identifiers & Profiles**
3. **Select "Identifiers" and find your app ID** (`com.imtiyaz.fashion`)
4. **Edit the app ID and enable "Sign In with Apple"**
5. **Save the changes**

### 2. App Store Connect Configuration

1. **Go to App Store Connect** (https://appstoreconnect.apple.com/)
2. **Select your app**
3. **Go to App Information**
4. **Under "Sign In with Apple", ensure it's enabled**

### 3. Testing Requirements

**Apple Sign In only works on:**

- iOS 13+ devices
- macOS 10.15+ devices
- Physical devices (not simulators)
- Devices signed in with an Apple ID

### 4. Development vs Production

**For Development:**

- Use a development provisioning profile
- Test on a physical device
- Ensure your Apple Developer account has the correct capabilities

**For Production:**

- Use a distribution provisioning profile
- App must be submitted to App Store Connect
- Apple Sign In must be enabled in App Store Connect

### 5. Common Issues and Solutions

#### Issue: "The authorization attempt failed for an unknown reason"

**Solutions:**

1. Verify Apple Sign In is enabled in Apple Developer Console
2. Check that you're testing on a physical device (not simulator)
3. Ensure the device is signed in with an Apple ID
4. Verify your app's bundle identifier matches exactly
5. Check that your provisioning profile includes Apple Sign In capability

#### Issue: "Apple Sign In is not available"

**Solutions:**

1. Update to iOS 13+ or macOS 10.15+
2. Sign in with an Apple ID on the device
3. Check Apple Developer Console configuration

#### Issue: "Invalid response from Apple"

**Solutions:**

1. Rebuild the app after configuration changes
2. Clear app data and reinstall
3. Check network connectivity
4. Verify Apple's servers are accessible

### 6. Code Verification

The updated code now includes:

- ✅ Availability checking
- ✅ Proper error handling
- ✅ Specific error messages
- ✅ User-friendly alerts

### 7. Testing Checklist

Before testing, ensure:

- [ ] Apple Sign In enabled in Apple Developer Console
- [ ] Testing on physical device (iOS 13+)
- [ ] Device signed in with Apple ID
- [ ] App rebuilt after configuration changes
- [ ] Bundle identifier matches exactly
- [ ] Provisioning profile includes Apple Sign In

### 8. Next Steps

1. **Complete Apple Developer Console setup**
2. **Rebuild your app** with `expo prebuild` and `expo run:ios`
3. **Test on a physical device**
4. **Check console logs** for detailed error information

### 9. Debug Commands

```bash
# Rebuild the app
expo prebuild --clean
expo run:ios

# Check if Apple Auth is available
# The updated code will show this in the UI
```

### 10. Contact Apple Support

If issues persist after completing all steps:

1. Check Apple Developer Forums
2. Contact Apple Developer Support
3. Verify your Apple Developer account status

## Important Notes

- Apple Sign In **cannot be tested in simulators**
- The error you're seeing is often due to missing Apple Developer Console configuration
- Always test on physical devices with iOS 13+
- Ensure your Apple Developer account is active and in good standing
