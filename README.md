# TechHub Frontend - Multi-Vendor Tech Store

A modern, responsive React frontend application for the TechHub multi-vendor technology marketplace. Built with Material-UI and designed to provide an exceptional shopping experience for computers, laptops, and tech gadgets.

## 🚀 Features

### Core Features
- **Multi-vendor marketplace** with shop-based product organization
- **Advanced product search and filtering** 
- **Shopping cart management** with real-time updates
- **Secure checkout process** with multiple payment options
- **User authentication** with role-based access control
- **Order management** and tracking
- **Responsive design** optimized for all devices

### User Roles & Dashboards
- **Customers**: Browse, search, shop, and manage orders
- **Shop Owners**: Manage products, view orders, track analytics
- **Administrators**: Platform oversight, user management, shop approval

### Product Categories
- **Computers & Laptops**: Gaming, business, and personal computers
- **Tech Gadgets**: Accessories, components, and peripherals
- **Custom filtering**: By brand, price, specifications, and ratings

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** with functional components and hooks
- **React Router** for client-side routing
- **Material-UI (MUI)** for consistent, beautiful UI components
- **Emotion** for CSS-in-JS styling

### State Management
- **React Context API** for global state management
- **Custom hooks** for cart, authentication, and notifications

### Development Tools
- **Create React App** for project scaffolding
- **ESLint** for code quality
- **Tailwind CSS** for utility-first styling
- **React Slick** for product carousels

## 📁 Project Structure

```
src/
├── component/
│   ├── Auth/                 # Authentication components
│   │   ├── Login.jsx
│   │   └── ProtectedRoute.jsx
│   ├── Cart/                 # Shopping cart functionality
│   │   └── Cart.jsx
│   ├── Checkout/             # Order checkout process
│   │   └── Checkout.jsx
│   ├── Common/               # Reusable components
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── NotFound.jsx
│   ├── Computer/             # Computer product details
│   │   └── ComputerDetail.jsx
│   ├── Dashboard/            # Role-based dashboards
│   │   ├── AdminDashboard.jsx
│   │   └── ShopDashboard.jsx
│   ├── Home/                 # Homepage components
│   │   ├── CarousalItem.jsx
│   │   ├── Home.jsx
│   │   ├── MultiItemCarousal.jsx
│   │   └── TopPc.js
│   ├── Layout/               # Layout components
│   │   └── Footer.jsx
│   ├── Navbar/               # Navigation
│   │   └── Navbar.jsx
│   ├── Orders/               # Order management
│   │   └── Orders.jsx
│   ├── Profile/              # User profile management
│   │   └── Profile.jsx
│   ├── Search/               # Search functionality
│   │   └── SearchResults.jsx
│   ├── Shop/                 # Shop listing and details
│   │   ├── ShopCard.jsx
│   │   └── ShopDetails.jsx
│   └── TechGadgets/          # Tech gadgets catalog
│       ├── TechGadgets.jsx
│       └── TechGadgetDetail.jsx
├── contexts/                 # React Context providers
│   ├── AuthContext.js
│   ├── CartContext.js
│   └── NotificationContext.js
├── services/                 # API service layer
│   └── api.js
├── Theme/                    # Material-UI theming
│   └── DarkTheme.js
└── App.js                   # Main application component
```

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **TechHub Backend** running on port 5454

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TechHub-By-DJK-frontend-Private
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file and update the backend URL if needed
   REACT_APP_API_BASE_URL=http://localhost:5454
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000` (or the next available port)

### Backend Setup Requirements

⚠️ **Important**: Make sure your TechHub backend is running before starting the frontend.

1. **Backend Configuration**
   - Your backend should be running on port **5454**
   - Ensure CORS is configured to allow requests from `http://localhost:3000`
   - Database should be properly configured and running

2. **Test Backend Connection**
   ```powershell
   # Test if backend is accessible
   Test-NetConnection -ComputerName localhost -Port 5454
   
   # Should return: TcpTestSucceeded : True
   ```

3. **Common Backend Setup**
   ```bash
   # In your backend project directory
   mvn spring-boot:run
   # or
   ./gradlew bootRun
   ```

### Troubleshooting Connection Issues

If you see `ERR_CONNECTION_REFUSED` errors:

1. **Check backend is running**
   ```powershell
   netstat -an | findstr :5454
   ```

