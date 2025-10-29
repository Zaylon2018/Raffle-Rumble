import express from "express";
const router = express.Router();

// Temporary fake data (you can later replace with DB data)
const raffles = [
  { id: 1, title: "PS5 Giveaway", price: 10, image: "/images/ps5.jpg" },
  { id: 2, title: "MacBook Air", price: 15, image: "/images/macbook.jpg" },
  { id: 3, title: "iPhone 15 Pro", price: 20, image: "/images/iphone15.jpg" },
];

// GET all raffles
router.get("/", (req, res) => {
  res.json(raffles);
});

export default router;
