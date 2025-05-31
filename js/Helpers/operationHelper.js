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
        operatorInput.value = "*";
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
        let partialSum = 
        (Number(resultMatrixColumn.value) || 0) + 
        (Number(matrix1Column.value) * Number(matrix2Column.value));

        resultMatrixColumn.value = parseFloat(partialSum.toFixed(2));


        await highlight(resultMatrixColumn, stepTimeInMilliseconds)
        }
      }
    }
  equalsButton.removeAttribute("disabled")
  DomHelper.generateMatrixButton.removeAttribute("disabled")
}



export async function invertMatrix(stepTimeInMilliseconds) {
  let matrixSizes = DomHelper.getMatrixSizes();
  let equalsButton = document.querySelector(".equalsButton");
  let operatorInput = document.querySelector(".operatorContainer").firstChild;

  let swapped = false;
  let dim = matrixSizes[2]; // Tamanho da matriz quadrada
  //Onde iremos guardar o pivot e factor na matrix1 para melhor visualização das operações
  let tempInput = document.querySelector(`.matrix1Container div:nth-child(${1})`).querySelector(`.matrixRowDiv input:nth-child(${1})`);

  equalsButton.setAttribute("disabled", true);
  DomHelper.generateMatrixButton.setAttribute("disabled", true);

  //Salva os valores atuais da matrix1
  let matrix1Backup = [];
  for (let i = 0; i < dim; i++) {
    let rowBackup = [];
    let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
    for (let j = 0; j < dim; j++) {
      let input = matrix1Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      rowBackup.push(input.value);
      input.value = ""; //Limpa matrix1 para melhor visualização das operações que usam pivot e factor
    }
    matrix1Backup.push(rowBackup);
  }

  //Inicializa a matriz identidade no resultMatrix
  for (let i = 0; i < dim; i++) {
    let resultRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`);
    for (let j = 0; j < dim; j++) {
      let resultInput = resultRow.querySelector(`.resultMatrixRowDiv input:nth-child(${j + 1})`);
      resultInput.value = i === j ? "1" : "0";
    }
  }

  //Início da inversão
  for (let i = 0; i < dim; i++) {
    //Pega o valor do pivot
    let pivotCurrentRow = document.querySelector(`.matrix2Container div:nth-child(${i + 1})`);
    let pivotCurrentInput = pivotCurrentRow.querySelector(`.matrixRowDiv input:nth-child(${i + 1})`);
    let pivotValue = parseFloat(pivotCurrentInput.value);

    //Se o valor for, temos que trocar a linha do pivot atual com outra linha
    if (pivotValue == 0) {
      swapped = false;
      for (let j = i + 1; j < dim; j++) {
        let candidateRow = document.querySelector(`.matrix2Container div:nth-child(${j + 1})`);
        let candidateInput = candidateRow.querySelector(`.matrixRowDiv input:nth-child(${i + 1})`);
        let candidateValue = parseFloat(candidateInput.value);
        if (candidateValue != 0) {
          operatorInput.value = "swap";
          await swapRows(pivotCurrentRow, candidateRow, stepTimeInMilliseconds);
          await swapRows(
            document.querySelector(`.resultMatrix div:nth-child(${i + 1})`),
            document.querySelector(`.resultMatrix div:nth-child(${j + 1})`),
            stepTimeInMilliseconds
          );
          pivotValue = parseFloat(pivotCurrentInput.value);
          swapped = true;
          break;
        }
      }
      //Se após a troca, o pivot ainda for 0, a matriz não é invertível
      if (!swapped) {
        customizedAlert("A matriz não é invertível", "Impossível realizar divisão");
        equalsButton.removeAttribute("disabled");
        DomHelper.generateMatrixButton.removeAttribute("disabled");

        //Restaura matrix1 antes de sair
        for (let i = 0; i < matrix1Backup.length; i++) {
          let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
          for (let j = 0; j < matrix1Backup[i].length; j++) {
            let input = matrix1Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
            input.value = matrix1Backup[i][j];
          }
        }
        return swapped;
      }
    }

    //Guarda o pivot no lugar designado
    operatorInput.value = "pivot";
    await highlight(pivotCurrentInput, stepTimeInMilliseconds);
    tempInput.value = pivotValue;
    await highlight(tempInput, stepTimeInMilliseconds);

    //Como iremos dividir o numero atual pelo pivot, usamos o operador de divisão
    operatorInput.value = "/";

    //Normaliza a linha do pivot, ou seja, divide todos os numeros pelo pivot, fazendo assim, o numero da diagonal principal virará 1.
    for (let j = 0; j < dim; j++) {
      let matrixInput = pivotCurrentRow.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      let identityInput = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`).querySelector(`.resultMatrixRowDiv input:nth-child(${j + 1})`);
      await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds/5));

      //Highlight na seguite ordem: Pivot, Operador, Numero que iremos dividir, Igual, Numero que iremos dividir
      //Assim mostramos que iremos pegar o pivot, dividir pelo numero que queremos, e botar o resultado no lugar do número que dividimos
      let dividedMatrixInput = parseFloat(matrixInput.value / pivotValue);
      await showOperation(
        "/", 
        matrixInput, 
        operatorInput, 
        tempInput, 
        equalsButton, 
        dividedMatrixInput,
        matrixInput,
        stepTimeInMilliseconds
      )

      //Repete o mesmo, mas com a matriz identidade
      let dividedIdentityMatrixInput = parseFloat(identityInput.value / pivotValue);
      await showOperation(
        "/", 
        identityInput, 
        operatorInput, 
        tempInput, 
        equalsButton, 
        dividedIdentityMatrixInput,
        identityInput,
        stepTimeInMilliseconds
      )
      
    }

    //Eliminamos os outros elementos da coluna do pivot
    //Fazemos isso da seguite maneira:
    // - Pegamos o numero no qual queremos eliminar, ele tem que estar ou acima ou abaixo do numero que transformamos em 1 com o pivot
    //- Guardamos ele como fator
    //- Multiplicamos a linha do pivot pelo fator
    //Subtraimos a linha do numero que queremos eliminar pela linha multiplicada do pivot
    for (let j = 0; j < dim; j++) {
      if (j !== i) {
        operatorInput.value = "factor";
        let targetRow = document.querySelector(`.matrix2Container div:nth-child(${j + 1})`);
        let factorInput = targetRow.querySelector(`.matrixRowDiv input:nth-child(${i + 1})`);
        let factor = parseFloat(factorInput.value);
        await highlight(factorInput, stepTimeInMilliseconds);

        tempInput.value = factor;
        await highlight(tempInput, stepTimeInMilliseconds);
        operatorInput.value = "-";

        for (let k = 0; k < dim; k++) {
          let targetInput = targetRow.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);
          let pivotCurrentInput = pivotCurrentRow.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);

          let identityTargetInput = document.querySelector(`.resultMatrix div:nth-child(${j + 1})`).querySelector(`.resultMatrixRowDiv input:nth-child(${k + 1})`);
          let identityPivotCurrentInput = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`).querySelector(`.resultMatrixRowDiv input:nth-child(${k + 1})`);

          // Update matrix2
          let factoredPivotCurrentInput = factor * parseFloat(pivotCurrentInput.value);
          tempInput.value = factor;
          await showOperation(
            "*", 
            tempInput, 
            operatorInput, 
            pivotCurrentInput, 
            equalsButton, 
            factoredPivotCurrentInput,
            tempInput,
            stepTimeInMilliseconds
          )
          let newTargetInputValue = (parseFloat(targetInput.value) - factoredPivotCurrentInput);
          await showOperation(
            "-", 
            targetInput, 
            operatorInput, 
            tempInput, 
            equalsButton, 
            newTargetInputValue, 
            targetInput,
            stepTimeInMilliseconds
          )

          tempInput.value = factor;
          // Update resultMatrix
          let factoredIdentityPivotCurrentInput = factor * parseFloat(identityPivotCurrentInput.value);
          await showOperation(
            "*", 
            tempInput, 
            operatorInput, 
            identityPivotCurrentInput, 
            equalsButton, 
            factoredIdentityPivotCurrentInput,
            tempInput,
            stepTimeInMilliseconds
          )

          let newIdentityTargetInputValue = (parseFloat(identityTargetInput.value) - factoredIdentityPivotCurrentInput);
          await showOperation(
            "-",
            identityTargetInput, 
            operatorInput, 
            tempInput,  
            equalsButton, 
            newIdentityTargetInputValue, 
            identityTargetInput,
            stepTimeInMilliseconds
          )
        }
      }
    }
  }

  //Move resultMatrix para matrix2
  for (let i = 0; i < dim; i++) {
    let matrix2Row = document.querySelector(`.matrix2Container div:nth-child(${i + 1})`);
    let resultRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`);

    for (let j = 0; j < dim; j++) {
      let matrix2Input = matrix2Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      let resultInput = resultRow.querySelector(`.resultMatrixRowDiv input:nth-child(${j + 1})`);

      matrix2Input.value = resultInput.value;
      resultInput.value = "";
    }
  }

  //Restaura matrix1 e operatorInput
  for (let i = 0; i < matrix1Backup.length; i++) {
    let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
    for (let j = 0; j < matrix1Backup[i].length; j++) {
      let input = matrix1Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      input.value = matrix1Backup[i][j];
    }
  }
  operatorInput.value = "/";

  equalsButton.removeAttribute("disabled");
  DomHelper.generateMatrixButton.removeAttribute("disabled");
  return swapped = true;
}

async function showOperation(operationValue, input1, operationInput, input2, equals, operationResult, result, stepTimeInMilliseconds){
  await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds/5));
  operationInput.value = operationValue;
  await highlight(input1, stepTimeInMilliseconds);
  await highlight(operationInput, stepTimeInMilliseconds);
  await highlight(input2, stepTimeInMilliseconds);
  await highlight(equals, stepTimeInMilliseconds);
  result.value = operationResult;
  await highlight(result, stepTimeInMilliseconds);
}

async function swapRows(rowA, rowB, stepTimeInMilliseconds) {
  let inputsA = rowA.querySelectorAll("input");
  let inputsB = rowB.querySelectorAll("input");

  for (let i = 0; i < inputsA.length; i++) {
    let columnA = inputsA[i];
    let columnB = inputsB[i]; 
    let temp = columnA.value;
    await highlight(columnA, stepTimeInMilliseconds)
    await highlight(columnB, stepTimeInMilliseconds)
    columnA.value = columnB.value;
    columnB.value = temp;
  }
}

export async function divideMatrices(stepTimeInMilliseconds){
  let swapped = await invertMatrix(stepTimeInMilliseconds);
  if(swapped){
    await multiplyMatrices(stepTimeInMilliseconds);
  }
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