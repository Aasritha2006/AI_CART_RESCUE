# Cart Rescue - MySQL Full Stack

1. Install MySQL Server + MySQL Workbench.
2. Open `cart_rescue.sql` in MySQL Workbench and run it.
3. Copy `.env.example` to `.env`.
4. Put your MySQL password in `.env`:
   DB_PASSWORD=YOUR_MYSQL_PASSWORD
5. In VS Code terminal run:
   npm install
   npm start
6. Open http://localhost:3000
7. Test database connection at http://localhost:3000/api/health

Tables:
customers, carts, rescue_actions, notifications

Do not use Live Server. Keep the npm terminal running.