2. **Verify backend URL in frontend**
   - Check `.env` file has `REACT_APP_API_BASE_URL=http://localhost:5454`
   - Restart frontend after changing environment variables

3. **CORS Configuration**
   Ensure your backend `application.properties` includes:
   ```properties
   server.port=5454
   # Add CORS configuration for frontend URL
   ```

## 🎨 Design System

### Theme
- **Dark theme** as primary design choice
- **Pink (#e91e63)** as the primary brand color
- **Outfit font family** for modern typography
- **Consistent spacing** using Material-UI's 8px grid system

### Component Design
- **Card-based layouts** for product displays
- **Responsive grid system** with breakpoint considerations
- **Interactive hover effects** and smooth transitions
- **Accessible color contrasts** and focus indicators

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- Backend API running on http://localhost:8080

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TechHub-By-DJK-frontend-Private
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080
   REACT_APP_APP_NAME=TechHub
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Key Pages & Features

### Public Pages
- **Homepage** (`/`): Featured products, shop listings, category navigation
- **Shop Details** (`/shop/:shopId`): Individual shop pages with product catalogs
- **Product Details** (`/computer/:computerId`, `/gadget/:gadgetId`): Detailed product information
- **Search Results** (`/search`): Advanced search with filtering options
- **Tech Gadgets** (`/gadgets`): Dedicated gadgets marketplace

### Protected Pages (Login Required)
- **Shopping Cart** (`/cart`): Cart management and item modification
- **Checkout** (`/checkout`): Multi-step order placement process
- **Orders** (`/orders`): Order history and tracking
- **Profile** (`/profile`): User account management

### Role-Based Dashboards
- **Shop Dashboard** (`/shop-dashboard`): For shop owners to manage products and orders
- **Admin Dashboard** (`/admin-dashboard`): For platform administration

## 🔐 Authentication & Authorization

### Authentication Flow
- JWT-based authentication with automatic token refresh
- Role-based access control (Customer, Shop Owner, Admin)
- Protected routes with automatic redirects
- Persistent login state across browser sessions

### User Roles
- **Customer**: Standard shopping privileges
- **Shop Owner**: Product and order management for their shop
- **Admin**: Full platform oversight and management

## 🛒 Shopping Experience

### Product Discovery
- **Multi-faceted search** with real-time results
- **Category-based browsing** with filters
- **Shop-specific catalogs** with brand filtering
- **Featured product carousels** on homepage

### Shopping Cart
- **Real-time cart updates** with quantity management
- **Persistent cart state** across sessions
- **Price calculations** with totals and subtotals
- **Easy checkout process** with guest options

### Order Management
- **Multi-step checkout** with address and payment options
- **Order confirmation** with email notifications
- **Order tracking** with status updates
- **Order history** with detailed breakdowns

## 🎯 Performance & Optimization

### Performance Features
- **Code splitting** with React lazy loading
- **Optimized images** with responsive loading
- **Efficient re-renders** with React.memo and useMemo
- **Bundle optimization** with Create React App's built-in tools

### User Experience
- **Loading states** for all async operations
- **Error boundaries** for graceful error handling
- **Responsive design** for all screen sizes
- **Accessible components** following WCAG guidelines

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_BASE_URL=https://your-api-domain.com
REACT_APP_APP_NAME=TechHub
```

### Deployment Options
- **Netlify**: Automatic deployments from Git
- **Vercel**: Zero-config deployments
- **AWS S3 + CloudFront**: Scalable static hosting
- **Docker**: Containerized deployments

## 🤝 Contributing

### Development Guidelines
1. Follow React best practices and hooks patterns
2. Use TypeScript for new components (migration in progress)
3. Maintain Material-UI theming consistency
4. Write comprehensive tests for new features
5. Follow accessibility standards (WCAG 2.1)

### Code Style
- **ESLint** configuration for consistent code style
- **Prettier** for automatic code formatting
- **Conventional commits** for clear commit messages

## 📞 Support & Contact

For technical support or questions about the TechHub frontend:
- **Email**: support@techhub.lk
- **Documentation**: Comprehensive inline code documentation
- **Issue Tracking**: GitHub Issues for bug reports and feature requests

## 📄 License

This project is proprietary software developed for TechHub by DJK. All rights reserved.

---

**Built with ❤️ by the DJK Team**

*TechHub - Fueling the Future, One Laptop at a Time.*
