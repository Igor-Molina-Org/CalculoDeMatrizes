import * as OperationHelper from "./operationHelper.js";
import { customizedAlert } from "./alert.js";
import { clearNodeChildren, clearNodeValues, getAndValidateHeaderInputs } from "./domHelper.js";

const resultMatrix = document.querySelector(".resultMatrix");

export function createMatrix(matrixRows, matrixColumns, id, classList = "matrixRowDiv") {
  const matrixContainer = document.querySelector(id);
  matrixContainer.innerHTML = ""; // limpa conteúdo anterior
  for (let i = 0; i < matrixRows; i++) {
    const newRow = document.createElement("div");
    newRow.classList.add(classList);
    for (let j = 0; j < matrixColumns; j++) {
      const newColumn = document.createElement("input");
      newColumn.type = "text";
      if (classList === "resultMatrixRowDiv") {
        newColumn.readOnly = true;
        newColumn.value = "";
      } else {
        validateDecimalInputLive(newColumn); // aplica validação
      }
      newRow.appendChild(newColumn);
    }
    matrixContainer.appendChild(newRow);
  }
}

export function calculateMatrix() {
  let matrix1Container = document.querySelector(".matrix1Container");
  let matrix2Container = document.querySelector(".matrix2Container");
  let matrix1Values = [];
  let matrix2Values = [];
  let headerInputValues = getAndValidateHeaderInputs();
  let operatorContainer = document.querySelector(".operatorContainer");
  clearNodeChildren(operatorContainer);

  const operatorValue = document.createElement("input");
  operatorValue.value = headerInputValues.operator;
  operatorValue.readOnly = true;
  operatorContainer.append(operatorValue);

  if (hasEmptyFieldsInMatrix(matrix1Container) || hasEmptyFieldsInMatrix(matrix2Container)) {
    customizedAlert("Por favor, preencha todos os campos das matrizes antes de calcular.");
    return;
  }

  matrix1Container.childNodes.forEach((row) => {
    let rowValues = [];
    row.childNodes.forEach((column) => {
      rowValues.push(column.value);
    });
    matrix1Values.push(rowValues);
  });

  matrix2Container.childNodes.forEach((row) => {
    let rowValues = [];
    row.childNodes.forEach((column) => {
      rowValues.push(column.value);
    });
    matrix2Values.push(rowValues);
  });

  let operator = document.querySelector("#operator").value;

  switch (operator) {
    case "+":
      clearNodeValues(resultMatrix)
      OperationHelper.addOrSubMatrices(500, OperationHelper.operations.addition);
      break;

    case "-":
      clearNodeValues(resultMatrix)
      OperationHelper.addOrSubMatrices(500, OperationHelper.operations.subtract);
      break;

    case "*":
      clearNodeValues(resultMatrix)
      OperationHelper.multiplyMatrices(500);
      break;

    case "/":
      clearNodeValues(resultMatrix)
      OperationHelper.divideMatrices(500);
      break;
  }
}

function formatValue(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  const decimalPart = num.toString().split(".")[1];
  return decimalPart && decimalPart.length > 2 ? num.toFixed(2) : num;
}

function hasEmptyFieldsInMatrix(matrix) {
  let hasEmpty = false;

  matrix.childNodes.forEach((row) => {
    row.childNodes.forEach((column) => {
      if (column.value.trim() === "") {
        hasEmpty = true;
      }
    });
  });

  return hasEmpty;
}

function validateDecimalInputLive(input) {
  input.addEventListener("input", () => {
    let raw = input.value.replace(",", "."); // troca vírgula por ponto
    let isNegative = false;
    let hasDot = false;
    let intPart = "";
    let decPart = "";

    // Detectar e tratar o sinal negativo
    if (raw.startsWith("-")) {
      isNegative = true;
      raw = raw.slice(1); // remove o "-" para processar os números
    }

    if (raw.startsWith(".")) {
      input.value = isNegative ? "-" : "";
      return;
    }

    for (let i = 0; i < raw.length; i++) {
      const char = raw[i];

      if (char === ".") {
        if (hasDot || intPart.length > 5 || intPart.length === 0) continue;
        hasDot = true;
        continue;
      }

      if (!/[0-9]/.test(char)) continue;

      if (intPart === "0" && !hasDot) continue;

      if (!hasDot) {
        if (intPart.length < 7) {
          intPart += char;
        }
      } else {
        if (intPart.length > 5) continue;
        if (decPart.length < 2) {
          decPart += char;
        }
      }
    }

    // Caso "0" como primeiro número e sem ponto
    if (intPart.startsWith("0") && intPart.length > 1 && !hasDot) {
      intPart = "0";
    }

    let result = (isNegative ? "-" : "") + intPart;
    if (hasDot && intPart.length <= 5) {
      result += "." + decPart;
    }

    input.value = result;
  });
}
