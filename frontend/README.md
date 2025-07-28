# ReRo Website Frontend

Beautiful, responsive React frontend for the ReRo slot booking system with real-time WebSocket updates.

## 🔥 Features

- **💻 Beautiful UI**: Material-UI components with Tailwind CSS styling
- **🔐 Secure Authentication**: Login and registration with form validation
- **⚡ Real-time Updates**: WebSocket integration for live slot updates
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🎨 Modern Design**: Clean, professional interface with smooth animations
- **🚀 Fast & Efficient**: Built with Vite for optimal performance

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Material-UI** - Comprehensive React component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 📱 Pages & Features

### 🏠 Home Page (`/`)
- Welcome page with feature overview
- Quick access to login/register
- Time slots information display

### 🔐 Authentication Pages
- **Login** (`/login`): Email/password authentication
- **Register** (`/register`): New account creation with validation

### 📅 Slot Booking (`/booking`)
- **Real-time Grid**: Visual slot grid with live updates
- **Color-coded Status**:
  - 🟢 **Green**: Available slots
  - 🔵 **Blue**: Your bookings  
  - 🔴 **Red**: Booked by others
- **One-click Actions**: Book or cancel slots instantly
- **WebSocket Connection**: Live connection status indicator
- **Responsive Layout**: Works on all screen sizes

## 🔌 WebSocket Integration

The frontend maintains a persistent WebSocket connection to the backend for real-time updates:

- **Auto-reconnection**: Automatic reconnection with exponential backoff
- **Live Status**: Connection indicator in the header
- **Instant Updates**: Slot changes appear immediately for all users
- **Error Handling**: Graceful error handling and user feedback

## 🎨 UI Components

### Material-UI Components Used:
- `Container`, `Card`, `Typography` - Layout and content
- `TextField`, `Button` - Forms and interactions  
- `Alert`, `Chip` - Feedback and status indicators
- `AppBar`, `Toolbar` - Navigation header
- `CircularProgress` - Loading states

### Tailwind CSS Classes:
- Responsive grid layouts (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3`)
- Color utilities (`bg-green-100`, `text-blue-600`)
- Spacing and sizing (`p-4`, `mb-6`, `w-16 h-16`)
- Transitions and animations (`transition-all`, `hover:scale-105`)

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: Single column layout
- **Tablet**: 2-3 column grid
- **Desktop**: 4+ column grid for optimal slot viewing

---

**Built with ❤️ for the ReRo slot booking system!** 🎉
