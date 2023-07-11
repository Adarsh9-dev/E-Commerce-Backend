# E-Commerce Backend

This project is a backend implementation for an E-commerce application. It provides APIs for managing users, products, carts, and orders. The project follows a feature-wise approach, where each feature is developed and tested individually before moving on to the next one.

## Project Structure

The project is organized into different features, including User, Product, Cart, and Order. Each feature follows a similar structure with models and corresponding API routes.

- `src/models`: Contains the Mongoose models for each feature.
- `src/routes`: Defines the API routes for each feature.
- `src/controllers`: Implements the logic for handling API requests.
- `src/services`: Contains utility functions.
- `src/middleware`: Contains middleware functions for authentication and authorization.
- `src/app.js`: Entry point of the application.

## Authentication

The project uses JWT (JSON Web Token) for authentication. To send a JWT token with a request, include it in the `Authorization` header as a Bearer token.

## Features

The project is divided into four features, and each feature follows the same development and testing process.

### Feature I - User

#### Models

- `User`: Represents a user in the system. It includes attributes such as first name, last name, email, profile image, phone number, password, address, and timestamps.

#### User APIs

- `POST /register`: Creates a new user with the provided details and saves the profile image to an S3 bucket. Returns the created user document.
- `POST /login`: Allows a user to login with their email and password. Returns a JWT token and the user ID.
- `GET /user/:userId/profile`: Retrieves the user's profile details.
- `PUT /user/:userId/profile`: Updates the user's profile details.

### Feature II - Product

#### Models

- `Product`: Represents a product in the system. It includes attributes such as title, description, price, currency, product image, style, available sizes, and timestamps.

#### Product APIs

- `POST /products`: Creates a new product with the provided details and saves the product image to an S3 bucket. Returns the created product document.
- `GET /products`: Retrieves all products based on filters and sorting options.
- `GET /products/:productId`: Retrieves a specific product by its ID.
- `PUT /products/:productId`: Updates a product with the specified ID.
- `DELETE /products/:productId`: Deletes a product with the specified ID.

### Feature III - Cart

#### Models

- `Cart`: Represents a user's shopping cart. It includes the user ID, items (product ID and quantity), total price, total items, and timestamps.

#### Cart APIs

- `POST /users/:userId/cart`: Adds a product to the user's cart or creates a new cart if it doesn't exist. Returns the updated cart document.
- `PUT /users/:userId/cart`: Updates the user's cart by removing a product or reducing its quantity. Returns the updated cart document.
- `GET /users/:userId/cart`: Retrieves the user's cart summary.
- `DELETE /users/:userId/cart`: Deletes the user's cart.

### Feature IV - Order

#### Models

- `Order`: Represents an order placed by a user. It includes the user ID, items (product ID and quantity), total price, total items, total quantity, cancellable flag, order status, and timestamps.

#### Order APIs

- `POST /users/:userId/orders`: Creates a new order for the user based on the items in their cart. Returns the created order document.
- `PUT /users/:userId/orders`: Updates the status of an order. Only cancellable orders can be canceled. Returns the updated order document.


## Contributing

Contributions to the E-Commerce Backend project are welcome. If you find any issues or want to add new features, please submit a pull request or open an issue on the GitHub repository.
