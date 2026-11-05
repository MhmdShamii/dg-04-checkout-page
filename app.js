const items = [
  {
    image: "🎧",
    name: "Aura Noise-Cancelling Headphones",
    price: 10.99,
    quantity: 1,
    color: "Space Gray",
  },
  {
    image: "🖱️",
    name: "Minimalist Ergonomic Mouse",
    price: 5.49,
    quantity: 2,
    color: "Matte Black",
  },
  {
    image: "⚡",
    name: "Braided USB-C Fast Cable (2m)",
    price: 20.0,
    quantity: 1,
    color: "Navy Blue",
  },
];

const promoCodes = [
  { code: "SAVE10", discountPercent: 10 },
  { code: "WELCOME10", discountPercent: 10 },
  { code: "SAVE15", discountPercent: 15 },
  { code: "SAVE20", discountPercent: 20 },
  { code: "HELLO5", discountPercent: 5 },
  { code: "VIP25", discountPercent: 25 },
];

// ---------- Page elements ----------

const result = document.querySelector(".order-items");
const orderHeader = document.querySelector(".items-header");
const standardRadio = document.querySelector("#standard-radio");
const expressRadio = document.querySelector("#express-radio");
const promoForm = document.querySelector("#promo-form");
const promoInput = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");
const form = document.querySelector("#delivery-form");
const formCard = document.querySelector(".card-form");
const formStatus = document.querySelector("#form-status");
const card = document.querySelector(".card");
const cash = document.querySelector(".cash");
const cardMethod = document.querySelector(".card-method");
const cashMethod = document.querySelector(".cash-method");

// ---------- Values that change while the page is open ----------

let appliedPromo = null;
let paymentMethod = "card";

// ---------- Order items ----------

function calculateTotal() {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }
  return total;
}

function countItems() {
  let count = 0;
  for (let i = 0; i < items.length; i++) {
    count = count + items[i].quantity;
  }
  return count;
}

function renderSummary() {
  const summary = document.createElement("div");
  summary.className = "items-info";
  summary.innerHTML = `
    <i class="fa-solid fa-shopping-cart" aria-hidden="true"></i>
    <div>
      <h3>Order Summary</h3>
      <p>${items.length} items in cart</p>
    </div>
  `;
  orderHeader.appendChild(summary);

  const total = document.createElement("div");
  total.className = "items-list";
  total.textContent = "Price: $" + calculateTotal().toFixed(2);
  orderHeader.appendChild(total);
}

function renderOrders() {
  for (let i = 0; i < items.length; i++) {
    const order = document.createElement("div");
    order.className = "items";
    order.innerHTML = `
      <div class="items-info">
        <span>${items[i].image}</span>
        <div>
          <h4>${items[i].name}</h4>
          <p>${items[i].color}&bull; Qty:${items[i].quantity}</p>
        </div>
      </div>
      <div class="items-list">Price: $${items[i].price}</div>
    `;
    result.appendChild(order);
  }
}

// ---------- Totals ----------

function getDeliveryFee() {
  if (expressRadio.checked) {
    return 10;
  }
  return 5;
}

function getDeliveryName() {
  if (expressRadio.checked) {
    return "Express";
  }
  return "Standard";
}

function calculateDiscount() {
  if (appliedPromo === null) {
    return 0;
  }
  return (calculateTotal() * appliedPromo.discountPercent) / 100;
}

function renderFinalTotal() {
  const subtotal = calculateTotal();
  const discount = calculateDiscount();
  const fee = getDeliveryFee();
  const finalTotal = subtotal - discount + fee;

  document.querySelector(".checkout-total-amount").textContent =
    "$" + finalTotal.toFixed(2);

  renderBreakdown(subtotal, discount, fee, finalTotal);
}

function renderBreakdown(subtotal, discount, fee, finalTotal) {
  let itemWord = "items";
  if (countItems() === 1) {
    itemWord = "item";
  }

  document.querySelector("#breakdown-subtotal-label").textContent =
    "Subtotal (" + countItems() + " " + itemWord + ")";
  document.querySelector("#breakdown-subtotal").textContent =
    "$" + subtotal.toFixed(2);

  document.querySelector("#breakdown-fee-label").textContent =
    "Delivery Fee (" + getDeliveryName() + ")";
  document.querySelector("#breakdown-fee").textContent = "$" + fee.toFixed(2);

  document.querySelector("#breakdown-total").textContent =
    "$" + finalTotal.toFixed(2);

  // The discount row only shows while a promo code is applied.
  const discountRow = document.querySelector("#breakdown-discount-row");
  if (appliedPromo === null) {
    discountRow.hidden = true;
  } else {
    discountRow.hidden = false;
    document.querySelector("#breakdown-discount-label").textContent =
      "Discount (" + appliedPromo.code + ")";
    document.querySelector("#breakdown-discount").textContent =
      "-$" + discount.toFixed(2);
  }
}

// ---------- Promo code ----------

function findPromo(code) {
  for (let i = 0; i < promoCodes.length; i++) {
    if (promoCodes[i].code === code) {
      return promoCodes[i];
    }
  }
  return null;
}

function showPromoSuccess(message) {
  promoMessage.textContent = message;
  promoMessage.classList.remove("is-error");
  promoMessage.hidden = false;
  promoInput.removeAttribute("aria-invalid");
}

function showPromoError(message) {
  promoMessage.textContent = message;
  promoMessage.classList.add("is-error");
  promoMessage.hidden = false;
  promoInput.setAttribute("aria-invalid", "true");
}

