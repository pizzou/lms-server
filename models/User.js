const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: String,
  role: String,
}, { collection: 'user' }); // Explicitly setting the collection name to 'user'

module.exports = mongoose.model("User", UserSchema);
