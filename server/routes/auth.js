import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateSignup, EMAIL_RE } from "../validators.js";

const router = Router();

function makeToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(u) {
  return { id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role };
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const errors = validateSignup(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: "Please fix the errors", errors });

  const email = req.body.email.toLowerCase().trim();
  if (await User.findOne({ email }))
    return res.status(409).json({ message: "Email already registered", errors: { email: "Email already registered" } });

  const isAdmin = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.toLowerCase();
  const user = await User.create({
    name: req.body.name.trim(),
    email,
    phone: req.body.phone,
    password: await bcrypt.hash(req.body.password, 10),
    role: isAdmin ? "admin" : "user",
  });
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !EMAIL_RE.test(email) || !password)
    return res.status(400).json({ message: "Enter your email and password" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Incorrect email or password" });

  res.json({ token: makeToken(user), user: publicUser(user) });
});

export default router;
