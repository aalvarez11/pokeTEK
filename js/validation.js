'use strict';
console.log("validation.js loaded");

window.onload = init;

// DOM ELEMENTS
const elements = {
    // we don't want to get the values immediately, so wrap them all in a function that can be executed on init
    collectDOM: function(){
        this.formElement = document.getElementById("register-form");
        this.formMessageElement = document.getElementById("form-error");
        this.passwordInp = document.getElementById("psw");
        this.passwordRepeatInp = document.getElementById("psw-repeat");
    }
};

function init(){
    // initialize dom elements
    elements.collectDOM();
    // attach listener to the form submit button
    elements.formElement.addEventListener("submit", validateForm);
    // we can listen on every letter...
    // elements.passwordRepeatInp.addEventListener("keyup", onPasswordRepeatLetter);
}

function onPasswordRepeatLetter(event){
    console.log(event.currentTarget);
    // check against other password
}

function validateForm(event){
    event.preventDefault();
    console.log("Form submission button clicked");
    console.log(event.currentTarget);
    // get form data from <input> tags using .value
    const passwordText = elements.passwordInp.value;
    const passwordTextRpt = elements.passwordRepeatInp.value;
    let validationText = comparePasswords(passwordText, passwordTextRpt);
    if (validationText != null){
        console.log(validationText);
        // update the DOM with an error message
        elements.formMessageElement.innerText = validationText;
    } else {
        prompt("Form data looks OK");
    }
}

function comparePasswords(passwordInput1, passwordInput2){
    console.log("P1: ", passwordInput1, ", P2", passwordInput2);
    if (passwordInput1.length < 8){
        return "Password must be at least 8 characters";
    }

    if(passwordInput2 !== passwordInput1){
        return "Passwords do no match";
    } else {
        return null;
    }
}