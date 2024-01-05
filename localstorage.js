const demoName = document.getElementById("demo");
const initFirst = localStorage.getItem("Firstname");
const initLast = localStorage.getItem("Lastname");

if (initFirst !== null && initLast !== null) {
    demoName.innerText = `${initFirst} - ${initLast}`
}

// (() => {
//     let name = localStorage.getItem("Firstname");
//     demoName.innerText = name
// })()

function getName() {
    let firstname = localStorage.getItem("Firstname");
    let lastname = localStorage.getItem("Lastname");
    demoName.innerText = `${firstname} - ${lastname}`
}

function setName() {
    const first = document.getElementById("first").value
    const last = document.getElementById("last").value
    localStorage.setItem("Firstname", first);
    localStorage.setItem("Lastname", last);
}