function applyPromo(event) {
  event.preventDefault();

  const enteredCode = promoInput.value.trim().toUpperCase();
  appliedPromo = findPromo(enteredCode);
  renderFinalTotal();

  if (enteredCode === "") {
    showPromoError("Please enter a coupon code.");
  } else if (appliedPromo === null) {
    showPromoError("That coupon code isn't valid.");
  } else {
    showPromoSuccess(
      appliedPromo.code +
        " applied: " +
        appliedPromo.discountPercent +
        "% off your items (-$" +
        calculateDiscount().toFixed(2) +
        ").",
    );
  }
}

// Removes the promo error as soon as the user starts fixing the code.
function clearPromoError() {
  if (promoMessage.classList.contains("is-error")) {
    promoMessage.hidden = true;
    promoInput.removeAttribute("aria-invalid");
  }
}

// ---------- Form errors ----------

function showError(id, message) {
  const input = document.querySelector("#" + id);
  const error = document.querySelector("#" + id + "-error");
  input.setAttribute("aria-invalid", "true");
  error.textContent = message;
  error.hidden = false;
}

function hideError(id) {
  const input = document.querySelector("#" + id);
  const error = document.querySelector("#" + id + "-error");
  input.removeAttribute("aria-invalid");
  error.hidden = true;
}

// checkValidity() is built into the browser. It checks the rules written on
// the input in the HTML, like required, type="email" and pattern.
function checkField(id, message) {
  const input = document.querySelector("#" + id);
  input.value = input.value.trim();

  if (input.checkValidity()) {
    hideError(id);
    return true;
  }
  showError(id, message);
  return false;
}

function checkCardNumber() {
  const input = document.querySelector("#cardnb");
  input.value = input.value.trim();
  const digits = input.value.replaceAll(" ", "");

  if (input.checkValidity() && digits.length >= 12 && digits.length <= 19) {
    hideError("cardnb");
    return true;
  }
  showError("cardnb", "Enter a card number with 12 to 19 digits.");
  return false;
}

// ---------- Place Order ----------

function checkDeliveryFields() {
  const nameOk = checkField("full-name", "Please enter your full name.");
  const emailOk = checkField("email", "Please enter a valid email address.");
  const phoneOk = checkField("phone", "Please enter a valid phone number.");
  const addressOk = checkField(
    "street-address",
    "Please enter your street address.",
  );
  return nameOk && emailOk && phoneOk && addressOk;
}

function checkCardFields() {
  const numberOk = checkCardNumber();
  const dateOk = checkField(
    "date",
    "Please enter a valid, unexpired card expiry date.",
  );
  const cvvOk = checkField("cvv", "Enter a CVV with 3 or 4 digits.");
  return numberOk && dateOk && cvvOk;
}

function showStatus(message, isError) {
  formStatus.textContent = message;
  if (isError) {
    formStatus.classList.add("is-error");
  } else {
    formStatus.classList.remove("is-error");
    receipt();
  }
  formStatus.hidden = false;
}
function receipt() {
  document.querySelector("#receipt-total").textContent =
    document.querySelector(".checkout-total-amount").textContent;
  document.querySelector("#receipt").showModal();
}
function validate(event) {
  event.preventDefault();
  formStatus.hidden = true;

  let formIsValid = checkDeliveryFields();
  if (paymentMethod === "card") {
    const cardIsValid = checkCardFields();
    formIsValid = formIsValid && cardIsValid;
  }

  if (!formIsValid) {
    document.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  if (items.length === 0) {
    showStatus(
      "Your cart is empty. Add an item before placing your order.",
      true,
    );
    return;
  }

  showStatus("Everything looks good. Your order is ready to be placed.", false);
}

// Removes a field's error as soon as the user types in it.
function clearErrorWhenTyping(id) {
  document.querySelector("#" + id).addEventListener("input", function () {
    hideError(id);
    formStatus.hidden = true;
  });
}

// ---------- Card or cash ----------

function clearCardErrors() {
  hideError("cardnb");
  hideError("date");
  hideError("cvv");
  formStatus.hidden = true;
}

function selectCard() {
  paymentMethod = "card";
  clearCardErrors();
  cardMethod.style.display = "block";
  cashMethod.style.display = "none";
  card.classList.add("active");
  cash.classList.remove("active");
}

function selectCash() {
  paymentMethod = "cash";
  clearCardErrors();
  cardMethod.style.display = "none";
  cashMethod.style.display = "block";
  card.classList.remove("active");
  cash.classList.add("active");
}

// The card expiry date can't be before this month. The input needs the
// format "2026-11", so months below 10 get a 0 in front.
function setEarliestExpiry() {
  const today = new Date();
  let month = today.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  document.querySelector("#date").min = today.getFullYear() + "-" + month;
}

// ---------- Listeners ----------

standardRadio.addEventListener("change", renderFinalTotal);
expressRadio.addEventListener("change", renderFinalTotal);

promoForm.addEventListener("submit", applyPromo);
promoInput.addEventListener("input", clearPromoError);

form.addEventListener("submit", validate);
formCard.addEventListener("submit", validate);

card.addEventListener("click", selectCard);
cash.addEventListener("click", selectCash);

clearErrorWhenTyping("full-name");
clearErrorWhenTyping("email");
clearErrorWhenTyping("phone");
clearErrorWhenTyping("street-address");
clearErrorWhenTyping("cardnb");
clearErrorWhenTyping("date");
clearErrorWhenTyping("cvv");

// ---------- Run when the page opens ----------

renderSummary();
renderOrders();
renderFinalTotal();
setEarliestExpiry();
