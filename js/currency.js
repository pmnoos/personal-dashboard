// ===== CURRENCY =====
const CURRENCY_API_URL = "https://api.frankfurter.app/latest?from=GBP&to=AUD";

function renderCurrencySkeleton() {
  const content = document.getElementById("currency-content");
  if (!content) return;

  content.innerHTML = `
    <p class="currency-status" id="currency-status">Loading latest rate...</p>
    <div class="currency-rate" id="currency-rate">1 GBP = ... AUD</div>
    <div class="currency-converter">
      <input type="number" id="currency-amount" min="0" step="0.01" value="1" />
      <select id="currency-from">
        <option value="GBP">GBP</option>
        <option value="AUD">AUD</option>
      </select>
      <span class="currency-arrow">→</span>
      <div class="currency-result" id="currency-result">...</div>
    </div>
  `;
}

function updateCurrencyResult(rate) {
  const amountInput = document.getElementById("currency-amount");
  const fromSelect = document.getElementById("currency-from");
  const result = document.getElementById("currency-result");
  if (!amountInput || !fromSelect || !result) return;

  const amount = Number(amountInput.value) || 0;
  const from = fromSelect.value;

  if (from === "GBP") {
    result.textContent = `${(amount * rate).toFixed(2)} AUD`;
    return;
  }

  result.textContent = `${(amount / rate).toFixed(2)} GBP`;
}

async function renderCurrencyWidget() {
  const content = document.getElementById("currency-content");
  if (!content) return;

  renderCurrencySkeleton();

  const status = document.getElementById("currency-status");
  const rateText = document.getElementById("currency-rate");
  const amountInput = document.getElementById("currency-amount");
  const fromSelect = document.getElementById("currency-from");

  try {
    const response = await fetch(CURRENCY_API_URL);
    const data = await response.json();
    const rate = data?.rates?.AUD;

    if (!rate) {
      throw new Error("Rate unavailable");
    }

    if (rateText) {
      rateText.textContent = `1 GBP = ${rate.toFixed(4)} AUD`;
    }

    if (status) {
      status.textContent = "Rate updated";
    }

    updateCurrencyResult(rate);

    amountInput?.addEventListener("input", () => updateCurrencyResult(rate));
    fromSelect?.addEventListener("change", () => updateCurrencyResult(rate));
  } catch {
    if (status) {
      status.textContent = "Could not load live rate right now.";
    }

    if (rateText) {
      rateText.textContent = "Please try again later.";
    }
  }
}

renderCurrencyWidget();
