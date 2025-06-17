import { customizedAlert } from "./alert.js";
import * as MatrixHelper from "./matrixHelper.js";

export const generateMatrixButton = document.querySelector(
  "#generateMatrixButton"
);

export const domOperator = document.querySelector("#operator");
export const matrix1Container = document.querySelector(".matrix1Container");
export const matrix2Container = document.querySelector(".matrix2Container");


export function getAndValidateHeaderInputs() {
  let matrixSizes = getMatrixSizes();
  let operator = domOperator.value;
  let matrixSizesOk;
  let sizeCompatiblityOk;

  if (matrixSizes) {
    matrixSizesOk = checkMatrixSizes(matrixSizes);
    sizeCompatiblityOk = checkMatrixSizesCompatibility(matrixSizes, operator);
  }

  if (operator && matrixSizesOk && sizeCompatiblityOk) {
    return { matrixSizes, operator };
  }
}

export function getMatrixSizes() {
  let matrix1Rows = Number(document.querySelector("#matrix1Rows").value);
  let matrix1Columns = Number(document.querySelector("#matrix1Columns").value);
  let matrix2Rows = Number(document.querySelector("#matrix2Rows").value);
  let matrix2Columns = Number(document.querySelector("#matrix2Columns").value);

  let matrixSizes = [matrix1Rows, matrix1Columns, matrix2Rows, matrix2Columns];

  return matrixSizes;
}

function checkMatrixSizes(matrixSizes) {
  let isSizeOk = true;
  for (let i = 0; i < matrixSizes.length; i++) {
    if (matrixSizes[i] < 2 || matrixSizes[i] > 6) {
      isSizeOk = false;
    }
  }
  if (!isSizeOk) {
    customizedAlert(
      "Insira uma matriz com no mínimo 2 linhas e 2 colunas, e no máximo 6 linhas e 6 colunas"
    );
  }
  return isSizeOk;
}

function checkMatrixSizesCompatibility(matrixSizes, operator) {
  let areSizesCompatible = true;

  switch (operator) {
    case "+":
    case "-":
      if (
        matrixSizes[0] != matrixSizes[2] ||
        matrixSizes[1] != matrixSizes[3]
      ) {
        areSizesCompatible = false;
        customizedAlert(
          "Para realizar as operações de soma ou subtração, é necessário que as matrizes tenham o mesmo tamanho"
        );
      }
      break;
    case "*":
      if (matrixSizes[1] != matrixSizes[2]) {
        areSizesCompatible = false;
        customizedAlert(
          "O número de colunas da primeira matriz deve ser igual número de linhas da segunda matriz."
        );
      }
      break;
    case "/":
      if (
        matrixSizes[0] != matrixSizes[1] ||
        matrixSizes[2] != matrixSizes[3] ||
        matrixSizes[0] != matrixSizes[2]
      ) {
        areSizesCompatible = false;
        customizedAlert(
          "Ambas as matrizes precisam ser quadradas com o mesmo número de linhas e colunas!"
        );
      }
      break;
    default:
      customizedAlert("Insira um operador válido! Eles são: ( + | - | * | / )");
      areSizesCompatible = false;
  }
  return areSizesCompatible;
}

export function mountMatrix() {
  let headerInputValues = getAndValidateHeaderInputs();
  document.getElementById("operationLogHeader").innerHTML = "";
  document.getElementById("operationLog").innerHTML = "";
  document.getElementById("operationLogHeader").style.display = "block";

  if (headerInputValues) {
    let matrix1Rows = headerInputValues.matrixSizes[0];
    let matrix1Columns = headerInputValues.matrixSizes[1];
    let matrix2Rows = headerInputValues.matrixSizes[2];
    let matrix2Columns = headerInputValues.matrixSizes[3];

    clearNodeChildren(matrix1Container);

    MatrixHelper.createMatrix(matrix1Rows, matrix1Columns, ".matrix1Container");

    let operatorContainer = document.querySelector(".operatorContainer");
    let equalsContainer = document.querySelector(".equalsContainer");
    clearNodeChildren(operatorContainer);
    clearNodeChildren(equalsContainer);

    const operatorValue = document.createElement("input");
    operatorValue.value = headerInputValues.operator;
    operatorValue.readOnly = true;
    operatorContainer.append(operatorValue);

    const equalsButton = document.createElement("button");
    equalsButton.classList.add("equalsButton");
    equalsButton.textContent = "=";
    equalsButton.id = "equalsButton";
    equalsContainer.append(equalsButton);

    let generateResultButton = document.querySelector("#equalsButton");

    generateResultButton.addEventListener("click", () => {
      MatrixHelper.calculateMatrix();
    });

    clearNodeChildren(matrix2Container);
    MatrixHelper.createMatrix(matrix2Rows, matrix2Columns, ".matrix2Container");

    let resultMatrix = document.querySelector(".resultMatrix");
    clearNodeChildren(resultMatrix);

    switch (headerInputValues.operator) {
      case "+":
      case "-":
      case "/":
        // prettier-ignore
        MatrixHelper.createMatrix(matrix1Rows, matrix1Columns, ".resultMatrix", "resultMatrixRowDiv");
        break;
      case "*":
        // prettier-ignore
        MatrixHelper.createMatrix(matrix1Rows, matrix2Columns, ".resultMatrix", "resultMatrixRowDiv");
        break;
    }
  }
}

export function clearNodeChildren(DOMnode) {
  while (DOMnode.lastElementChild) {
    DOMnode.removeChild(DOMnode.lastElementChild);
  }
}

export function clearNodeValues(DOMnode) {
  DOMnode.childNodes.forEach((row) => {
    row.childNodes.forEach((column) => {
      column.value = "";
    });
  })
}

export let stepTimeInMilliseconds = 500; // valor padrão

// Atualiza globalStepTimeInMilliseconds sempre que o usuário mudar a opção
export const speedSelector = document.getElementById("speedSelector");
speedSelector.addEventListener("change", (event) => {
  stepTimeInMilliseconds = parseFloat(event.target.value);
});

export function getStepTimeInMilliseconds() {
  return stepTimeInMilliseconds;
}


export function logOperation(message) {
  const opLogCont = document.getElementById("operationLogContainer");
  const logContainer = document.getElementById("operationLog");
  const logEntry = document.createElement("p");
  logEntry.textContent = message;
  logContainer.appendChild(logEntry);
  opLogCont.scrollTop = opLogCont.scrollHeight;
}