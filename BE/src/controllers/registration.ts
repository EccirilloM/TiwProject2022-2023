import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// simple email validation
const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// Registration Controller
export const registration = async (req, res) => {
  try {
    let { username, password, email } = req.body;

    username = username.trim(); // trim the username

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: password,
        email: email,
      },
    });

    // Create JWT payload
    const payload = {
      id: newUser.id,
      username: newUser.username,
    };

    // Sign the payload and create a JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.status(201).json({
      message: "Registration successful",
      token: token, // Include the JWT token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
