# CyberShield - Cybercrime Helpdesk App

A comprehensive cybercrime incident reporting and tracking system built with React Native Expo, TypeScript, and a modern architecture.

## 🚀 Features

- **🔐 Authentication System** - Login and registration with local storage
- **📊 Dashboard Overview** - Real-time statistics of reported incidents
- **📝 Incident Reporting** - Comprehensive form for reporting cybercrime incidents
- **📋 Incident Management** - View and manage all reported incidents
- **🚨 Escalation System** - Escalate incidents to emergency priority
- **💾 Local Storage** - Persistent data storage using AsyncStorage
- **🎨 Modern UI** - Clean, professional interface with CyberShield branding
- **🔒 TypeScript** - Full type safety and better development experience
- **📱 Cross-Platform** - Works on iOS, Android, and Web

## 📱 Project Structure

```
src/
├── components/          # Reusable UI components (from template)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Header.tsx
│   ├── Loading.tsx
│   └── index.ts
├── screens/            # CyberShield screen components
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── OverviewScreen.tsx
│   ├── ReportScreen.tsx
│   ├── IncidentsScreen.tsx
│   └── index.ts
├── navigation/         # Navigation configuration
│   ├── RootNavigator.tsx
│   ├── TabNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── index.ts
├── styles/            # CyberShield styling
│   └── cybershield.ts
├── utils/             # Utility functions
│   ├── helpers.ts
│   ├── validation.ts
│   ├── storage.ts
│   └── index.ts
├── constants/         # App constants
│   ├── colors.ts
│   ├── dimensions.ts
│   └── index.ts
├── types/            # TypeScript type definitions
│   └── navigation.ts (includes User & Incident types)
└── assets/           # Images, fonts, etc.
```

## 🛠️ Installation

1. **Navigate to the project directory**
   ```bash
   cd react-expo-template
   ```

2. **Install dependencies** (already done during creation)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platform**
   ```bash
   npm run ios     # iOS simulator
   npm run android # Android emulator
   npm run web     # Web browser
   ```

## 🎯 Core Functionality

### 🔐 Authentication
- **Login Screen**: Secure email/password authentication
- **Registration Screen**: Account creation with validation
- **Session Management**: Persistent login state with AsyncStorage

### 📊 Dashboard
- **Overview Screen**: Real-time statistics and quick actions
- **Statistics Cards**: Pending, reviewing, and resolved incident counts
- **Recent Activity**: Latest incident reports with status badges

### 📝 Incident Reporting
- **Report Screen**: Comprehensive incident submission form
- **Categories**: Phishing, Malware, Data Breach, Identity Theft, Financial Fraud, Ransomware, Social Engineering, Other
- **Severity Levels**: Low, Medium, High, Emergency
- **Form Validation**: Required fields and data integrity checks

### 📋 Incident Management
- **Incidents Screen**: View all reported incidents
- **Status Tracking**: Pending, Reviewing, Resolved statuses
- **Escalation System**: Upgrade incidents to emergency priority
- **Detailed Views**: Full incident information with timestamps

## 💾 Data Management

CyberShield uses local storage for data persistence:
- **User Authentication**: Secure storage of user credentials
- **Incident Data**: Local storage of all reported incidents
- **Session State**: Maintains login state across app restarts
- **Data Synchronization**: Ready for backend API integration

```typescript
import { storage } from '../utils/storage';

// Storage operations
await storage.setItem('cyberShieldUser', JSON.stringify(user));
const userData = await storage.getItem('cyberShieldUser');
```

## 🎨 Styling System

CyberShield uses a custom styling system:
- **CyberShield Colors**: Professional blue-based color palette
- **Consistent Typography**: Standardized font sizes and weights
- **Component Styles**: Unified styling across all components
- **Responsive Design**: Adaptive layouts for different screen sizes

## 🎯 Utilities

### Validation Functions
- Email validation
- Password strength checking
- Phone number validation
- Required field validation
- And more...

### Helper Functions
- Text manipulation (capitalize, truncate)
- Debouncing
- Deep cloning
- Empty value checking
- Number formatting

## 🎨 Styling

The template uses a consistent design system with:
- **Colors**: Primary, secondary, status colors, text colors
- **Dimensions**: Spacing, font sizes, border radius, component heights
- **Typography**: Consistent font sizes and weights
- **Components**: Unified styling across all components

## 📝 Configuration

### App Settings
The app is configured in `app.json`:
- **App Name**: CyberShield
- **Bundle ID**: com.cybershield.helpdesk
- **Description**: Cybercrime incident reporting and helpdesk system
- **Primary Color**: #2563eb (Professional Blue)

### Storage Keys
Data is stored using these AsyncStorage keys:
- `cyberShieldUser`: User authentication data
- `cyberShieldIncidents`: All incident reports

## 🧪 Development

### Adding New Incident Categories
1. Update the `categories` array in `src/screens/ReportScreen.tsx`
2. Consider adding category-specific validation or fields

### Extending User Data
1. Update the `User` interface in `src/types/navigation.ts`
2. Modify registration and login flows accordingly
3. Update storage operations in `App.tsx`

### Adding New Incident Fields
1. Update the `Incident` interface in `src/types/navigation.ts`
2. Modify the report form in `src/screens/ReportScreen.tsx`
3. Update incident display in `src/screens/IncidentsScreen.tsx`

### Backend Integration
To connect to a real backend API:
1. Update authentication functions in `App.tsx`
2. Replace local storage with API calls
3. Implement real-time incident status updates

## 📦 Build and Deploy

### Development Build
```bash
npx expo install --fix  # Fix dependencies
npx expo start --clear  # Clear cache
```

### Production Build
```bash
npx eas build --platform all
```

## 🚀 Usage

### First Time Setup
1. Launch the app
2. Create an account using the registration screen
3. Login with your credentials

### Reporting an Incident
1. Navigate to the Overview screen
2. Tap "Report New Incident" or use the Report tab
3. Fill in the incident details:
   - **Title**: Brief description of the incident
   - **Description**: Detailed information about what happened
   - **Category**: Select the type of cybercrime
   - **Severity**: Choose the appropriate priority level
4. Submit the report

### Managing Incidents
1. Go to the "My Reports" tab
2. View all your reported incidents
3. Tap the alert icon to escalate an incident to emergency priority
4. Monitor status changes (Pending → Reviewing → Resolved)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native team for the amazing framework
- Expo team for the excellent developer experience
- React Navigation for seamless navigation
- TypeScript for type safety

---

Happy coding! 🎉
