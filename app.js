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
    total += element.price;
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
