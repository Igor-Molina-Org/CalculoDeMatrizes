import * as OperationHelper from "./operationHelper.js";

export function createMatrix(
  matrixRows,
  matrixColumns,
  id,
  classList = "matrixRowDiv"
) {
  let matrixContainer = document.querySelector(id);

  for (let i = 0; i < matrixRows; i++) {
    let newRow = document.createElement("div");
    newRow.classList.add(classList);
    for (let j = 0; j < matrixColumns; j++) {
      let newColumn = document.createElement("input");
      newColumn.type = "number";
      if (classList == "resultMatrixRowDiv") {
        newColumn.readOnly = true;
        newColumn.value = "";
      } else {
        //TODO: Retirar quando for para produção
        newColumn.value = j;
      }
      newRow.append(newColumn);
    }
    matrixContainer.append(newRow);
  }
}

export function calculateMatrix() {
  let matrix1Container = document.querySelector(".matrix1Container");
  let matrix2Container = document.querySelector(".matrix2Container");
  let matrix1Values = [];
  let matrix2Values = [];

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

  //TODO: Criar arquivo helper para chamar as funções addMatrix, subtractMatrix,
  //multiplyMatrix e divideMatrix neste switch case
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
          column.value = sum[i][j];
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
          column.value = sub[i][j];
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

      // prettier-ignore
      for (let i = 0; i < rowsMatrix1; i++) {
          for (let j = 0; j < columnsMatrix2; j++) {
            let row = document.querySelector(
              `.resultMatrix div:nth-child(${i + 1})`
            );
            let column = row.querySelector(
              `.resultMatrixRowDiv input:nth-child(${j + 1})`
            );
            column.value = multiplication[i][j];
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
          column.value = division[i][j];
        }
      }
      break;
  }
}
