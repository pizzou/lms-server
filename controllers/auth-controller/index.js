const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    // Ensure email is not null or empty
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password and save new user
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      userEmail,
      role,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Registration Error:", error); // Log the error to see what's wrong
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message, // Add error message to response
    });
  }
};




// Login User
const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    // Check if user exists
    const checkUser = await User.findOne({ userEmail });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT
    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      process.env.JWT_SECRET || "your_jwt_secret", // Use a secret from the environment
      { expiresIn: "120m" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error); // Log the error
    return res.status(500).json({
      success: false,
      message: "Error logging in user",
      error: error.message, // Optional: include error message for debugging
    });
  }
};

module.exports = { registerUser, loginUser };
