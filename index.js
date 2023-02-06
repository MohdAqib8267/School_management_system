const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

//connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen( process.env.PORT , () => console.log(`Listening at ${process.env.PORT}`)))
  .catch((error) => console.log(error));

//middleware
app.use(bodyParser.json({limit:'30mb',urlencoded:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:'true'}));
app.use(express.json());

//routes
const AdminRoute = require('./Routes/AdminRoute');
const TeacherRoute = require('./Routes/TeacherRoute')
const Attandance = require('./Routes/AttandanceRoute')



app.use('/api/admin',AdminRoute);
app.use('/api/teacher',TeacherRoute);
app.use('/api/teacher',Attandance);
