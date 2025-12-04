
Luxe Bags API

This project is a Node.js backend server for the Luxe Bags e-commerce platform, built using Express and MongoDB. It provides a complete RESTful API for managing users, orders, products, and uploads, including both public endpoints (accessible by customers) and admin-only endpoints for store management.

The API is designed to be modular and scalable, with separate routes, controllers, and models, making it easy to extend or integrate with any frontend application. All routes follow standard REST conventions, and protected routes use JWT authentication for secure access.

This documentation provides a complete reference for all endpoints, including:

HTTP method and URL

Required headers

Example request bodies

Example responses

Access level (public, protected, or admin-only)



API Documentation
////////  Auth Routes  ///////////

///////////////////////////////////////////////////////////////////////////////////////
* Register User (Public) ****

Method: POST

URL: /api/auth/register

Body (JSON):

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}


Response: Returns user object with JWT token
///////////////////////////////////////////////////////////////////////////////////////////
Login User (Public) ****

Method: POST

URL: /api/auth/login

Body (JSON):

{
  "email": "john@example.com",
  "password": "secret123"
}


Response: Returns user object with JWT token
///////////////////////////////////////////////////////////////////////////////////////
Get Current User (Protected) ****

Method: GET

URL: /api/auth/me

Headers: Authorization: Bearer <token>

Response: Returns current logged-in user details
///////////////////////////////////////////////////////////////////////////////////////
Update Current User (Protected) ****

Method: PUT

URL: /api/auth/me

Headers: Authorization: Bearer <token>

Body (JSON):

{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newpassword123"
}


Response: Returns updated user object
///////////////////////////////////////////////////////////////////////////////////////
Delete Current User (Protected) ****

Method: DELETE

URL: /api/auth/me

Headers: Authorization: Bearer <token>

Response: Confirmation of deletion
///////////////////////////////////////////////////////////////////////////////////////
Get All Users (Admin Only) ****

Method: GET

URL: /api/auth/users

Headers: Authorization: Bearer <admin-token>

Response: Returns all users (excluding passwords)
///////////////////////////////////////////////////////////////////////////////////////
Delete Any User (Admin Only) ****

Method: DELETE

URL: /api/auth/users/:id

Headers: Authorization: Bearer <admin-token>

Response: Confirmation of deletion
///////////////////////////////////////////////////////////////////////////////////////
Order Routes
Create Order (Public) ****

Method: POST

URL: /api/orders

Body (JSON):

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "Springfield",
    "postalCode": "12345",
    "country": "USA"
  },
  "products": [
    {
      "productId": "64f0c3b2a1d4e12345abcd68",
      "quantity": 2,
      "color": "red",
      "size": "M"
    }
  ],
  "totalPrice": 199.99
}


Response: Returns created order object
///////////////////////////////////////////////////////////////////////////////////////
Cancel Order (Customer, Public) ****

Method: PUT

URL: /api/orders/:id/cancel

Headers: Authorization: optional if logged-in

Body: None

Response: Updated order with status cancelled
///////////////////////////////////////////////////////////////////////////////////////
Get Order by ID (Public) ****

Method: GET

URL: /api/orders/:id

Response: Returns order details
///////////////////////////////////////////////////////////////////////////////////////
Get All Orders (Admin Only) ****

Method: GET

URL: /api/orders

Headers: Authorization: Bearer <admin-token>

Response: Returns all orders
///////////////////////////////////////////////////////////////////////////////////////
Cancel Any Order (Admin Only) ****

Method: PUT

URL: /api/orders/:id/admin-cancel

Headers: Authorization: Bearer <admin-token>

Response: Updated order with status cancelled
///////////////////////////////////////////////////////////////////////////////////////
Update Order Status (Admin Only) ****

Method: PUT

URL: /api/orders/:id/status

Headers: Authorization: Bearer <admin-token>

Body (JSON):

{
  "status": "shipped"
}


Response: Updated order with new status
///////////////////////////////////////////////////////////////////////////////////////
Product Routes
Create Product (Admin Only) ****

Method: POST

URL: /api/products

Headers: Authorization: Bearer <admin-token>

Body (JSON):

{
  "name": "Elegant Bag",
  "description": "Leather ladies bag",
  "price": 149.99,
  "category": "Ladies Bag",
  "image": "https://cloudinary.com/image-url",
  "stock": 10,
  "colors": ["red", "black"],
  "sizes": ["S", "M", "L"],
  "isFeatured": true
}


Response: Returns created product object
///////////////////////////////////////////////////////////////////////////////////////
Get All Products (Public) ****

Method: GET

URL: /api/products

Response: Returns list of products
///////////////////////////////////////////////////////////////////////////////////////
Get Single Product (Public) ****

Method: GET

URL: /api/products/:id

Response: Returns single product details
///////////////////////////////////////////////////////////////////////////////////////
Update Product (Admin Only) ****

Method: PUT

URL: /api/products/:id

Headers: Authorization: Bearer <admin-token>

Body (JSON):

{
  "name": "Updated Product Name",
  "price": 199.99
}


Response: Returns updated product
///////////////////////////////////////////////////////////////////////////////////////
Delete Product (Admin Only) ****

Method: DELETE

URL: /api/products/:id

Headers: Authorization: Bearer <admin-token>

Response: Confirmation of deletion
///////////////////////////////////////////////////////////////////////////////////////
Upload Routes
Upload Image (Admin Only) ****

Method: POST

URL: /api/uploads

Headers: Authorization: Bearer <admin-token>

Body (form-data): Key = image, Value = file

Response: Returns uploaded image URL and public_id