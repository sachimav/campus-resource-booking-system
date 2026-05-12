import bcrypt from "bcrypt";
import User from "../models/user.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.json({ message: "User created", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  req.session.user = {
    id: user._id,
    role: user.role,
  };

  res.json({ message: "Login successful" });
};

export const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
};