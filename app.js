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

const result = document.querySelector(".order-items");
const orderHeader = document.querySelector(".items-header");

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
  total.textContent = `Price: $${calculateTotal(items)}`;
  orderHeader.appendChild(total);
}
renderSummary();

function calculateTotal(items) {
  let total = 0;
  items.forEach((element) => {
    total += element.price * element.quantity;
  });
  return total.toFixed(2);
}
function renderOrders() {
  items.forEach((element) => {
    const order = document.createElement("div");
    order.className = "items";
    order.innerHTML = `
<div class="items-info">
               <span>${element.image}</span>
              <div>
                <h4>${element.name}</h4>
                <p>${element.color}&bull; Qty:${element.quantity}</p>
              </div>
            </div>
            <div class="items-list">Price: $${element.price}</div>
`;
    result.appendChild(order);
  });
}
renderOrders();

let appliedPromo = null;

function calculateDiscount() {
  if (appliedPromo === null) {
    return 0;
  }
  return (Number(calculateTotal(items)) * appliedPromo.discountPercent) / 100;
}

function renderFinalTotal() {
  const selectedMethod = document.querySelector(
    'input[name="delivery_method"]:checked',
  );
  const subtotal = Number(calculateTotal(items));
  const discount = calculateDiscount();
  const fee = Number(selectedMethod.dataset.fee);
  const finalTotal = subtotal - discount + fee;

  document.querySelector(".checkout-total-amount").textContent =
    `$${finalTotal.toFixed(2)}`;

  renderBreakdown(selectedMethod, subtotal, discount, fee, finalTotal);
}

function renderBreakdown(selectedMethod, subtotal, discount, fee, finalTotal) {
  let itemCount = 0;
  items.forEach((element) => {
    itemCount += element.quantity;
  });
  const itemWord = itemCount === 1 ? "item" : "items";
  const methodName = selectedMethod
    .closest(".method-option")
    .querySelector(".method-name").textContent;

  document.getElementById("breakdown-subtotal-label").textContent =
    `Subtotal (${itemCount} ${itemWord})`;
  document.getElementById("breakdown-subtotal").textContent =
    `$${subtotal.toFixed(2)}`;

  document.getElementById("breakdown-fee-label").textContent =
    `Delivery Fee (${methodName})`;
  document.getElementById("breakdown-fee").textContent = `$${fee.toFixed(2)}`;

  document.getElementById("breakdown-total").textContent =
    `$${finalTotal.toFixed(2)}`;

  // The discount row only shows while a promo code is applied.
  document.getElementById("breakdown-discount-row").hidden =
    appliedPromo === null;
  if (appliedPromo !== null) {
    document.getElementById("breakdown-discount-label").textContent =
      `Discount (${appliedPromo.code})`;
    document.getElementById("breakdown-discount").textContent =
      `-$${discount.toFixed(2)}`;
  }
}
renderFinalTotal();

document
  .querySelector(".method-options")
  .addEventListener("change", renderFinalTotal);

const promoForm = document.getElementById("promo-form");
const promoInput = document.getElementById("promo-code");
const promoMessage = document.getElementById("promo-message");

function showPromoMessage(message, isError) {
  promoMessage.textContent = message;
  promoMessage.classList.toggle("is-error", isError);
  promoMessage.hidden = false;

  if (isError) {
    promoInput.setAttribute("aria-invalid", "true");
  } else {
    promoInput.removeAttribute("aria-invalid");
  }
}

promoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const enteredCode = promoInput.value.trim().toUpperCase();
  appliedPromo = promoCodes.find((promo) => promo.code === enteredCode) || null;
  renderFinalTotal();

  if (enteredCode === "") {
    showPromoMessage("Please enter a coupon code.", true);
  } else if (appliedPromo === null) {
    showPromoMessage("That coupon code isn't valid.", true);
  } else {
    showPromoMessage(
      `${appliedPromo.code} applied: ${appliedPromo.discountPercent}% off your items (-$${calculateDiscount().toFixed(2)}).`,
      false,
    );
  }
});

