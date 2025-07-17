const submit = document.getElementById("submit");
const myForm = document.getElementById("myForm");
const query = myForm.querySelector("#query");
const consent = myForm.querySelector("#consent");
const allInputs = myForm.querySelectorAll(".text");
const radioInputs=myForm.querySelectorAll("input[type='radio']");

radioInputs.forEach(input => {
    input.addEventListener("change",addBackground);
});
submit.addEventListener("click", submitFormData);

const firstNameRegex = /^[a-zA-Z\s]{5,12}$/;
const lastNameRegex = /^[a-zA-Z\s]{5,12}$/;
const emailRegex = /^[a-zA-Z0-9+%\-]+@[a-zA-Z0-9+%\.]+\.[a-zA-Z0-9+%\-]{2,}$/;
const messageRegex = /^[a-zA-Z0-9\s]{10,}$/;

const regexObject = { firstNameRegex, lastNameRegex, emailRegex, messageRegex };
let formData = { firstName: "", lastName: "", email: "", query: "", message: "", consent: [] };

function getInputValue(input) {
    return input.value.trim();
}

function addBackground(e){
    const input=e.target;
    document.querySelectorAll(".radio-group").forEach(element => {
        element.classList.remove("bg-green200");
    });
    if(input.checked){
        input.closest(".radio-group").classList.add("bg-green200");
    }
}

function createSuccessMessage() {
    const element = document.createElement("div");
    const imageNotify = document.createElement("div");
    const image = document.createElement("img");
    const notify = document.createElement("h1");
    const message = document.createElement("p");

    element.classList.add("success-box", "bg-grey900", "p-6", "rounded-xl", "-mb-1", "z-2");
    imageNotify.classList.add("flex", "flex-row", "gap-2");
    image.setAttribute("src", "./assets/images/icon-success-check.svg");
    notify.classList.add("font-[700]", "text-xl", "text-white");
    notify.innerText = "Message Sent!"
    message.classList.add("text-green200", "font-[400]");
    message.innerText = "Thanks for completing the form. We'll be in touch soon!";

    imageNotify.appendChild(image);
    imageNotify.appendChild(notify);
    element.appendChild(imageNotify);
    element.appendChild(message)
    myForm.parentElement.insertBefore(element, myForm);

}

function createErrorElement(element) {
    let errorElement = element.closest(".input-group").querySelector(".error-msg");
    if (!errorElement) {
        errorElement = document.createElement("p");
        errorElement.classList.add("error-msg", "text-red", "italic");
        const inputGrp = element.closest(".input-group");
        inputGrp.appendChild(errorElement);
    }
}

function showErrors(element, message) {
    const errorElement = element.closest(".input-group").querySelector(".error-msg");
    errorElement.innerText = message;
    element.classList.add("border-red");
}

function clearErrors(element) {
    const errorElement = element.closest(".input-group").querySelector(".error-msg");
    errorElement.innerText = "";
    element.classList.remove("border-red");
}

function textBoxValidation(element) {
    createErrorElement(element);
    clearErrors(element);

    let regex = `${element.id}Regex`;
    formData[`${element.id}`] = getInputValue(element);

    if (!formData[`${element.id}`]) {
        showErrors(element, "This field is required");
        return false;
    }
    else if (!regexObject[regex].test(formData[`${element.id}`])) {
        showErrors(element, `please enter a valid ${element.getAttribute("name")}`);
        return false;
    }
    return true;
}

function radioBoxValidation(box) {
    createErrorElement(box);
    clearErrors(box);
    let isSelected = false;

    const elements = box.querySelectorAll("input[type='radio']");
    for (const element of elements) {
        if (element.checked) {
            formData[box.id] = element.value;
            isSelected = true;
            break;
        }
    }

    return isSelected;
}

function checkBoxValidation(box) {
    createErrorElement(box);
    clearErrors(box);
    let isSelected = false;
    formData[`${box.id}`] = [];

    const elements = box.querySelectorAll("input[type='checkbox']");
    elements.forEach(element => {
        if (element.checked) {
            formData[`${box.id}`].push(element.value);
            isSelected = true;
        }
    });

    return isSelected;
}

function validate() {
    let isValid = true;
    allInputs.forEach(element => {
        if (!textBoxValidation(element)) {
            isValid = false;
        }

    });
    if (!radioBoxValidation(query)) {
        showErrors(query, `please select a query type`);
        isValid = false;
    }
    if (!checkBoxValidation(consent)) {
        showErrors(consent, `To submit this form, please consent to being contacted`);
        isValid = false;
    }
    return isValid;
}

function submitFormData(e) {
    e.preventDefault();
    const successBox = document.querySelector(".success-box");
    if (successBox) {
        successBox.classList.add("fade-out");
        setTimeout(() => successBox.remove(), 300);
    }
    if (validate()) {
        console.log("Entered valid data");
        console.log(formData);
        setTimeout(() => {
            createSuccessMessage();
            myForm.reset();
            allInputs.forEach(input => clearErrors(input));
            clearErrors(query);
            clearErrors(consent);
            formData = { firstName: "", lastName: "", email: "", query: "", message: "", consent: [] };
        }, 5 * 100);

    }
    else {
        console.log("Entered invalid data");
    }
}