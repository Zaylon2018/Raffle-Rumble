import express from "express";
const router = express.Router();

const raffles = [
  { id: 1, name: "PlayStation 5", price: 10, image: "/images/ps5.jpg" },
  { id: 2, name: "iPhone 15 Pro", price: 15, image: "/images/iphone.jpg" },
  { id: 3, name: "Gaming Laptop", price: 20, image: "/images/laptop.jpg" },
];

router.get("/", (req, res) => {
  res.json(raffles);
});

export default router;
