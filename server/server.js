// Force update

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. 引入 cors
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ==========================================
// 🚨 关键修正：这两行必须放在所有路由之前！
// ==========================================
app.use(cors());  // 允许跨域（必须在最前面）
app.use(express.json());

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保 uploads 文件夹存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- API 路由 ---
app.get('/api/photos', (req, res) => {
  console.log("🔥 前端成功连上后端了！"); // 这一行会在后端终端打印出来
  res.json([
    {
      id: 1,
      title: "测试星空",
      description: "这是一张测试照片",
      imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      location: [116.40, 39.90] 
    },
    {
      id: 2,
      title: "上海夜景",
      description: "外滩风光",
      imageUrl: "https://images.unsplash.com/photo-1548266652-99cfb7729e3d",
      location: [121.47, 31.23]
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});