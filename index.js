import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import CONNECTDB from './config/db.js';
import userRoutes from './routes/UserRoutes.js'; 
import productRoute from './routes/ProductRoute.js';
// import path from 'path';

dotenv.config();
const app = express();

//listening to port 5000
const PORT = 5000;

//Data connected
CONNECTDB();

app.use(express.json());

// const _dirname = path.resolve();

//Enabeling cors
app.use(cors({
  origin: "https://e-comm-frontend-plum.vercel.app",
  credentials:true
}));


//Testing api
app.get('/', (req, res) => {
  res.send('API is running');
});

// Routes
app.use('/user', userRoutes);
app.use('/products', productRoute);

// app.use(express.static(path.join(_dirname, "/frontend/dist")));
// app.get('*',(req,res)=>{
//   res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
// })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
