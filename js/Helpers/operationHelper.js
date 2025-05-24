import { customizedAlert } from "./alert.js";
import * as DomHelper from "./domHelper.js";


export async function addOrSubMatrices(stepTimeInMilliseconds, operation){
  let matrixSizes = DomHelper.getMatrixSizes();
  let operatorInput = document.querySelector(".operatorContainer").firstChild;
  let equalsButton = document.querySelector(".equalsButton");
  equalsButton.setAttribute("disabled", true)
  DomHelper.generateMatrixButton.setAttribute("disabled", true)

  //Captura o valor dos inputs, adiciona e remove as classes,
  //realiza a operação desejada e adiciona os valores na matriz resultado
  for (let i = 0; i < matrixSizes[0]; i++) {
    //Container das linhas(rows) das matrizes
    let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
    let matrix2Row = document.querySelector(`.matrix2Container div:nth-child(${i + 1})`);
    let resultMatrixRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`);

    for (let j = 0; j < matrixSizes[1]; j++) {
      //Input da matriz 1
      let matrix1Column = matrix1Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);      

      await highlight(matrix1Column, stepTimeInMilliseconds)

      await highlight(operatorInput, stepTimeInMilliseconds)

      //Input da matriz 2
      let matrix2Column = matrix2Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);

      await highlight(matrix2Column, stepTimeInMilliseconds)

      await highlight(equalsButton, stepTimeInMilliseconds)


      //Input da matriz resultado
      let resultMatrixColumn = resultMatrixRow.querySelector(`.resultMatrixRowDiv input:nth-child(${j + 1})`);

      //Realiza a operação de soma
      resultMatrixColumn.value = operation(Number(matrix1Column.value), Number(matrix2Column.value))

      await highlight(resultMatrixColumn, stepTimeInMilliseconds)
    }
  }

  equalsButton.removeAttribute("disabled")
  DomHelper.generateMatrixButton.removeAttribute("disabled")
}


export async function multiplyMatrices(stepTimeInMilliseconds){
  let matrixSizes = DomHelper.getMatrixSizes();
  let operatorInput = document.querySelector(".operatorContainer").firstChild;
  let equalsButton = document.querySelector(".equalsButton");
  equalsButton.setAttribute("disabled", true)
  DomHelper.generateMatrixButton.setAttribute("disabled", true)

  //Captura o valor dos inputs, adiciona e remove as classes,
  //realiza a operação desejada e adiciona os valores na matriz resultado
  for (let i = 0; i < matrixSizes[0]; i++) {
    for (let j = 0; j < matrixSizes[3]; j++) {
      for (let k = 0; k < matrixSizes[1]; k++) {
        //Container das linhas(rows) das matrizes
        let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
        let matrix2Row = document.querySelector(`.matrix2Container div:nth-child(${k + 1})`);
        let resultMatrixRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`);

        //Input da matriz 1
        let matrix1Column = matrix1Row.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);
        //Highlight da matriz 1
        await highlight(matrix1Column, stepTimeInMilliseconds)
        await highlight(operatorInput, stepTimeInMilliseconds)

        //Input da matriz 2
        let matrix2Column = matrix2Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
        //Highlight da matriz 2
        await highlight(matrix2Column, stepTimeInMilliseconds)
        await highlight(equalsButton, stepTimeInMilliseconds)

        //Input da matriz resultado
        let resultMatrixColumn = resultMatrixRow.querySelector(`.resultMatrixRowDiv input:nth-child(${j + 1})`);
        //Realiza a operação de multiplicação
        resultMatrixColumn.value = (Number(matrix1Column.value) * Number(matrix2Column.value));
        await highlight(resultMatrixColumn, stepTimeInMilliseconds)
        }
      }
    }
  equalsButton.removeAttribute("disabled")
  DomHelper.generateMatrixButton.removeAttribute("disabled")
}


