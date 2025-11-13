import express from 'express'

import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/auth-admin.js'
import { addNewProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controllers/product-controller.js';

const productRouter = express.Router()

productRouter.post('/add', authAdmin, upload.single('image'), addNewProduct);
productRouter.put('/update/:id', authAdmin, upload.single('image'), updateProduct);
productRouter.delete('/delete/:id', authAdmin, deleteProduct);
productRouter.get('/list', getAllProducts);
productRouter.get('/:id', getSingleProduct);

export default productRouter;
