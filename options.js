var nextTab = "nextTab";
var prevTab = "prevTab";

function showValue(someValue) {
    someValue = JSON.parse(someValue);
    let output = "";

    if (someValue["savedValue"] == nextTab) {
        output = "the next tab";
    }
    else if (someValue["savedValue"] == prevTab) {
        output = "the previous tab";
    }
    else {
        output = "error";
    }

    document.getElementById("currentValue").innerText = `Current value: ${output}`;
}

function saveOptions(someValue) {
    browser.storage.local.set({
        savedValue: someValue
    });

    showValue(someValue);
}

function restoreOptions() {
    var storageItem = browser.storage.local.get('savedValue');

    storageItem.then((res) => {
        if (res["savedValue"] == undefined) {
            saveOptions(nextTab);
        }
        else {
            showValue(JSON.stringify(res));
        }
    });
}

function createClickHandler() {
    const btn = document.querySelector('#saveButton');
    const radioButtons = document.querySelectorAll('input[name="myButtons"]');

    btn.addEventListener("click", () => {
        let selectedValue;

        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                selectedValue = radioButton.value;
                saveOptions(selectedValue);
                return;
            }
        }
    });
}

createClickHandler();

document.addEventListener('DOMContentLoaded', restoreOptions);
