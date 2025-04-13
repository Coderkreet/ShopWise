# ShopWise - E-Commerce Mobile App

A full-featured e-commerce application built with React Native, offering seamless shopping experiences across platforms.

## 🛍️ Key Features

### Core E-Commerce Functionality
- **Product Catalog**
  - Browse products with categories
  - Product details with images and descriptions
  - Search functionality
  - Product carousel (using react-native-snap-carousel)

### User Management
- Secure login/authentication
- User profile management
- Session persistence with Async Storage

### Shopping Experience
- **Shopping Cart**
  - Add/remove products
  - Quantity adjustment
  - Cart persistence
- **Wishlist**
  - Save favorite products
  - Move items to cart
- **Checkout Process**
  - Order summary
  - Shipping information
  - Payment integration (to be implemented)

### UI/UX Features
- Smooth animations (React Native Reanimated)
- Gesture-based interactions (React Native Gesture Handler)
- Toast notifications (react-native-toast-message)
- Vector icons for consistent UI (@expo/vector-icons)
- Responsive design for all screen sizes

## 🚀 Technologies Used

### Core Stack
- **React Native 0.79.0** - Cross-platform mobile framework
- **React 19.0.0** - Frontend library
- **React Navigation** - For app navigation (Stack, Bottom Tabs)
- **Context API** - For state management (Auth, Cart, Products, Wishlist)

### Additional Libraries
- **React Native Vector Icons** - Beautiful icon set
- **React Native Snap Carousel** - Product image carousel
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch interactions
- **Async Storage** - Persistent local storage

## 🔧 Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (>= v18)
- npm or Yarn
- Java Development Kit (JDK 11+)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- Watchman (for macOS/Linux users)

## ⚙️ Setup Instructions

### 1. Clone the repository
```sh
git clone <repository-url>
cd taskone
```

### 2. Install dependencies
```sh
# Using npm
npm install

# OR using Yarn
yarn install
```

### 3. iOS-specific setup (macOS only)
```sh
cd ios && pod install && cd ..
```

### 4. Configure environment
Create a `.env` file in the root directory if needed (not currently used in the project)

## 🏃 Running the App

### Start Metro Bundler
```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Run on Android
```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### Run on iOS (macOS only)
```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

## 🛠 Build Process

### Android Release Build
1. Configure signing keys in `android/gradle.properties`
2. Run:
```sh
cd android && ./gradlew assembleRelease
```

### iOS Release Build (macOS only)
1. Open Xcode workspace in `ios/`
2. Configure signing & provisioning
3. Build archive through Xcode

## 📂 Project Structure
