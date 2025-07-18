import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import { register, login, verifyCode, resendCode,resetPassword,resetPasswordLink} from './routes/authRoutes.js';
const port = process.env.PORT || 5000
const app = express()

connectDB();

app.use(cors({
  origin: ["http://localhost:5173", ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send("Welcome to the server")
})

//auth routes
app.post('/register', register);
app.post('/login', login);
app.post('/verifyCode', verifyCode);
app.post('/resendCode', resendCode);
app.post('/resetPassword',resetPassword);
app.post('/resetPasswordLink',resetPasswordLink);


app.listen(port,()=>{
    console.log(`server is running on port:${port}`)
})
