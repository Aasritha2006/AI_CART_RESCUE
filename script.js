const scenarios = {};
let currentScenario = "payment";
let quantity = 1;
let customerId = "CR-1024";

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json();
}

function scrollToCart() {
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
}

function renderScenario(type) {
  const d = scenarios[type];
  if (!d) return;

  currentScenario = type;
  document.getElementById("rescueTitle").textContent = d.title;
  document.getElementById("problemIcon").textContent = d.icon;
  document.getElementById("problemText").textContent = d.problem;
  document.getElementById("problemDescription").textContent = d.description;
  document.getElementById("confidence").textContent = d.confidence + "%";
  document.getElementById("confidenceBar").style.width = d.confidence + "%";
  document.getElementById("solutionIcon").textContent = d.solutionIcon;
  document.getElementById("solutionTitle").textContent = d.solutionTitle;
  document.getElementById("solutionDescription").textContent = d.solutionDescription;
  document.getElementById("rescueButton").textContent = d.button;
  document.getElementById("whyText").textContent = d.why;
  document.getElementById("notificationText").textContent = d.notification;
  document.getElementById("heroProblem").textContent = d.problem;
  document.getElementById("heroSolution").textContent = d.solutionTitle;
}

async function simulate(type, button) {
  document.querySelectorAll(".scenario").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  renderScenario(type);
  showToast("AI detected: " + scenarios[type].problem);
}

async function applyRescue() {
  try {
    const result = await api("/api/rescue", {
      method: "POST",
      body: JSON.stringify({ customerId, scenario: currentScenario })
    });

    if (currentScenario === "shipping") {
      document.getElementById("shipping").textContent = "₹49";
    }

    if (currentScenario === "price") {
      document.getElementById("discount").textContent = "-₹165";
    }

    updateTotal();
    await loadDashboard();
    await loadHistory();
    showToast("✓ " + result.rescue.solutionTitle + " applied and saved to backend.");
  } catch (error) {
    showToast("Backend error: " + error.message);
  }
}

function changeQty(value) {
  quantity += value;
  if (quantity < 1) quantity = 1;
  if (quantity > 5) quantity = 5;

  document.getElementById("quantity").textContent = quantity;
  document.getElementById("productPrice").textContent =
    "₹" + (2499 * quantity).toLocaleString("en-IN");

  updateTotal();
}

function updateTotal() {
  const subtotal = 2499 * quantity + 699;
  const shipping = currentScenario === "shipping" ? 49 : 99;
  const discount = document.getElementById("discount").textContent.includes("165") ? 165 : 0;

  document.getElementById("subtotal").textContent = "₹" + subtotal.toLocaleString("en-IN");
  document.getElementById("shipping").textContent = "₹" + shipping.toLocaleString("en-IN");
  document.getElementById("total").textContent =
    "₹" + (subtotal + shipping - discount).toLocaleString("en-IN");
}

async function checkout() {
  try {
    const result = await api("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        customerId,
        cart: { quantity }
      })
    });

    await loadDashboard();
    await loadHistory();
    showToast("🎉 Checkout completed. ₹" + result.amount.toLocaleString("en-IN") + " recorded.");
  } catch (error) {
    showToast("Backend error: " + error.message);
  }
}

async function selectPayment(el) {
  document.querySelectorAll(".payment-option").forEach(x => x.classList.remove("selected"));
  el.classList.add("selected");

  const method = el.querySelector("strong").textContent;

  try {
    const result = await api("/api/payment", {
      method: "POST",
      body: JSON.stringify({ method })
    });
    showToast(result.message);
  } catch (error) {
    showToast("Backend error: " + error.message);
  }
}

async function selectDelivery(el) {
  document.querySelectorAll(".delivery-option").forEach(x => x.classList.remove("selected-delivery"));
  el.classList.add("selected-delivery");

  const type = el.querySelector("strong").textContent;

  try {
    const result = await api("/api/delivery", {
      method: "POST",
      body: JSON.stringify({ type })
    });
    showToast(result.message);
  } catch (error) {
    showToast("Backend error: " + error.message);
  }
}

async function sendNotification() {
  try {
    const message = document.getElementById("notificationText").textContent;

    const result = await api("/api/notification", {
      method: "POST",
      body: JSON.stringify({ customerId, message })
    });

    showToast(result.message);
  } catch (error) {
    showToast("Backend error: " + error.message);
  }
}

async function loadDashboard() {
  try {
    const data = await api("/api/dashboard");

    document.getElementById("totalCarts").textContent =
      data.stats.totalCarts.toLocaleString("en-IN");
    document.getElementById("abandonedCarts").textContent =
      data.stats.abandonedCarts.toLocaleString("en-IN");
    document.getElementById("recoveredCarts").textContent =
      data.stats.recoveredCarts.toLocaleString("en-IN");

    const revenue = data.stats.revenueRecovered;
    document.getElementById("revenue").textContent =
      "₹" + (revenue / 100000).toFixed(2) + "L";

    document.getElementById("recoveryRate").textContent = data.analytics.recoveryRate;
  } catch (error) {
    showToast("Could not connect to backend.");
  }
}

async function loadHistory() {
  try {
    const history = await api("/api/history");
    const table = document.getElementById("historyTable");
    table.innerHTML = "";

    history.slice(0, 8).forEach(item => {
      const row = document.createElement("tr");
      const statusClass = item.result === "Recovered" || item.result === "Rescued"
        ? "recovered"
        : "pending";

      row.innerHTML = `
        <td>${item.customerId}</td>
        <td>${item.problem}</td>
        <td>${item.action}</td>
        <td><span class="status ${statusClass}">${item.result}</span></td>
      `;

      table.appendChild(row);
    });
  } catch (error) {
    showToast("Could not load rescue history.");
  }
}

async function refreshAnalytics() {
  await loadDashboard();
  await loadHistory();
  showToast("Analytics refreshed from backend.");
}

document.getElementById("themeBtn").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  this.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.querySelector("p").textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

async function initApp() {
  try {
    const data = await api("/api/scenarios");
    Object.assign(scenarios, data);

    renderScenario("payment");
    updateTotal();
    await loadDashboard();
    await loadHistory();
  } catch (error) {
    showToast("Start the Node.js backend with: npm install && npm start");
  }
}

document.addEventListener("DOMContentLoaded", initApp);