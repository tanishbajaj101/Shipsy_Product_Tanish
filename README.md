# Product Management System

A full-stack web application built with React and Node.js for managing products, user authentication, and shopping cart functionality. This project demonstrates modern web development practices with a clean architecture, comprehensive testing, and RESTful API design.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Management**: Create, read, update, and delete products
- **Shopping Cart**: Add/remove items with quantity management
- **Product Filtering**: Filter by type and coupon availability
- **Search & Sort**: Text-based search and price sorting
- **Responsive UI**: Modern Bootstrap-based interface

### Product Features
- **Product Types**: Electronics, Clothing, Books, Home Goods
- **Coupon System**: Track products with available coupon codes
- **Ownership Validation**: Users can only modify their own products
- **Inventory Management**: Track product quantities

### User Features
- **Secure Authentication**: bcrypt password hashing + JWT tokens
- **Personal Dashboard**: View and manage own products
- **Shopping Cart**: Session-based cart management
- **Product Creation**: Add new products to the marketplace

## 🏗️ Architecture

### Backend (Node.js/Express)
```
server/
├── src/
│   ├── models/          # MongoDB schemas (User, Product, Cart)
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic layer
│   ├── server.js        # Express server setup
│   └── db.js           # Database connection
├── tests/              # Comprehensive test suite
└── openapi.yaml        # API documentation
```

### Frontend (React)
```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route components
│   ├── services/       # API service layer
│   └── utils/          # Helper utilities
└── public/            # Static assets
```

### Key Design Patterns
- **Layered Architecture**: Routes → Services → Models → Database
- **Separation of Concerns**: Clear boundaries between layers
- **RESTful API**: Standard HTTP methods and status codes
- **JWT Authentication**: Stateless authentication
- **MVC Pattern**: Model-View-Controller separation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Jest** - Testing framework
- **Swagger** - API documentation

### Frontend
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/tanishbajaj101/Shipsy_Product_Tanish.git
cd Shipsy_Product_Tanish
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/productapp
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### 4. Database Setup
Ensure MongoDB is running on your system or update the `MONGODB_URI` in the `.env` file to point to your MongoDB instance.

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start the backend server (with nodemon)
npm run server:dev

# Start the frontend client (in a new terminal)
npm run client:start
```

### Production Mode
```bash
# Build the client
npm run client:build

# Start the server
npm run server:start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 🧪 Testing

### Run All Tests
```bash
cd server
npm test
```

### Test Coverage
The project includes comprehensive test suites:
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: End-to-end workflow testing
- **Security Tests**: Authentication and authorization testing
- **Validation Tests**: Input validation testing

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login and get JWT token

### Product Endpoints
- `GET /api/products` - List all products (with filtering/sorting)
- `POST /api/products` - Create new product (authenticated)
- `GET /api/products/my-products` - Get user's products (authenticated)
- `PUT /api/products/:id` - Update product (authenticated, owner only)
- `DELETE /api/products/:id` - Delete product (authenticated, owner only)

### Cart Endpoints
- `GET /api/users/cart` - Get user's cart (authenticated)
- `POST /api/users/cart/:productId` - Add item to cart (authenticated)
- `DELETE /api/users/cart/:productId` - Remove item from cart (authenticated)

### Query Parameters
- `type` - Filter by product type (Electronics, Clothing, Books, Home Goods)
- `couponCodeAvailable` - Filter by coupon availability (true/false)
- `sortBy` - Sort products (price, name, etc.)
- `search` - Text search in product names

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Cross-origin request handling
- **Input Validation**: Comprehensive request validation
- **Ownership Validation**: Users can only modify their own products
- **SQL Injection Protection**: Mongoose ODM prevents injection attacks

## 📱 User Interface

### Pages
- **Home Page**: Browse all products with filtering and search
- **Login/Register**: User authentication forms
- **My Products**: Manage your created products
- **Create Product**: Add new products to the marketplace
- **Shopping Cart**: View and manage cart items

### Features
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Clean Bootstrap-based interface
- **Real-time Updates**: Dynamic content updates
- **User Feedback**: Success/error notifications

## 🗄️ Database Schema

### User Model
```javascript
{
  userId: String (UUID),
  username: String (unique),
  hashedPassword: String,
  products_created: [ObjectId] // References to Product documents
}
```

### Product Model
```javascript
{
  name: String (1-255 chars),
  description: String (1-5000 chars),
  type: Enum ['Electronics', 'Clothing', 'Books', 'Home Goods'],
  price: Number (min: 1),
  couponCodeAvailable: Boolean,
  quantity: Number (min: 1),
  owner_id: ObjectId (ref: User),
  created_at: Date
}
```

### Cart Model
```javascript
{
  user_id: ObjectId (ref: User),
  items: [{
    product_id: ObjectId (ref: Product),
    quantity: Number
  }]
}
```

## 🚀 Deployment

### Environment Variables
Ensure the following environment variables are set:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)

### Build for Production
```bash
# Build the React app
npm run client:build

# The built files will be in client/build/
# Serve them with your preferred static file server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Kajal Bajaj**
- GitHub: [@tanishbajaj101](https://github.com/tanishbajaj101)
- Email: tanishbajaj101@gmail.com

## 🙏 Acknowledgments

- Built as part of Shipsy technical assessment
- Uses modern web development best practices
- Implements comprehensive testing strategies
- Follows RESTful API design principles

---

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/tanishbajaj101/Shipsy_Product_Tanish/issues) page
2. Create a new issue with detailed description
3. Contact the author directly

**Happy Coding! 🚀**
