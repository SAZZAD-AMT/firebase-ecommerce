# Firebase E-Commerce Platform

A complete e-commerce solution built with React and Firebase, featuring public product browsing and ordering without authentication, plus a secure admin panel.

## 🚀 Features

### Public Features (No Login Required)
- ✅ Browse products with category filtering
- ✅ View detailed product information
- ✅ Place orders with customer details (name, mobile, address)
- ✅ Order confirmation messages
- ✅ Fully responsive mobile design

### Admin Features (Secure Login)
- ✅ Admin authentication with email/password
- ✅ Dashboard with statistics
- ✅ Category management (Add/Edit/Delete)
- ✅ Product management with image upload
- ✅ Order management with status updates
- ✅ View all customer orders

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Firebase CLI installed globally

## 🛠️ Installation Steps

### 1. Clone or Create Project

```bash
npx create-react-app firebase-ecommerce
cd firebase-ecommerce
```

### 2. Install Dependencies

```bash
npm install firebase react-router-dom
npm install -g firebase-tools
```

### 3. Firebase Setup

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the wizard to create your project
4. Enable Google Analytics (optional)

#### B. Enable Services
1. **Authentication:**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"

2. **Firestore Database:**
   - Go to Firestore Database → Create database
   - Start in **production mode**
   - Choose your location

3. **Storage:**
   - Go to Storage → Get started
   - Start in **production mode**

#### C. Get Firebase Config
1. Go to Project Settings (gear icon) → General
2. Scroll to "Your apps" → Web app
3. Click "Add app" or copy existing config
4. Copy the config object

### 4. Configure Firebase in Your App

Replace the config in `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 5. Deploy Security Rules

#### Firestore Rules
Copy the rules from the project to `firestore.rules` and deploy:

```bash
firebase deploy --only firestore:rules
```

#### Storage Rules
Copy the rules from the project to `storage.rules` and deploy:

```bash
firebase deploy --only storage:rules
```

### 6. Create Admin User

Since we have security rules preventing direct admin creation, you need to:

**Option A: Using Firebase Console**
1. Go to Authentication → Users → Add user
2. Create a user with email/password
3. Copy the User UID
4. Go to Firestore Database → Start collection
5. Collection ID: `admins`
6. Document ID: Use the User UID from step 3
7. Fields:
   ```
   email: "admin@example.com" (string)
   role: "admin" (string)
   createdAt: [Current timestamp]
   ```

**Option B: Temporarily modify Firestore rules**
1. In Firebase Console, go to Firestore Rules
2. Temporarily add this rule:
   ```
   match /admins/{adminId} {
     allow create: if true;
   }
   ```
3. Publish the rules
4. Use this script in browser console (when logged in):
   ```javascript
   // After creating user in Authentication
   firebase.firestore().collection('admins').doc('USER_UID_HERE').set({
     email: 'admin@example.com',
     role: 'admin',
     createdAt: firebase.firestore.FieldValue.serverTimestamp()
   });
   ```
5. Revert the rules back to secure state

### 7. Initialize Firebase in Project

```bash
firebase login
firebase init
```

Select:
- Firestore
- Storage
- Hosting

Choose your existing project and use default settings.

### 8. Run Development Server

```bash
npm start
```

Visit `http://localhost:3000`

### 9. Build and Deploy

```bash
npm run build
firebase deploy
```

Your site will be live at: `https://your-project-id.web.app`

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Navigation bar
│   ├── ProductCard.jsx         # Product card component
│   └── admin/
│       ├── AdminLogin.jsx      # Admin login page
│       ├── AdminDashboard.jsx  # Dashboard with stats
│       ├── CategoryManager.jsx # Category CRUD
│       ├── ProductManager.jsx  # Product CRUD with images
│       └── OrderManager.jsx    # Order management
├── config/
│   └── firebase.js             # Firebase configuration
├── contexts/
│   └── AuthContext.jsx         # Authentication context
├── pages/
│   ├── Home.jsx                # Product listing page
│   ├── ProductDetailPage.jsx  # Product details + order form
│   └── AdminPanel.jsx          # Admin routing
├── App.jsx                     # Main app component
├── App.css                     # Global styles
└── index.js                    # Entry point
```

## 🔐 Default Admin Credentials

You need to create these manually in Firebase Console:
- **Email:** admin@example.com (or your choice)
- **Password:** [Set your secure password]

## 📊 Firestore Collections

### categories
```javascript
{
  id: auto-generated,
  name: string,
  slug: string,
  createdAt: timestamp
}
```

### products
```javascript
{
  id: auto-generated,
  name: string,
  description: string,
  price: number,
  categoryId: string,
  categoryName: string,
  imageUrl: string,
  stock: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### orders
```javascript
{
  id: auto-generated,
  customerName: string,
  mobile: string,
  address: string,
  items: array[{
    productId: string,
    productName: string,
    price: number,
    quantity: number,
    imageUrl: string
  }],
  totalAmount: number,
  status: string, // pending, confirmed, delivered, cancelled
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### admins
```javascript
{
  id: user-uid,
  email: string,
  role: string,
  createdAt: timestamp
}
```

## 🎨 Customization

### Change Theme Colors
Edit CSS variables in `src/App.css`:

```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --success: #10b981;
  /* ... */
}
```

### Change Site Name
Edit `src/components/Navbar.jsx`:

```javascript
<Link to="/" className="navbar-brand">
  🛍️ Your Store Name
</Link>
```

## 🐛 Troubleshooting

### Firebase Permission Denied
- Verify security rules are deployed
- Check that admin user exists in both Authentication and `admins` collection
- Ensure User UID matches document ID in `admins` collection

### Image Upload Failed
- Check Storage rules are deployed
- Verify Storage is enabled in Firebase Console
- Check file size (Firebase free tier has limits)

### Orders Not Saving
- Verify Firestore rules allow public writes to `orders` collection
- Check browser console for errors
- Ensure all required fields are filled

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔒 Security Notes

- Admin routes are protected with authentication
- Public users can only read products/categories and create orders
- Only admins can modify products, categories, and order status
- Images are stored in Firebase Storage with public read access
- Never commit `firebase.js` with actual credentials to public repos

## 📈 Future Enhancements

- Email notifications for orders
- Payment gateway integration
- Product search functionality
- Product reviews and ratings
- Inventory management
- Sales analytics
- Multi-admin support with roles

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💬 Support

For support, create an issue in the repository or contact your development team.

---

**Built with ❤️ using React and Firebase**