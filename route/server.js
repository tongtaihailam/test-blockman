const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Kết nối MongoDB
mongoose.connect("mongodb://0.0.0.0:27017/blockmango", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema người dùng
const userSchema = new mongoose.Schema({
  userId: String,
  nickName: String,
  password: String,
  telephone: String,
  birthday: String,
  vip: Number,
  golds: Number,
  diamonds: Number,
  hasPassword: Boolean,
  picType: Number,
  picUrl: String,
  sex: Number,
  details: String,
});

const User = mongoose.model("register", userSchema);

//
// ======= API: Register =======
//
app.post("/register", async (req, res) => {
  const { userId, nickName, password, telephone } = req.body;

  const existing = await User.findOne({ userId });
  if (existing) return res.status(400).json({ message: "Tài khoản đã tồn tại." });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    userId,
    nickName,
    password: hashedPassword,
    telephone,
    birthday: "2000-01-01",
    vip: 0,
    golds: 0,
    diamonds: 0,
    hasPassword: true,
    picType: 0,
    picUrl: "",
    sex: 1,
    details: "",
  });

  await newUser.save();
  res.status(201).json({ message: "Đăng ký thành công!" });
});

//
// ======= API: Login =======
//
app.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ userId });
  if (!user) return res.status(404).json({ message: "Tài khoản không tồn tại." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu." });

  res.json({ message: "Đăng nhập thành công!", user: user.nickName });
});

//
// ======= Khởi chạy server =======
//
app.listen(3000, () => {
  console.log("Server đang chạy tại http://localhost:3000");
});
