import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import { corsOptions } from './utils/corsOptions.js';
import errorHandler from './middleware/errorHandler/index.js';
import userRoutes from './components/user/index.js';
import productRoutes from './components/product/index.js'
import categoryRoutes from './components/category/index.js'
import reviewRoutes from './components/review/index.js'
import cartRoutes from './components/cart/index.js'

dotenv.config();

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 8081;

app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header",
        'Origin, X-Requested-With, Authorization, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors(corsOptions));

app.get('/test', (_, res) => {
    res.send('API is running');
})
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/review', reviewRoutes)
app.use('/api/v1/cart', cartRoutes)

app.use(errorHandler.notFound, errorHandler.errorHandler)
server.listen(port, async () => {
    console.log(`Server is listining on port : ${port}`);
    try {
        let connect = await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected : ", connect.connection.host, connect.connection.name)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
})