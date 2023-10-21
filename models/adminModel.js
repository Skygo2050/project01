const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname:{
    type: String,
    default:"",
  },
  password: {
    type: String,
    default:"",
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;