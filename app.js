const items = [
    { name: "Item 1", price: 10.99, quantity: 1 },
    { name: "Item 2", price: 5.49, quantity: 2 },
    { name: "Item 3", price: 20.00, quantity: 1 }
];

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
