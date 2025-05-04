import productModel from '../model/ProductSchema.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const getProduct = await productModel.find();
    res.status(200).json(getProduct);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


// Get products by IDs
export const getProductsByIds = async (req, res) => {
  const { productIds } = req.body;
  try {
    const products = await productModel.find({ '_id': { $in: productIds } });
    if (products.length === 0) return res.status(404).json({ message: 'No products found.' });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};


// Add single product
export const postProduct = async (req, res) => {
  try {
    const { name, description, image, price } = req.body;
    const newProduct = new productModel({ name, description, image, price });
    await newProduct.save();
    res.json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add multiple products
export const postMany = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "Request body should be an array of products." });
    }
    const newProduct = await productModel.insertMany(req.body);
    res.json({ message: "Product added!!", newProduct });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Update product
export const putProduct = async (req, res) => {
  try {
    const updateProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updateProduct) return res.json('Product not found');
    res.json(updateProduct);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Delete single product
export const deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deleteProduct) return res.json('Product not found');
    res.json('Product deleted successfully');
  } catch (err) {
    res.json(err.message);
  }
};

// Delete all
export const deleteMany = async (req, res) => {
  try {
    await productModel.deleteMany({});
    res.json({ message: "All products deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



 
  