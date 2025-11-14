import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';

import authRouter from './routes/auth-route.js'
import userRouter from './routes/user-route.js';
import clientRouter from './routes/client-router.js';
import adminRouter from './routes/admin-route.js';
import orderRouter from './routes/order-route.js';
import productRouter from './routes/product-route.js';

// app config
const app = express();
const PORT = process.env.PORT || 5000
const corsOptions = {
    origin: [
        "http://localhost:5174",
        "http://localhost:5173",
        "https://yaaricircle.com/",
        "https://yaaricircle.vercel.app/",
        "https://yaaricircle-admin.vercel.app/",
    ],
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

// middlewares
app.use(express.json())
app.use(cors(corsOptions))

//api endpoints
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/client', clientRouter)
app.use('/api/admin', adminRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)


app.get('/', (req, res) => {
    res.send('API IS WORKING...')
})

const start = async () => {
    try {
        await connectDB();
        await connectCloudinary();
        app.listen(PORT, () => {
            console.log(`server is listen on PORT : ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();
