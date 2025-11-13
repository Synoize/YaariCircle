import express from 'express'

import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/auth-admin.js';
import { addDeliveryDate, addNewClient, addNewUser, adminDashboard, allClients, allOrders, allProducts, allUsers, rejectClientStatus, verifyClientStatus } from '../controllers/admin-controller.js';

const adminRouter = express.Router();

adminRouter.patch('/verify-client', authAdmin, verifyClientStatus);
adminRouter.patch('/reject-client', authAdmin, rejectClientStatus);
adminRouter.post("/add-user", authAdmin, addNewUser);
adminRouter.post('/add-client', authAdmin, upload.single('image'), addNewClient);
adminRouter.get('/all-clients', authAdmin, allClients);
adminRouter.get('/all-users', authAdmin, allUsers);
adminRouter.get('/all-orders', authAdmin, allOrders);
adminRouter.get('/all-products', authAdmin, allProducts);
adminRouter.get('/dashboard', authAdmin, adminDashboard);
adminRouter.patch('/delivery', authAdmin, addDeliveryDate)

export default adminRouter