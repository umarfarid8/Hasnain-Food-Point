# Release Keystore Directory

> [!CAUTION]
> **CRITICAL SECURITY ASSET**: The `.jks` keystore file generated in this directory (or your private backup) is required to sign every future update of the Hasnain Food Point APK.
> - Never commit `.jks`, `.keystore`, or password files to version control (this directory is ignored by `.gitignore`).
> - Keep a secure offline backup of the generated keystore file and passwords.

### Quick Generation Command (PowerShell):
```powershell
keytool -genkeypair -v -keystore "keystore/hasnain-release-key.jks" -alias "hasnain-food-point" -keyalg RSA -keysize 2048 -validity 10000
```
