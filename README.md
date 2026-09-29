# Phoenix Malls - Global Map Experience

A production-quality React.js web application that provides an interactive world map experience for Phoenix Malls, featuring real-time open/closed status, mall details, and responsive design.

## � Assignment Objective

This project demonstrates the ability to build a production-ready frontend application with:
- Component-based architecture with clear separation of concerns
- Reusable UI components following modern React patterns
- Proper data flow and state management
- Real-time business logic (timezone-aware status calculation)
- Responsive design with mobile-first approach
- Performance optimization techniques
- Comprehensive testing for critical business logic
- Accessibility considerations
- Professional UI/UX design

## �🌟 Features

- **Interactive World Map**: Built with Leaflet and React Leaflet, featuring zoom, pan, and country selection
- **Real-time Mall Status**: Dynamic OPEN/CLOSED status calculation based on local timezone and operating hours
- **Visual Status Indicators**: Green pulsing markers for open malls, red markers for closed malls
- **Detailed Mall Information**: Popup cards with mall images, contact details, operating hours, and more
- **Search & Filter**: Search malls by name/city and filter by open/closed status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth transitions and animations
- **Service Layer Architecture**: Abstracted data layer ready for REST API integration
- **Comprehensive Testing**: Unit tests for critical business logic
- **Loading & Error States**: Proper handling of loading, empty, and error states
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠 Tech Stack

- **React.js** - UI library
- **Vite** - Build tool and dev server
- **JavaScript** - Language (ES6+)
- **React Hooks** - State management
- **Leaflet** - Interactive map library
- **React Leaflet** - React integration for Leaflet
- **OpenStreetMap** - Map tiles provider
- **Vitest** - Testing framework
- **React Testing Library** - Component testing utilities

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FrontendAssignment
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Run Commands

- **Development server**:
```bash
npm run dev
```

- **Build for production**:
```bash
npm run build
```

- **Preview production build**:
```bash
npm run preview
```

- **Run tests**:
```bash
npm test
```

