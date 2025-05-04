
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../model/UserSchema.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
};

export const signIn = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await userModel.findOne({ email });
    if (userExist) return res.status(400).json({ message: "User already exists!" });

    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = await userModel.create({ name, email, password: hashedPass });

    const token = generateToken(newUser._id);
    res.status(201).json({ token, user: { id: newUser._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    const token = generateToken(user._id);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const AddWishlist = async (req, res) => {
  try {
    const wishlistId = req.body.wishlistId;
    const userId = req.user.userId; 

    if (!wishlistId) {
      return res.status(400).json({ message: "wishlistId is required" });
    }

    const userExist = await userModel.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadyAdded = userExist.wishList?.some(
      (id) => id && id.toString() === wishlistId
    );

    if (!isAlreadyAdded) {
      userExist.wishList.push(wishlistId);
      await userExist.save();
    }

    res.status(200).json({ message: "Added to Wishlist" });
    console.log("✅ Added to Wishlist");
  } catch (err) {
    console.error("❌ Wishlist Error:", err);
    res.status(500).json({ message: "Failed to add to Wishlist", error: err.message });
  }
};



export const GetWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).populate("wishList");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.wishList);
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist", error: err.message });
  }
};




export const RemoveWishlist=async(req,res)=>{
  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishList = user.wishList.filter(id => id.toString() !== req.params.productId);
    await user.save();

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist", error: err.message });
  }
};



export const MoveToCart = async (req, res) => {
  try {
    const userId = req.user.userId; 
    console.log("🛒 User ID from token:", userId); // Log userId 

    const productId = req.params.productId;
    console.log("🛍️ Product ID to move to cart:", productId); // Log productId

    const user = await userModel.findById(userId);
    if (!user) {
      console.log("❌ User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    user.wishList = user.wishList.filter((id) => id.toString() !== productId);
    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
    }

    await user.save();
    console.log("✅ Item successfully moved to cart");
    res.status(200).json({ message: "Item moved to cart" });

  } catch (err) {
    console.error("❌ moveToCart error:", err);
    res.status(500).json({ message: "Server error in moveToCart" });
  }
};





export const AddCart = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from the decoded token
    const { cartId } = req.body; // Get cartId from the request body

    if (!cartId) {
      return res.status(400).json({ message: "CartId is required" });
    }

    // Find the user by decoded userId
    const userExist = await userModel.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product is already in the cart
    const isAlreadyAdded = userExist.cart?.some(
      (id) => id && id.toString() === cartId
    );

    if (!isAlreadyAdded) {
      userExist.cart.push(cartId);
      await userExist.save();
      res.status(200).json({ message: "Added to cart" });
      console.log('✅ Added to cart successfully');
      console.log("💡 Controller sees req.user:", req.user);
    } else {
      res.status(400).json({ message: "Product already in cart" });
    }
  } catch (err) {
    console.error('❌ cart Error:', err);
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
};


export const GetCart = async (req, res) => {
  try {
    const userExist = await userModel.findById(req.user.userId).populate('cart');
    if (!userExist) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(userExist.cart);
  } catch (err) {
    console.error("cart Error:", err);
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
}; 



export const RemoveFromCart = async (req, res) => {
  try {
    //logs for detecting any err
    console.log("➡️ RemoveFromCart called");
    console.log("Product ID:", req.params.productId);
    console.log("User ID:", req.user.userId);

    const user = await userModel.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    //logs for detecting any err
    console.log("Cart before:", user.cart);

    // Remove the product ID from the cart
    user.cart = user.cart.filter(
      (id) => id.toString() !== req.params.productId
    );

    //logs for detecting any err
    console.log("Cart after:", user.cart);

    await user.save();

    res.status(200).json({ message: "Removed from cart" });
  } catch (err) {
    console.error("❌ Error in RemoveFromCart:", err);
    res.status(500).json({ message: "Error removing from cart", error: err.message });
  }
};



// export const MoveToWishlist = async (req, res) => {
//   try {
//     const { userId, productId } = req.body;

//     const userExist = await userModel.findById(userId);
//     if (!userExist) return res.status(404).json({ message: 'User not found' });

//     // Remove from cart if it exists
//     userExist.cart = userExist.cart.filter(id => id.toString() !== productId);

//     // Add to wishlist if not already present
//     if (!userExist.wishList.some(id => id.toString() === productId)) {
//       userExist.wishList.push(productId);
//     }

//     await userExist.save();
//     res.status(200).json({ message: 'Moved to wishlist' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to move to wishlist', error: err.message });
//   }
// };


export const MoveToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; // This comes from the verifyToken middleware
    console.log("🛒 User ID from token:", userId); // Log userId to ensure it's correct

    const productId = req.params.productId;
    console.log("🛍️ Product ID to move to wishlist:", productId); // Log productId

    const user = await userModel.findById(userId);
    if (!user) {
      console.log("❌ User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }
 
    // removing from cart and adding to wishlist
    user.cart = user.cart.filter((id) => id.toString() !== productId);
    if (!user.wishList.includes(productId)) {
      user.wishList.push(productId);
    }

    await user.save();
    console.log("✅ Item successfully moved to wishlist");
    res.status(200).json({ message: "Item moved to wishlist" });

  } catch (err) {
    console.error("❌ moveToWishlist error:", err);
    res.status(500).json({ message: "Server error in moveToWishlist" });
  }
};