/*export async function invertMatrix(stepTimeInMilliseconds, matrix){
  let matrixSizes = DomHelper.getMatrixSizes();
  let operatorInput = document.querySelector(".operatorContainer").firstChild;
  let equalsButton = document.querySelector(".equalsButton");
  equalsButton.setAttribute("disabled", true)
  DomHelper.generateMatrixButton.setAttribute("disabled", true)

  for (let i = 0; i < matrixSizes[0]; i++) {
    //Container das linhas(rows) das matrizes
    let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
    let matrix2Row = document.querySelector(`.matrix2Container div:nth-child(${i + 1})`);
    let resultMatrixRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`);
  }
  
   const dim = matrix.length;
    // Create identity matrix
    const identity = matrix.map((row, i) => row.map((_, j) => i === j ? 1 : 0));

    // Copy original matrix
    const copyMatrix = matrix.map(row => [...row]);

    // Gauss-Jordan elimination
    for (let i = 0; i < dim; i++) {
        let diagonalElement = copyMatrix[i][i];

        // Find non-zero pivot if diagonal is zero
        if (diagonalElement === 0) {
            for (let j = i + 1; j < dim; j++) {
                if (copyMatrix[j][i] !== 0) {
                    [copyMatrix[i], copyMatrix[j]] = [copyMatrix[j], copyMatrix[i]];
                    [identity[i], identity[j]] = [identity[j], identity[i]];
                    diagonalElement = copyMatrix[i][i];
                    break;
                }
            }
            if (diagonalElement === 0) {
               customizedAlert("A matriz não é invertível", "Impossível realizar divisão");
            }
        }

        // Normalize the row
        const factor = diagonalElement;
        for (let j = 0; j < dim; j++) {
            copyMatrix[i][j] /= factor;
            identity[i][j] /= factor;
        }

        // Eliminate other rows
        for (let j = 0; j < dim; j++) {
            if (i !== j) {
                const factor = copyMatrix[j][i];
                for (let k = 0; k < dim; k++) {
                    copyMatrix[j][k] -= factor * copyMatrix[i][k];
                    identity[j][k] -= factor * identity[i][k];
                }
            }
        }
    }

    return identity;
}*/


/*export async function divideMatrices(stepTimeInMilliseconds){
  await invertMatrix(stepTimeInMilliseconds);
  await multiplyMatrices(stepTimeInMilliseconds);
}*/


export function divideMatrices(matrixA, matrixB) {
  let determinant = calculateDeterminant(matrixB);
  let minorMatrix = calculateMinorMatrix(matrixB);
  let cofactors = calculateCofactors(minorMatrix);
  let adjugate = calculateAdjugate(cofactors);
  let inverse = calculateInverse(adjugate, determinant);
  let division = multiplyMatrices(matrixA, inverse);

  return division;
}

function calculateDeterminant(matrix) {
  const n = matrix.length;

  if (n === 1) {
    return matrix[0][0];
  }

  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let determinant = 0;
  for (let col = 0; col < n; col++) {
    const subMatrix = matrix
      .slice(1)
      .map((row) => row.filter((_, i) => i !== col));
    const cofactor = (col % 2 === 0 ? 1 : -1) * matrix[0][col];
    determinant += cofactor * calculateDeterminant(subMatrix);
  }

  return determinant;
}

function calculateMinorMatrix(matrix) {
  const n = matrix.length;

  const minorMatrix = [];

  for (let i = 0; i < n; i++) {
    minorMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      const subMatrix = matrix
        .filter((_, row) => row !== i)
        .map((row) => row.filter((_, column) => column !== j));

      minorMatrix[i][j] = calculateDeterminant(subMatrix);
    }
  }

  return minorMatrix;
}

function calculateCofactors(matrix) {
  const n = matrix.length;

  const cofactors = [];

  for (let i = 0; i < n; i++) {
    cofactors[i] = [];
    for (let j = 0; j < n; j++) {
      const sign = (i + j) % 2 === 0 ? 1 : -1;
      cofactors[i][j] = sign * matrix[i][j];
    }
  }
  return cofactors;
}

function calculateAdjugate(matrix) {
  const n = matrix.length;
  const adjugate = [];

  for (let i = 0; i < n; i++) {
    adjugate[i] = [];
    for (let j = 0; j < n; j++) {
      adjugate[i][j] = matrix[j][i];
    }
  }

  return adjugate;
}

function calculateInverse(matrix, determinant) {
  const n = matrix.length;
  const inverse = [];

  if (determinant == 0) {
    alert("Erro! Matriz não possui inverse (determinante = 0)");
  }

  for (let i = 0; i < n; i++) {
    inverse[i] = [];
    for (let j = 0; j < n; j++) {
      inverse[i][j] = matrix[i][j] / determinant;
    }
  }

  return inverse;
}

//Destaca o input passado como parametro pela quantidade de tempo determinada
async function highlight(DOMnode, ms){
  DOMnode.classList.add("inputHighlight");
  await new Promise(resolve => setTimeout(resolve, ms));
  DOMnode.classList.remove("inputHighlight")
}

export const operations = {
  addition: (a, b) => a + b,
  subtract: (a, b) => a - b,
};