import express from 'express';
import {
  signIn, logIn,
  AddWishlist, GetWishlist, RemoveWishlist,
  AddCart, GetCart, RemoveFromCart,
  MoveToCart, MoveToWishlist
} from '../controller/UserController.js';

import { verifyToken } from '../middleware/authMiddleware.js'; 

const route = express.Router();

// Public Routes
route.post('/signin', signIn);
route.post('/login', logIn);

// Protected Routes (user must be logged in)
route.post('/wishlist', verifyToken, AddWishlist);
route.get('/wishlisted', verifyToken, GetWishlist);
route.delete('/removeWishlist/:productId', verifyToken, RemoveWishlist);

route.post('/cart', verifyToken, AddCart);
route.get('/carts', verifyToken, GetCart);
route.delete('/removeCart/:productId', verifyToken, RemoveFromCart);

route.put('/moveToCart/:productId', verifyToken, MoveToCart);
route.put('/moveToWish/:productId', verifyToken, MoveToWishlist);

export default route;
