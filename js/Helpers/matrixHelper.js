import * as OperationHelper from "./operationHelper.js";
import { customizedAlert } from "./alert.js";
import { clearNodeChildren, getAndValidateHeaderInputs } from "./domHelper.js";

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
        newColumn.value = j.toString(); // valor inicial (0 a n)
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
      let sum = OperationHelper.addMatrices(matrix1Values, matrix2Values);

      for (let i = 0; i < matrix1Values.length; i++) {
        let row = document.querySelector(
          `.resultMatrix div:nth-child(${i + 1})`
        );
        for (let j = 0; j < matrix1Values[i].length; j++) {
          let column = row.querySelector(
            `.resultMatrixRowDiv input:nth-child(${j + 1})`
          );
          column.value = formatValue(sum[i][j]);
        }
      }
      break;

    case "-":
      let sub = OperationHelper.subtractMatrices(matrix1Values, matrix2Values);

      for (let i = 0; i < matrix1Values.length; i++) {
        let row = document.querySelector(
          `.resultMatrix div:nth-child(${i + 1})`
        );
        for (let j = 0; j < matrix1Values[i].length; j++) {
          let column = row.querySelector(
            `.resultMatrixRowDiv input:nth-child(${j + 1})`
          );
          column.value = formatValue(sub[i][j]);
        }
      }
      break;

    case "*":
      const rowsMatrix1 = matrix1Values.length;
      const columnsMatrix2 = matrix2Values[0].length;

      let multiplication = OperationHelper.multiplyMatrices(
        matrix1Values,
        matrix2Values
      );

      for (let i = 0; i < rowsMatrix1; i++) {
        for (let j = 0; j < columnsMatrix2; j++) {
          let row = document.querySelector(
            `.resultMatrix div:nth-child(${i + 1})`
          );
          let column = row.querySelector(
            `.resultMatrixRowDiv input:nth-child(${j + 1})`
          );
          column.value = formatValue(multiplication[i][j]);
        }
      }
      break;

    case "/":
      let matrix1 = [];
      let matrix2 = [];
      for (let i = 0; i < matrix2Values.length; i++) {
        matrix1[i] = [];
        matrix2[i] = [];

        for (let j = 0; j < matrix2Values[i].length; j++) {
          matrix1[i][j] = Number(matrix1Values[i][j]);
          matrix2[i][j] = Number(matrix2Values[i][j]);
        }
      }

      let division = OperationHelper.divideMatrices(matrix1, matrix2);
      for (let i = 0; i < matrix1.length; i++) {
        let row = document.querySelector(
          `.resultMatrix div:nth-child(${i + 1})`
        );
        for (let j = 0; j < matrix1[i].length; j++) {
          let column = row.querySelector(
            `.resultMatrixRowDiv input:nth-child(${j + 1})`
          );
          column.value = formatValue(division[i][j]);
        }
      }
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
    let result = "";

    // Não permite que o primeiro caractere seja ponto
    if (raw.startsWith(".")) {
      input.value = "";
      return;
    }

    let hasDot = false;
    let intPart = "";
    let decPart = "";

    for (let i = 0; i < raw.length; i++) {
      const char = raw[i];

      if (char === "." && !hasDot) {
        hasDot = true;
        continue;
      }

      if (!/[0-9]/.test(char)) continue;

      if (!hasDot) {
        if (intPart.length < (raw.includes(".") ? 5 : 7)) {
          intPart += char;
        }
      } else {
        if (decPart.length < 2) {
          decPart += char;
        }
      }
    }

    result = intPart;
    if (hasDot) result += "." + decPart;

    input.value = result;
  });
}