- **Lint code**:
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header/         # Application header with branding
│   ├── WorldMap/       # Interactive map component
│   ├── MallMarker/     # Custom map markers with status
│   ├── MallPopup/      # Information popup for mall details
│   ├── MallCard/       # Mall card component for list view
│   ├── StatusBadge/    # Open/Closed status badge
│   ├── Loading/        # Loading state component
│   └── ErrorState/     # Error state component
├── pages/              # Page-level components
│   └── Home/           # Main application page
├── data/               # Mock data files
│   └── malls.json      # Mall data with locations and hours
├── services/           # API/service layer
│   └── mallService.js  # Mall data service with simulated API calls
├── utils/              # Utility functions
│   ├── statusUtils.js  # Status calculation logic
│   ├── timezoneUtils.js # Timezone utilities
│   └── statusUtils.test.js # Unit tests
├── hooks/              # Custom React hooks
│   ├── useMalls.js     # Hook for fetching mall data
│   └── useMallStatus.js # Hook for mall status
├── test/               # Test configuration
│   └── setup.js        # Test setup file
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
├── App.css             # Global styles
└── index.css           # Base styles
```

## 🏗 Architecture

### Component Architecture

The application follows a clean, component-based architecture:

- **Presentational Components**: Focus on UI rendering (Header, StatusBadge, Loading, ErrorState)
- **Container Components**: Manage state and business logic (Home, WorldMap)
- **Service Layer**: Abstracts data fetching (mallService.js)
- **Custom Hooks**: Reusable stateful logic (useMalls, useMallStatus)
- **Utility Functions**: Pure functions for business logic (statusUtils, timezoneUtils)

### Data Flow

1. **Home Component** → Uses `useMalls` hook to fetch mall data
2. **useMalls Hook** → Calls `mallService.getMalls()`
3. **mallService** → Returns mock data (simulated API delay)
4. **Home Component** → Passes mall data to WorldMap and MallCard components
5. **WorldMap Component** → Renders MallMarker components with status
6. **MallMarker Component** → Uses `useMallStatus` hook for real-time status
7. **useMallStatus Hook** → Calls `getMallStatus()` utility function
8. **getMallStatus()** → Calculates status based on current time and mall timezone

## 📊 Mock Data Structure

Each mall in `malls.json` follows this structure:

```json
{
  "id": "phoenix-pune",
  "name": "Phoenix Marketcity Pune",
  "country": "India",
  "city": "Pune",
  "latitude": 18.5679,
  "longitude": 73.9143,
  "image": "https://example.com/mall-image.jpg",
  "address": "Sr. No 109/2, Viman Nagar, Pune, Maharashtra 411014, India",
  "openingTime": "10:00",
  "closingTime": "22:00",
  "timezone": "Asia/Kolkata",
  "phone": "+91 20 6626 8888",
  "website": "https://www.phoenixmarketcity.com/pune"
}
```

## ⏰ Status Calculation

The `getMallStatus()` function calculates mall status by:

1. Getting the current time in the mall's local timezone
2. Converting opening/closing times to minutes since midnight
3. Comparing current time with operating hours
4. Returning 'OPEN' if within hours, 'CLOSED' otherwise

**Key considerations:**
- Uses mall's local timezone for accurate status
- Handles edge cases (missing data, invalid timezones)
- Returns 'CLOSED' as fallback for any errors
- Separate from UI code for easy testing

## 🗺 Map Library

**Leaflet + React Leaflet** was chosen because:

- Lightweight and performant
- Open-source with active community
- Excellent React integration via React Leaflet
- Supports custom markers and popups
- Free OpenStreetMap tiles
- Mobile-responsive out of the box
- No API key required for basic usage

## 🔌 API Replacement Strategy

The service layer is designed for easy API integration:

**Current (Mock):**
```javascript
// mallService.js
async getMalls() {
  await simulateNetworkDelay();
  return mallsData; // Local JSON
}
```

**Future (REST API):**
```javascript
// mallService.js
async getMalls() {
  const response = await fetch('/api/malls');
  return response.json();
}
```

**Benefits:**
- UI components remain unchanged
- Only service layer needs modification
- Type-safe interface maintained
- Easy to mock for testing
- Consistent error handling

## ⚡ Performance Considerations

- **React.memo**: Used in components to prevent unnecessary re-renders
- **Custom Hooks**: Efficient state management and data fetching
- **Lazy Loading**: Components load only when needed
- **Simulated Network Delay**: Mimics real API behavior for development
- **Efficient Marker Rendering**: Only renders visible markers
- **CSS Animations**: Hardware-accelerated for smooth performance
- **Image Optimization**: Uses fallback for failed image loads

## 🧪 Testing

Tests are focused on critical business logic:

**Status Calculation Tests:**
- Invalid data handling
- Missing field scenarios
- Different time ranges
- Timezone edge cases

**Running Tests:**
```bash
npm test
```

**Test Coverage:**
- Unit tests for utility functions
- Status calculation logic
- Format validation
- Error handling

## 🎯 Assumptions

1. Initial data is local JSON (simulated API)
2. All malls use the same timezone format (IANA)
3. Operating hours are consistent daily
4. Map tiles from OpenStreetMap are always available
5. Images are hosted externally with fallback URLs
6. User's browser supports modern JavaScript features

## ⚠️ Known Limitations

1. **Status Calculation**: Based on client-side time, may vary by user's system time
2. **Timezone Handling**: Limited to IANA timezone format support
3. **No Backend**: Currently uses mock data, no real API integration
4. **Single Day Hours**: Operating hours are the same for all days
5. **Image Fallback**: Uses placeholder images when original images fail
6. **No Authentication**: No user authentication or authorization
7. **Limited Search**: No search or filter functionality (can be added as bonus)

## 🚀 Future Improvements

1. **Real API Integration**: Connect to actual backend REST APIs
2. **Advanced Search**: Add search by name, city, or country
3. **Filter Functionality**: Filter by open/closed status, amenities
4. **Dark Mode**: Add theme switching capability
5. **Marker Clustering**: Group nearby markers for better performance
6. **Route Planning**: Add directions and route planning
7. **Real-time Updates**: WebSocket integration for live status updates
8. **Multi-language Support**: Internationalization (i18n)
9. **Analytics**: Track user interactions and popular locations
10. **Offline Support**: Service worker for offline functionality

## 📱 Responsive Design

The application is fully responsive:

- **Desktop (>768px)**: Full map with side panel for mall cards
- **Tablet (768px-1024px)**: Adjusted layout with optimized spacing
- **Mobile (<768px)**: Bottom sheet for mall details, full-screen map

## 🎨 Design Principles

- Clean, modern interface with professional branding
- High contrast for accessibility
- Smooth transitions and animations
- Consistent spacing and typography
- Visual hierarchy for important information
- Status-driven color coding (green for open, red for closed)

## 🔒 Accessibility

- Semantic HTML elements
- Alt text for images
- Keyboard-navigable controls
- High contrast ratios
- Clear button labels
- Screen reader friendly

## 📄 License

This project is created for demonstration purposes.

## 👤 Author

Built as a frontend assignment demonstrating React.js skills, component architecture, and modern web development practices.