// Clear an error as soon as the user starts fixing the code.
promoInput.addEventListener("input", function () {
  if (promoInput.hasAttribute("aria-invalid")) {
    promoInput.removeAttribute("aria-invalid");
    promoMessage.hidden = true;
  }
});

const form = document.getElementById("delivery-form");
const formStatus = document.getElementById("form-status");
const formCard = document.querySelector(".card-form");
const card = document.querySelector(".card");
const cash = document.querySelector(".cash");
const cardMethod = document.querySelector(".card-method");
const cashMethod = document.querySelector(".cash-method");
const deliveryFields = [
  { id: "full-name", message: "Please enter your full name." },
  { id: "email", message: "Please enter a valid email address." },
  { id: "phone", message: "Please enter a valid phone number." },
  { id: "street-address", message: "Please enter your street address." },
];
const paymentFields = [
  {
    id: "cardnb",
    message: "Enter a card number with 12 to 19 digits.",
    isValid: (input) => /^\d{12,19}$/.test(input.value.replace(/\s/g, "")),
  },
  { id: "date", message: "Please enter a valid, unexpired card expiry date." },
  { id: "cvv", message: "Enter a CVV with 3 or 4 digits." },
];

form.noValidate = true;
formCard.noValidate = true;

const expiryInput = document.getElementById("date");
const currentMonth = new Date();
expiryInput.min = `${currentMonth.getFullYear()}-${String(
  currentMonth.getMonth() + 1,
).padStart(2, "0")}`;

function checkField(field) {
  const input = document.getElementById(field.id);
  const error = document.getElementById(field.id + "-error");

  input.value = input.value.trim();

  if (
    input.checkValidity() &&
    (!field.isValid || field.isValid(input))
  ) {
    input.removeAttribute("aria-invalid");
    error.hidden = true;
    return true;
  }

  input.setAttribute("aria-invalid", "true");
  error.textContent = field.message;
  error.hidden = false;
  return false;
}
function validate(event) {
  event.preventDefault();
  formStatus.hidden = true;

  let formIsValid = true;
  const fieldsToValidate = card.classList.contains("active")
    ? [...deliveryFields, ...paymentFields]
    : deliveryFields;
  for (const field of fieldsToValidate) {
    if (!checkField(field)) {
      formIsValid = false;
    }
  }

  if (!formIsValid) {
    document.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  if (items.length === 0) {
    formStatus.textContent =
      "Your cart is empty. Add an item before placing your order.";
    formStatus.classList.add("is-error");
    formStatus.hidden = false;
    return;
  }

  formStatus.textContent =
    "Everything looks good. Your order is ready to be placed.";
  formStatus.classList.remove("is-error");
  formStatus.hidden = false;
}

form.addEventListener("submit", validate);
formCard.addEventListener("submit", validate);
function clearFieldErrors(event) {
  const error = document.getElementById(event.target.id + "-error");

  event.target.removeAttribute("aria-invalid");
  formStatus.hidden = true;
  if (error) {
    error.hidden = true;
  }
}
form.addEventListener("input", clearFieldErrors);
formCard.addEventListener("input", clearFieldErrors);

function clearPaymentErrors() {
  for (const field of paymentFields) {
    document.getElementById(field.id).removeAttribute("aria-invalid");
    document.getElementById(field.id + "-error").hidden = true;
  }
  formStatus.hidden = true;
}

card.addEventListener("click", function () {
  clearPaymentErrors();
  cardMethod.style.display = "block"; // Shows the div
  cashMethod.style.display = "none";
  cash.classList.remove("active");
  card.classList.add("active");
});
cash.addEventListener("click", function () {
  clearPaymentErrors();
  cashMethod.style.display = "block"; // Shows the div

  cardMethod.style.display = "none";
  cash.classList.add("active");
  card.classList.remove("active");
});
