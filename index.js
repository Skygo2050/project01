const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const projRoute = require('./routes/projectRoutes')

dotenv.config();

const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Default route
app.get('/', (req, res) => {
    const message = {
      status: 'success',
      code: 200,
      message: 'Welcome To Project',
      data: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Not connected to MongoDB',
    };
  
    res.status(200).json(message);
  });


//routes
app.use('/api',projRoute)  



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});