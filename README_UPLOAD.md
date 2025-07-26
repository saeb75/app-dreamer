# Upload Component Documentation

## Features

This modern upload component includes the following features:

### 🎯 Core Functionality

- **Bottom Sheet Integration**: Uses `@gorhom/bottom-sheet` for smooth, modern UI
- **Camera Access**: Direct camera integration for taking photos
- **Gallery Access**: Browse and select from device photo gallery
- **Sample Photos**: Pre-loaded sample photos for demonstration
- **Dual Upload Areas**: Separate upload sections for "Top" and "Bottom" clothing items

### 📱 User Experience

- **Modern Design**: Clean, modern UI with smooth animations
- **Touch Feedback**: Responsive touch interactions
- **Permission Handling**: Automatic permission requests for camera and gallery access
- **Image Preview**: Selected images are displayed in the upload areas
- **Horizontal Scrolling**: Gallery photos displayed in horizontal scrollable lists

### 🔧 Technical Features

- **TypeScript Support**: Fully typed component with interfaces
- **Expo Integration**: Uses Expo's ImagePicker and MediaLibrary APIs
- **Responsive Design**: Adapts to different screen sizes
- **Error Handling**: Graceful error handling for permissions and API calls

## Installation

The component requires the following dependencies:

```bash
npm install @gorhom/bottom-sheet expo-image-picker expo-media-library
```

## Usage

```tsx
import Upload from './components/steps/upload';

// In your component
<Upload />;
```

## How It Works

1. **Upload Areas**: Two dashed border areas for "Top" and "Bottom" clothing items
2. **Bottom Sheet**: Tapping an upload area opens a bottom sheet with options
3. **Camera Button**: Blue button to take a new photo with camera
4. **Gallery Button**: Green button to select from device gallery
5. **Sample Photos**: Horizontal scrollable list of sample photos
6. **User Photos**: Horizontal scrollable list of user's gallery photos

## Permissions

The component automatically requests:

- Camera permission for taking photos
- Media library permission for accessing gallery photos

## Styling

The component uses a combination of:

- Tailwind CSS classes (via NativeWind)
- React Native StyleSheet
- Modern color scheme with blue and green accent colors
- Smooth shadows and rounded corners

## Customization

You can customize:

- Sample photos by modifying the `samplePhotos` array
- Colors and styling in the `styles` object
- Bottom sheet snap points
- Image quality and aspect ratio settings

## Dependencies

- `@gorhom/bottom-sheet`: For bottom sheet functionality
- `expo-image-picker`: For camera and gallery access
- `expo-media-library`: For accessing device photos
- `@expo/vector-icons`: For icons (Ionicons)
- `react-native-reanimated`: For animations (already included)
- `react-native-gesture-handler`: For gesture handling (already included)
