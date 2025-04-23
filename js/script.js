import * as DomHelper from "./Helpers/domHelper.js";

function validateInput(number) {
  number.value = number.value.replace(/[^0-9]/g, "").slice(0, 1); // mantém apenas um número
}

window.validateInput = validateInput;

DomHelper.generateMatrixButton.addEventListener("click", () =>
  DomHelper.mountMatrix()
);
