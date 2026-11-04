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

function renderFinalTotal() {
  const selectedMethod = document.querySelector('input[name="delivery_method"]:checked');
  const finalTotal = Number(calculateTotal(items)) + Number(selectedMethod.dataset.fee);

  document.querySelector(".checkout-total-amount").textContent = `$${finalTotal.toFixed(2)}`;
}
renderFinalTotal();

document.querySelector(".method-options").addEventListener("change", renderFinalTotal);

const form = document.getElementById("delivery-form");
const formStatus = document.getElementById("form-status");

const fields = [
    { id: "full-name", message: "Please enter your full name." },
    { id: "email", message: "Please enter a valid email address." },
    { id: "phone", message: "Please enter a valid phone number." },
    { id: "street-address", message: "Please enter your street address." }
];

form.noValidate = true;

function checkField(field) {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.id + "-error");

    input.value = input.value.trim();

    if (input.checkValidity()) {
        input.removeAttribute("aria-invalid");
        error.hidden = true;
        return true;
    }

    input.setAttribute("aria-invalid", "true");
    error.textContent = field.message;
    error.hidden = false;
    return false;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    formStatus.hidden = true;

    let formIsValid = true;
    for (const field of fields) {
        if (!checkField(field)) {
            formIsValid = false;
        }
    }

    if (!formIsValid) {
        form.querySelector('[aria-invalid="true"]').focus();
        return;
    }

    if (items.length === 0) {
        formStatus.textContent = "Your cart is empty. Add an item before placing your order.";
        formStatus.classList.add("is-error");
        formStatus.hidden = false;
        return;
    }

    formStatus.textContent = "Everything looks good. Your order is ready to be placed.";
    formStatus.classList.remove("is-error");
    formStatus.hidden = false;
});

form.addEventListener("input", function (event) {
    const error = document.getElementById(event.target.id + "-error");

    event.target.removeAttribute("aria-invalid");
    formStatus.hidden = true;
    if (error) {
        error.hidden = true;
    }
});
