import express from 'express';
import {
  getProducts,
  getProductsByIds,
  postProduct,
  postMany,
  putProduct,
  deleteProduct,
  deleteMany
} from '../controller/ProductController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/getProductsByIds', getProductsByIds);
router.post('/post', postProduct);
router.post('/postMany', postMany);
router.put('/put/:id', putProduct);
router.delete('/delete/:id', deleteProduct);
router.delete('/deleteMany', deleteMany);
export default router;
