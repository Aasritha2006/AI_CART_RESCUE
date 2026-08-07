const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "database.json");

app.use(express.json());
app.use(express.static(__dirname));

function readDB() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeDB(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

const scenarios = {
  payment: {
    title: "Payment failure detected",
    icon: "💳",
    problem: "Payment failed",
    description: "The customer's previous UPI transaction was unsuccessful. A discount will not solve this problem.",
    confidence: 94,
    solutionIcon: "💳",
    solutionTitle: "Retry payment",
    solutionDescription: "Offer another UPI payment attempt instead of giving a discount.",
    button: "Retry UPI Payment →",
    why: "The customer wants to buy. The issue is payment, not price.",
    notification: "Your payment didn't go through. Try UPI again to complete your order."
  },
  shipping: {
    title: "Shipping cost detected",
    icon: "🚚",
    problem: "High shipping cost",
    description: "The customer reached checkout and noticed an unexpected shipping charge.",
    confidence: 89,
    solutionIcon: "🚚",
    solutionTitle: "Reduce shipping cost",
    solutionDescription: "Offer a small shipping incentive instead of a large product discount.",
    button: "Offer ₹50 Shipping →",
    why: "The customer is price-sensitive about delivery, not necessarily the product.",
    notification: "We found a better shipping option for your order."
  },
  delivery: {
    title: "Delivery concern detected",
    icon: "📅",
    problem: "Delivery date is too late",
    description: "The customer appears interested in the product but needs faster delivery.",
    confidence: 91,
    solutionIcon: "⚡",
    solutionTitle: "Offer express delivery",
    solutionDescription: "Show an express delivery option instead of reducing the product price.",
    button: "Show Express Delivery →",
    why: "The customer's problem is delivery speed, not product price.",
    notification: "Good news! Express delivery is available for your order."
  },
  cod: {
    title: "Payment preference detected",
    icon: "💵",
    problem: "COD unavailable",
    description: "The customer prefers cash on delivery but this payment method is unavailable.",
    confidence: 86,
    solutionIcon: "💳",
    solutionTitle: "Suggest alternative payment",
    solutionDescription: "Recommend UPI or card payment and explain the available options.",
    button: "Show Payment Options →",
    why: "The customer needs a trusted payment method, not a discount.",
    notification: "COD isn't available, but you can securely pay using UPI or card."
  },
  price: {
    title: "Price comparison detected",
    icon: "🏷️",
    problem: "Customer is price checking",
    description: "The customer may be comparing this product with another shopping app.",
    confidence: 78,
    solutionIcon: "🎁",
    solutionTitle: "Personalized offer",
    solutionDescription: "Offer a small targeted incentive only when price sensitivity is detected.",
    button: "Apply 5% Offer →",
    why: "A targeted offer can protect margin better than a blanket discount.",
    notification: "We've unlocked a small personalized offer for your cart."
  },
  form: {
    title: "Checkout friction detected",
    icon: "📝",
    problem: "Checkout form friction",
    description: "The customer spent too long completing checkout fields.",
    confidence: 83,
    solutionIcon: "⚡",
    solutionTitle: "Simplify checkout",
    solutionDescription: "Reduce unnecessary fields and guide the customer to completion.",
    button: "Simplify Checkout →",
    why: "The customer needs less friction, not a lower price.",
    notification: "We've simplified checkout so you can complete your order faster."
  }
};

function cartTotal(cart) {
  const quantity = Number(cart.quantity || 1);
  return 2499 * quantity + 699;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "Cart Rescue API", time: new Date().toISOString() });
});

app.get("/api/scenarios", (req, res) => {
  res.json(scenarios);
});

app.get("/api/dashboard", (req, res) => {
  const db = readDB();
  const recoveryRate = db.stats.abandonedCarts
    ? ((db.stats.recoveredCarts / db.stats.abandonedCarts) * 100).toFixed(1)
    : "0.0";

  res.json({
    stats: db.stats,
    analytics: {
      recoveryRate: `${recoveryRate}%`,
      averageCartValue: "₹2,840",
      discountsSaved: "₹48,720",
      aiInterventions: db.history.length + 820
    },
    customer: db.customer
  });
});

app.get("/api/history", (req, res) => {
  const db = readDB();
  res.json(db.history);
});

app.post("/api/rescue", (req, res) => {
  const { customerId = "CR-1024", scenario = "payment" } = req.body;
  const selected = scenarios[scenario];

  if (!selected) {
    return res.status(400).json({ error: "Unknown scenario" });
  }

  const db = readDB();
  const item = {
    id: Date.now(),
    customerId,
    problem: selected.problem,
    action: selected.solutionTitle,
    scenario,
    result: "Rescued",
    createdAt: new Date().toISOString()
  };

  db.history.unshift(item);
  db.stats.aiInterventions += 1;
  writeDB(db);

  res.json({
    success: true,
    rescue: selected,
    historyItem: item,
    stats: db.stats
  });
});

app.post("/api/checkout", (req, res) => {
  const db = readDB();
  const { customerId = "CR-1024", cart = { quantity: 1 } } = req.body;
  const amount = cartTotal(cart);

  db.stats.recoveredCarts += 1;
  db.stats.revenueRecovered += amount;

  const item = {
    id: Date.now(),
    customerId,
    problem: "Checkout completed",
    action: "Purchase completed",
    scenario: "checkout",
    result: "Recovered",
    amount,
    createdAt: new Date().toISOString()
  };

  db.history.unshift(item);
  writeDB(db);

  res.json({ success: true, amount, stats: db.stats, historyItem: item });
});

app.post("/api/notification", (req, res) => {
  const { customerId = "CR-1024", message = "Your cart is waiting for you." } = req.body;
  const db = readDB();

  db.notifications.unshift({
    id: Date.now(),
    customerId,
    message,
    sentAt: new Date().toISOString(),
    status: "sent"
  });

  writeDB(db);
  res.json({ success: true, message: "Smart notification sent." });
});

app.post("/api/payment", (req, res) => {
  const { method = "UPI" } = req.body;
  res.json({
    success: true,
    method,
    status: "ready",
    message: `${method} payment option selected.`
  });
});

app.post("/api/delivery", (req, res) => {
  const { type = "Express Delivery" } = req.body;
  res.json({
    success: true,
    delivery: type,
    price: type.includes("Express") ? 149 : 0,
    message: `${type} selected.`
  });
});

app.listen(PORT, () => {
  console.log(`Cart Rescue running at http://localhost:${PORT}`);
});
