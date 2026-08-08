# Cart Rescue 🛒🤖

> **AI Build Hackathon Project**  
> *"Don't discount blindly. Rescue intelligently."*

---

## 📌 Problem Statement

In Indian e-commerce, online shoppers abandon their shopping carts for diverse reasons:
1. **Payment Failures** (UPI timeouts, bank OTP delays)
2. **High Shipping Costs** (Surprise delivery charges at checkout)
3. **Late Delivery Dates** (Standard 3-5 days delivery is too slow)
4. **Price Checking** (Comparing prices across competing apps)
5. **COD Unavailable** (Cash on Delivery restricted in zip code)
6. **Checkout Form Friction** (Too many address fields, checkout delay)

**The Flaw in Traditional E-Commerce**: Most platforms respond to every single abandoned cart with a blanket 15–20% discount coupon code. This:
- Wastes profit margins on high-intent buyers who would have bought anyway.
- Completely fails to fix technical payment crashes or delivery speed concerns.

---

## 🚀 Solution

**Cart Rescue** is an intelligent AI-powered cart recovery system that identifies the **root cause** behind cart abandonment and recommends targeted, non-discount interventions:

- **Payment Failure** → Offer instant UPI retry / alternate payment gateway (No discount wasted).
- **High Shipping** → Offer a small ₹50 shipping cap fee (Saves ₹200+ vs product discounts).
- **Late Delivery** → Highlight Next-Day Express Delivery (Converts speed-sensitive buyers).
- **COD Unavailable** → Recommend UPI/Card with buyer protection trust assurance.
- **Price Checking** → Apply a minimal 5% personalized offer only when price sensitivity is detected.
- **Checkout Friction** → Simplify checkout with address auto-fill (Zero promotional cost).

---

## ✨ Features

- 📊 **Hackathon SaaS Dashboard**: Key metrics including Total Abandoned Carts, Recovery Rate (%), Revenue Recovered (₹), Average Cart Value, and **Discounts Avoided (₹)**.
- ⚡ **Judge Demo Mode**: 1-click test buttons for all 6 abandonment scenarios.
- 🤖 **AI Decision Engine**: Rule-based scoring engine classifying abandonment intent with confidence scores & actionable rationale.
- 🛒 **Interactive Customer Cart Panel**: Indian customer details (e.g. Aarav Sharma, Priya Patel), items, quantities, subtotal, shipping, and intent scores.
- 💳 **Payment & Delivery Widgets**: Interactive UPI, Card, NetBanking, COD, and Express Delivery selection.
- 📈 **Recovery Analytics**: Distribution breakdown charts of cart abandonment triggers.
- 📜 **MySQL Action Audit Log**: Persistent table log (`rescue_actions`) tracking every intervention in real time.
- 🔔 **Smart Notifications**: Simulated WhatsApp / SMS dispatcher for recovery alerts.
- 🌙 **Dark / Light Mode**: Sleek modern UI built with CSS variables & responsive layout.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla SaaS Theme), JavaScript (Vanilla ES6), Responsive Flexbox & CSS Grid
- **Backend**: Node.js, Express.js (REST API Architecture)
- **Database**: MySQL 8.0 / MySQL2 with Connection Pooling (`mysql2/promise`) & Auto-Schema Initialization
- **AI Decision Engine**: Modular JavaScript Engine (`backend/rescueEngine.js`)

---

## 🏗️ Architecture

```
cart-rescue/
│
├── frontend/             # Frontend Dashboard UI
│   ├── index.html        # HTML structure & components
│   ├── style.css         # Modern SaaS CSS design system
│   └── script.js         # REST API integration & UI state logic
│
├── backend/              # Node.js Express REST API Server
│   ├── server.js         # Main Express application entrypoint
│   ├── db.js             # MySQL pool & database query handlers
│   ├── rescueEngine.js   # AI decision engine module
│   └── routes/
│       └── api.js        # Express REST API routes
│
├── database/             # Database Setup & Seed Scripts
│   └── cart_rescue.sql   # MySQL database creation & seed data
│
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore configuration
├── package.json          # Project dependencies & scripts
├── server.js             # Root entrypoint wrapper
└── README.md             # Project documentation
```

