# FlashCard App - React Native với Expo

Đây là ứng dụng Flash Card được xây dựng bằng React Native và Expo Framework.

## 🚀 Bắt đầu nhanh

### Yêu cầu hệ thống
- Node.js (phiên bản 20.19.4 trở lên được khuyến nghị)
- npm hoặc yarn
- Expo CLI
- EAS CLI (để build production)

### Cài đặt

1. **Clone dự án và cài đặt dependencies:**
   ```bash
   cd FlashCardApp
   npm install
   ```

2. **Cài đặt Expo CLI và EAS CLI:**
   ```bash
   npm install -g @expo/cli
   npm install -g eas-cli
   ```

3. **Khởi động development server:**
   ```bash
   npm start
   # hoặc
   npx expo start
   ```

## 📱 Chạy trên thiết bị

### Development (Expo Go)
1. Cài đặt Expo Go từ App Store (iOS) hoặc Google Play (Android)
2. Quét QR code từ terminal hoặc browser
3. App sẽ tự động reload khi bạn thay đổi code

### Chạy trên Simulator/Emulator
```bash
# iOS Simulator (chỉ macOS)
npm run ios
# hoặc
npx expo start --ios

# Android Emulator
npm run android
# hoặc
npx expo start --android

# Web browser
npm run web
# hoặc
npx expo start --web
```

## 🔨 Build cho Production

### Thiết lập EAS Build
1. **Đăng ký tài khoản Expo:**
   ```bash
   eas login
   ```

2. **Khởi tạo EAS build:**
   ```bash
   eas build:configure
   ```

### Build cho iOS
```bash
# Development build
eas build --platform ios --profile development

# Preview build (TestFlight)
eas build --platform ios --profile preview

# Production build (App Store)
eas build --platform ios --profile production
```

### Build cho Android
```bash
# Development build
eas build --platform android --profile development

# Preview build (Google Play Internal Testing)
eas build --platform android --profile preview

# Production build (Google Play Store)
eas build --platform android --profile production
```

### Build cho cả iOS và Android
```bash
eas build --platform all --profile production
```

## 📂 Cấu trúc dự án

```
FlashCardApp/
├── app/                    # App Router - Điều hướng và màn hình
│   ├── (tabs)/            # Tab navigation
│   ├── +html.tsx          # Custom HTML template
│   ├── +not-found.tsx     # 404 page
│   └── _layout.tsx        # Root layout
├── assets/                # Hình ảnh, fonts, tài nguyên tĩnh
│   ├── fonts/
│   └── images/
├── components/            # React Components có thể tái sử dụng
│   ├── ui/               # UI components cơ bản
│   ├── navigation/       # Navigation components
│   └── __tests__/        # Component tests
├── constants/            # Constants và cấu hình
│   ├── Colors.ts
│   └── index.ts
├── hooks/                # Custom React Hooks
├── scripts/              # Build và utility scripts
├── app.json             # Expo configuration
├── eas.json             # EAS Build configuration
├── package.json         # NPM dependencies
└── tsconfig.json        # TypeScript configuration
```

## ⚙️ Cấu hình quan trọng

### app.json
Cấu hình chính của ứng dụng Expo:
- App name, icon, splash screen
- Platform-specific settings
- Permissions và capabilities

### eas.json
Cấu hình cho EAS Build:
- Build profiles (development, preview, production)
- Platform-specific build settings
- Resource allocation

## 🔧 Scripts có sẵn

```bash
# Development
npm start              # Khởi động Expo development server
npm run android        # Chạy trên Android emulator
npm run ios           # Chạy trên iOS simulator (macOS only)
npm run web           # Chạy trên web browser

# Linting
npm run lint          # Chạy ESLint

# Reset project
npm run reset-project # Reset project về trạng thái ban đầu
```

## 📝 Lưu ý quan trọng

### Để build iOS trên Windows:
1. **Sử dụng EAS Build** (khuyến nghị): Build trên cloud của Expo
2. **Expo Go**: Test trên thiết bị iOS thật qua Expo Go app
3. **Web version**: Test trên browser

### Yêu cầu để submit lên App Store:
1. Tài khoản Apple Developer ($99/năm)
2. Chứng chỉ và provisioning profiles
3. Build production qua EAS

### Testing:
- **Development**: Sử dụng Expo Go app
- **Internal testing**: EAS Build với profile "preview"
- **Production**: Build với profile "production"

## 🌟 Tính năng Expo

- **Hot Reload**: Tự động reload khi thay đổi code
- **Over-the-Air Updates**: Cập nhật app mà không cần qua App Store
- **Native APIs**: Truy cập camera, location, notifications, v.v.
- **Cross-platform**: Một codebase cho iOS, Android, và Web

## 📚 Tài liệu tham khảo

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Node.js version warning**: Cập nhật Node.js lên phiên bản mới nhất
2. **Metro bundler issues**: Xóa cache với `npx expo start -c`
3. **Build failures**: Kiểm tra eas.json và app.json configuration

### Làm sạch cache:
```bash
# Clear Expo cache
npx expo start -c

# Clear npm cache
npm cache clean --force

# Reset Metro cache
npx react-native start --reset-cache
```

## 🚀 Deployment

### TestFlight (iOS):
1. Build với profile "preview"
2. Submit lên TestFlight qua EAS Submit
3. Invite testers

### Google Play Console (Android):
1. Build với profile "production"
2. Upload APK/AAB file
3. Release qua Internal/Alpha/Beta testing

---

**Chúc bạn coding vui vẻ! 🎉**