---

## 🗄️ Database Structure (`cart_rescue.sql`)

Database Name: `cart_rescue`

### Tables:
1. `customers`: `customer_id` (PK), `name`, `total_purchases`, `orders`, `preferred_payment`, `purchase_intent`, `created_at`
2. `carts`: `cart_id` (PK), `customer_id` (FK), `quantity`, `subtotal`, `shipping`, `discount`, `total_amount`, `status`, `abandoned_at`, `recovered_at`
3. `rescue_actions`: `action_id` (PK), `cart_id` (FK), `customer_id` (FK), `scenario`, `problem`, `recommended_action`, `confidence`, `result`, `created_at`
4. `notifications`: `notification_id` (PK), `customer_id` (FK), `message`, `status`, `sent_at`

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/health` | GET | Health check & server status |
| `GET /api/scenarios` | GET | List all 6 AI abandonment scenarios |
| `GET /api/dashboard` | GET | Fetch dashboard metrics & active customer profile |
| `GET /api/history` | GET | Fetch recent rescue actions from MySQL |
| `POST /api/rescue` | POST | Trigger AI rescue action & record in `rescue_actions` |
| `POST /api/checkout` | POST | Complete purchase & record in `carts` (status RECOVERED) |
| `POST /api/payment` | POST | Select alternate payment method |
| `POST /api/delivery` | POST | Select delivery speed |
| `POST /api/notification` | POST | Send smart notification & record in `notifications` |

---

## 📦 How to Install & Configure MySQL

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) (v8.0+ recommended) or MySQL via XAMPP / WAMP

### 1. Install Dependencies
Run in terminal:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your MySQL credentials:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cart_rescue
```

### 3. Import MySQL Database
Option A: Via MySQL Command Line:
```bash
mysql -u root -p < database/cart_rescue.sql
```
Option B: Open MySQL Workbench or phpMyAdmin and execute the SQL statements in `database/cart_rescue.sql`.

*(Note: If MySQL credentials are not provided or MySQL server is offline during testing, Cart Rescue's built-in fallback engine automatically keeps the app 100% operational for judge demos!)*

---

## 🚀 How to Run the Application

Start the application with npm:
```bash
npm start
```
Or with node directly:
```bash
node server.js
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 💡 Example User / Judge Demo Flow

1. Open `http://localhost:3000` in browser.
2. Scroll to **JUDGE DEMO MODE** section.
3. Click **Scenario 1: Payment Failed**. Notice the AI output:
   - **Problem Detected**: Payment failed (94% Confidence)
   - **Recommended Action**: Retry UPI Payment (No discount given!)
   - **Why**: "Customer wants to buy. The issue is payment, not price."
4. Click **Retry UPI Payment →**. The action is sent via `POST /api/rescue` to Node.js backend and saved in MySQL table `rescue_actions`.
5. Scroll down to **Audit Log / Rescue History** to observe the new record.
6. Try **Scenario 2: High Shipping** or **Scenario 3: Late Delivery** to see how non-discount tactics save profit margin while driving conversion!

---

## 🔮 Future AI/ML Improvements

1. **Machine Learning Intent Scorer**: Train a XGBoost / Logistic Regression model on user clickstream data (mouse velocity, time spent on cart, tab switches) to predict exit intent before cart abandonment occurs.
2. **LLM Hyper-Personalization**: Integrate Gemini Flash API to generate dynamically personalized WhatsApp recovery messages in regional languages (Hindi, Tamil, Kannada, Marathi).
3. **Automated A/B Testing Engine**: Dynamically test alternative rescue tactics (e.g. Free gift vs Express delivery) to maximize revenue recovery.
