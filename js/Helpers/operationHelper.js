import { customizedAlert } from "./alert.js";
import * as DomHelper from "./domHelper.js";
import { getStepTimeInMilliseconds } from "./domHelper.js";


export async function addOrSubMatrices(stepTimeInMilliseconds, operation){

  stepTimeInMilliseconds = getStepTimeInMilliseconds();

  let matrixSizes = DomHelper.getMatrixSizes();
  let operatorInput = document.querySelector(".operatorContainer").firstChild;
  let operator = operatorInput.value.trim();
  let equalsButton = document.querySelector(".equalsButton");
  document.getElementById("operationLog").innerHTML = "";
  equalsButton.setAttribute("disabled", true)
  DomHelper.generateMatrixButton.setAttribute("disabled", true)
  DomHelper.speedSelector.setAttribute("disabled", true)

  //Captura o valor dos inputs, adiciona e remove as classes,
  //realiza a operação desejada e adiciona os valores na matriz resultado
  for (let i = 0; i < matrixSizes[0]; i++) {
    //Container das linhas(rows) das matrizes
    let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
    let matrix2Row = document.querySelector(`.matrix2Container div:nth-child(${i + 1})`);
    let resultMatrixRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`);

    for (let j = 0; j < matrixSizes[1]; j++) {
      //Inicialização dos inputs
      let matrix1Column = matrix1Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      let matrix2Column = matrix2Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      let resultMatrixColumn = resultMatrixRow.querySelector(`.resultMatrixRowDiv input:nth-child(${j + 1})`);


      //Fazendo os logs de soma e subtração antes de realizar a operações em si
      //Para melhor entendimento do usuário
      let val1 = Number(matrix1Column.value);
      let val2 = Number(matrix2Column.value);
      let result = operation(val1, val2);
      if (operator === "+") {
        DomHelper.logOperation(`(M1[${i},${j}])  ${val1} + (M2[${i},${j}])  ${val2} = ${result}`);
      } else if (operator === "-") {
        DomHelper.logOperation(`(M1[${i},${j}])  ${val1} - (M2[${i},${j}])  ${val2} = ${result}`);
      }


      //Hihglight da matriz 1
      await asyncHighlight(matrix1Column, stepTimeInMilliseconds)
      //Hihglight do operador
      await asyncHighlight(operatorInput, stepTimeInMilliseconds)
      //Hihglight da matriz 2
      await asyncHighlight(matrix2Column, stepTimeInMilliseconds)
      //Hihglight do igual
      await asyncHighlight(equalsButton, stepTimeInMilliseconds)

      //Realiza a operação de soma
      resultMatrixColumn.value = result;

      //Highlight da matriz resultado
      await asyncHighlight(resultMatrixColumn, stepTimeInMilliseconds)
    }
  }

  equalsButton.removeAttribute("disabled")
  DomHelper.generateMatrixButton.removeAttribute("disabled")
  DomHelper.speedSelector.removeAttribute("disabled")
}


export async function multiplyMatrices(stepTimeInMilliseconds){
  stepTimeInMilliseconds = getStepTimeInMilliseconds();
  let matrixSizes = DomHelper.getMatrixSizes();
  let operatorInput = document.querySelector(".operatorContainer").firstChild;
  let equalsButton = document.querySelector(".equalsButton");
  document.getElementById("operationLog").innerHTML = "";
  equalsButton.setAttribute("disabled", true)
  DomHelper.generateMatrixButton.setAttribute("disabled", true)
  DomHelper.speedSelector.setAttribute("disabled", true)

  //Captura o valor dos inputs, adiciona e remove as classes,
  //realiza a operação desejada e adiciona os valores na matriz resultado
  for (let i = 0; i < matrixSizes[0]; i++) {
    for (let j = 0; j < matrixSizes[3]; j++) {

      //Array que vai armazenar as multiplicações feitas em cada linha e coluna multiplicada
      let operationSteps = [];
      let partialSum = 0;

      for (let k = 0; k < matrixSizes[1]; k++) {
        //Atualiza operador com operação correta
        operatorInput.value = "*";

        //Inicialização das linhas(rows) e colunas(columns) das matrizes
        //Linhas
        let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
        let matrix2Row = document.querySelector(`.matrix2Container div:nth-child(${k + 1})`);
        let resultMatrixRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`);
        //Colunas
        let matrix1Column = matrix1Row.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);
        let matrix2Column = matrix2Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
        let resultMatrixColumn = resultMatrixRow.querySelector(`.resultMatrixRowDiv input:nth-child(${j + 1})`);

        //Realiza a operação de multiplicação
        let val1 = Number(matrix1Column.value);
        let val2 = Number(matrix2Column.value);
        let previousValue = Number(resultMatrixColumn.value) || 0;
        let product = val1 * val2;
        partialSum = previousValue + product;
        //Armazena multiplicação no array
        operationSteps.push(`(${val1}×${val2})`);

        //Mostra a operação sendo feita
        DomHelper.logOperation(`Cálculo do elemento [${i + 1},${j + 1}]: ${operationSteps.join(" + ")} = ${partialSum}`);


        //Highlight da matriz 1
        await asyncHighlight(matrix1Column, stepTimeInMilliseconds)
        //Highlight do operador
        await asyncHighlight(operatorInput, stepTimeInMilliseconds)
        //Highlight da matriz 2
        await asyncHighlight(matrix2Column, stepTimeInMilliseconds)
        //Highlight do igual
        await asyncHighlight(equalsButton, stepTimeInMilliseconds)

        //Insere valor do resultado na matriz resultado
        resultMatrixColumn.value = parseFloat(partialSum.toFixed(2));
        //Highlight da matriz resultado
        await asyncHighlight(resultMatrixColumn, stepTimeInMilliseconds)
        }
      }
    }
  equalsButton.removeAttribute("disabled")
  DomHelper.generateMatrixButton.removeAttribute("disabled")
  DomHelper.speedSelector.removeAttribute("disabled")
}


export async function invertMatrix(stepTimeInMilliseconds) {
  stepTimeInMilliseconds = getStepTimeInMilliseconds();
  let matrixSizes = DomHelper.getMatrixSizes();
  let equalsButton = document.querySelector(".equalsButton");
  let operator = document.querySelector("#operator");
  let operatorInput = document.querySelector(".operatorContainer").firstChild;
  document.getElementById("operationLog").innerHTML = "";

  let swapped = false;
  let dim = matrixSizes[2]; // Tamanho da matriz quadrada
  //Onde iremos guardar o pivot e factor na matrix1 para melhor visualização das operações
  let tempInput = document.querySelector(`.matrix1Container div:nth-child(${1})`).querySelector(`.matrixRowDiv input:nth-child(${1})`);
  let tempRow = document.querySelector(`.matrix1Container div:nth-child(${dim})`);

  equalsButton.setAttribute("disabled", true);
  DomHelper.generateMatrixButton.setAttribute("disabled", true);
  DomHelper.speedSelector.setAttribute("disabled", true)

  let matrix2Backup = [];
  for (let i = 0; i < dim; i++) {
    let rowBackup = [];
    let matrix2Row = document.querySelector(`.matrix2Container div:nth-child(${i + 1})`);
    for (let j = 0; j < dim; j++) {
      let input = matrix2Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      rowBackup.push(input.value);
    }
    matrix2Backup.push(rowBackup);
  }

  //Checa se o determinante é 0, se for, termina o processo pois não 'é possível inverter a matriz
  let determinant = calculateDeterminant(matrix2Backup);
  if(determinant == 0){
    customizedAlert("A matriz não é invertível", "Impossível realizar divisão");
    equalsButton.removeAttribute("disabled");
    DomHelper.generateMatrixButton.removeAttribute("disabled");
    return swapped;
  }

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
    let pivotCurrentRowInput = pivotCurrentRow.querySelector(`.matrixRowDiv input:nth-child(${i + 1})`);
    let pivotValue = parseFloat(pivotCurrentRowInput.value);
    DomHelper.logOperation(`Pivô da linha ${i + 1} é ${Number(pivotValue).toFixed(3)}`)

    //Pega a linha da matriz resultado (identidade)
    let indentityRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`);

    //Se o valor for, temos que trocar a linha do pivot atual com outra linha
    if (pivotValue == 0) {
      DomHelper.logOperation(`Pivô = 0, vamos trocar as linhas`)
      swapped = false;
      for (let j = i + 1; j < dim; j++) {
        let candidateRow = document.querySelector(`.matrix2Container div:nth-child(${j + 1})`);
        let candidateInput = candidateRow.querySelector(`.matrixRowDiv input:nth-child(${i + 1})`);
        let candidateValue = parseFloat(candidateInput.value);
        if (candidateValue != 0) {
          operatorInput.value = "swap";
          DomHelper.logOperation(`Linha ${i + 1} trocada pela linha ${j + 1}`)
          await swapRows(pivotCurrentRow, candidateRow, stepTimeInMilliseconds);
          await swapRows(
            document.querySelector(`.resultMatrix div:nth-child(${i + 1})`),
            document.querySelector(`.resultMatrix div:nth-child(${j + 1})`),
            stepTimeInMilliseconds
          );
          pivotValue = parseFloat(pivotCurrentRowInput.value);
          swapped = true;
          break;
        }
      }
    }

    //Guarda o pivot no lugar designado
    operatorInput.value = "pivot";
    await asyncHighlight(pivotCurrentRowInput, stepTimeInMilliseconds);
    await asyncHighlight(operatorInput, stepTimeInMilliseconds);
    tempInput.value = pivotValue;
    await asyncHighlight(tempInput, stepTimeInMilliseconds);

    //Como iremos dividir o numero atual pelo pivot, usamos o operador de divisão
    operatorInput.value = "/";

    //Highlight na seguite ordem: Linha, Operador, Pivot, Igual, Linha
    DomHelper.logOperation(`Linha ${i + 1} da matriz original/ Pivô ( ${Number(pivotValue).toFixed(3)} )`)
    await showOperationLineSingleLine(pivotCurrentRow, operatorInput, tempInput, equalsButton, pivotCurrentRow, stepTimeInMilliseconds)

    //Realiza as operações e coloca o resultado na matriz original
    for (let j = 0; j < dim; j++) {
      let matrixInput = pivotCurrentRow.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      let dividedMatrixInput = (parseFloat(matrixInput.value / pivotValue));
      DomHelper.logOperation(`Matriz Original[${i + 1}, ${j + 1}]  ( ${Number(matrixInput.value).toFixed(3)} ) / Pivô ( ${Number(pivotValue).toFixed(3)} ) = ${Number(dividedMatrixInput).toFixed(3)}`)
      matrixInput.value = dividedMatrixInput;
    }

    
    //Highlight na seguite ordem: Linha, Operador, Pivot, Igual, Linha
    DomHelper.logOperation(`Linha ${i + 1} da matriz identidade/ Pivô ( ${Number(pivotValue).toFixed(3)} )`)
    await showOperationLineSingleLine(indentityRow, operatorInput, tempInput, equalsButton, indentityRow, stepTimeInMilliseconds)
  
    //Realiza as operações e coloca o resultado na matriz identidade
    for (let j = 0; j < dim; j++) {
      let identityInput = indentityRow.querySelector(`.resultMatrixRowDiv input:nth-child(${j + 1})`);
      let dividedIdentityMatrixInput = (parseFloat(identityInput.value / pivotValue));
      DomHelper.logOperation(`Matriz Identidade[${i + 1}, ${j + 1}]  ( ${Number(identityInput.value).toFixed(3)} ) / Pivô ( ${Number(pivotValue).toFixed(3)} ) = ${Number(dividedIdentityMatrixInput).toFixed(3)}`)
      identityInput.value = dividedIdentityMatrixInput;
    }

    for (let j = 0; j < dim; j++) {
      if (j !== i) {
        operatorInput.value = "factor";
        let targetRow = document.querySelector(`.matrix2Container div:nth-child(${j + 1})`);
        let factorInput = targetRow.querySelector(`.matrixRowDiv input:nth-child(${i + 1})`);
        let factor = parseFloat(factorInput.value);
        DomHelper.logOperation(`Fator da linha ${j + 1} e coluna ${i + 1} = ${Number(factor).toFixed(3)}`)

        await asyncHighlight(factorInput, stepTimeInMilliseconds);
        await asyncHighlight(operatorInput, stepTimeInMilliseconds);
        tempInput.value = factor;
        await asyncHighlight(tempInput, stepTimeInMilliseconds);
        operatorInput.value = "*";

        DomHelper.logOperation(`Fator *  Linha ${j + 1} na matriz Original`)
        await showOperationLineSingleLine(pivotCurrentRow, operatorInput, tempInput, equalsButton, tempRow, stepTimeInMilliseconds)
        for (let k = 0; k < dim; k++) {
          let pivotCurrentRowInput = pivotCurrentRow.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);
          let tempRowInput = tempRow.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);

          let factoredPivotCurrentInput = (factor * parseFloat(pivotCurrentRowInput.value));
          DomHelper.logOperation(`Fator ( ${Number(factor).toFixed(3)} ) *  Valor ${k + 1} da linha do Pivô ( ${Number(pivotCurrentRowInput.value).toFixed(3)} ) = ${Number(factoredPivotCurrentInput).toFixed(3)}`)
          tempInput.value = factor;
          tempRowInput.value = factoredPivotCurrentInput;  
        }
        operatorInput.value = "-";
        await showOperationLineByLine(targetRow, operatorInput, tempRow, equalsButton, targetRow, stepTimeInMilliseconds)
        for (let k = 0; k < dim; k++) {
          let targetInput = targetRow.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);
          let tempRowInput = tempRow.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);

          let newMatrixTargetInputValue = (parseFloat(targetInput.value) - tempRowInput.value);
          DomHelper.logOperation(`Matriz Original[${j+1},${k+1}] ( ${Number(targetInput.value).toFixed(3)} ) -  Numero ${k + 1} da linha multiplicada ( ${Number(tempRowInput.value).toFixed(3)} ) = ${Number(newMatrixTargetInputValue).toFixed(3)}`)
          targetInput.value = newMatrixTargetInputValue;
        }

        let identityTargetRow = document.querySelector(`.resultMatrix div:nth-child(${j + 1})`)
        let identityPivotCurrentRow = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`)
        operatorInput.value = "*";
        DomHelper.logOperation(`Fator *  Linha ${j + 1} na Matriz Identidade`)
        await showOperationLineSingleLine(identityPivotCurrentRow, operatorInput, tempInput, equalsButton, tempRow, stepTimeInMilliseconds)
        for (let k = 0; k < dim; k++) {
          let identityPivotCurrentInput = identityPivotCurrentRow.querySelector(`.resultMatrixRowDiv input:nth-child(${k + 1})`);
          let tempRowInput = tempRow.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);

          let factoredIdentityPivotCurrentInput = (factor * parseFloat(identityPivotCurrentInput.value));
          DomHelper.logOperation(`Fator ( ${Number(factor).toFixed(3)} ) *  Valor ${k + 1} da linha do Pivô ( ${Number(identityPivotCurrentInput.value).toFixed(3)} ) = ${Number(factoredIdentityPivotCurrentInput).toFixed(3)}`)
          tempRowInput.value = factoredIdentityPivotCurrentInput;
        }
        operatorInput.value = "-";
        await showOperationLineByLine(identityTargetRow, operatorInput, tempRow, equalsButton, identityTargetRow, stepTimeInMilliseconds)
        for (let k = 0; k < dim; k++) {
          let identityTargetInput = identityTargetRow.querySelector(`.resultMatrixRowDiv input:nth-child(${k + 1})`);
          let tempRowInput = tempRow.querySelector(`.matrixRowDiv input:nth-child(${k + 1})`);

          let newIdentityTargetInputValue = (parseFloat(identityTargetInput.value) - tempRowInput.value);
          DomHelper.logOperation(`Matriz Identidade[${j+1},${k+1}] ( ${Number((identityTargetInput.value)).toFixed(3)} ) -  Numero ${k + 1} da linha multiplicada (${Number(tempRowInput.value).toFixed(3)} ) = ${Number(newIdentityTargetInputValue).toFixed(3)}`)
          identityTargetInput.value = newIdentityTargetInputValue;
        }

      }
    }
  }

  //Move resultMatrix para matrix2
  DomHelper.logOperation("Colocando matriz inversa em seu devido local")
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
  DomHelper.logOperation("Restaurando matriz 1 original")
  for (let i = 0; i < matrix1Backup.length; i++) {
    let matrix1Row = document.querySelector(`.matrix1Container div:nth-child(${i + 1})`);
    for (let j = 0; j < matrix1Backup[i].length; j++) {
      let input = matrix1Row.querySelector(`.matrixRowDiv input:nth-child(${j + 1})`);
      input.value = matrix1Backup[i][j];
    }
  }
  operatorInput.value = "*";
  operator.value = "*"

  equalsButton.removeAttribute("disabled");
  DomHelper.generateMatrixButton.removeAttribute("disabled");
  DomHelper.speedSelector.removeAttribute("disabled")
  return swapped = true;
}

export async function divideMatrices(stepTimeInMilliseconds){
  stepTimeInMilliseconds = getStepTimeInMilliseconds();
  let swapped = await invertMatrix(stepTimeInMilliseconds);
  if(swapped){
    DomHelper.logOperation("Inversão completa! Aperte o botão de igual para realizar a multiplicação")
    DomHelper.logOperation("entre a primeira matriz e a inversa da segunda.")
    DomHelper.logOperation("Dessa maneira finalizando o processo de divisão.")
  }
}

async function showOperationLineSingleLine(rowA, operationInput, singleInput, equalsButton, resultRow, stepTimeInMilliseconds){
  await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds/5));
  await highlightRow(rowA, stepTimeInMilliseconds);
  await asyncHighlight(operationInput, stepTimeInMilliseconds);
  await asyncHighlight(singleInput, stepTimeInMilliseconds);
  await asyncHighlight(equalsButton, stepTimeInMilliseconds);
  await highlightRow(resultRow, stepTimeInMilliseconds);
}

async function showOperationLineByLine(rowA, operationInput, rowB, equalsButton, resultRow, stepTimeInMilliseconds){
  await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds/5));
  await highlightRow(rowA, stepTimeInMilliseconds);
  await asyncHighlight(operationInput, stepTimeInMilliseconds);
  await highlightRow(rowB, stepTimeInMilliseconds);
  await asyncHighlight(equalsButton, stepTimeInMilliseconds);
  await highlightRow(resultRow, stepTimeInMilliseconds);
}

async function swapRows(rowA, rowB, stepTimeInMilliseconds) {
  stepTimeInMilliseconds = getStepTimeInMilliseconds();
  let inputsA = rowA.querySelectorAll("input");
  let inputsB = rowB.querySelectorAll("input");

  await highlightRow(rowA, stepTimeInMilliseconds)
  await highlightRow(rowB, stepTimeInMilliseconds)

  for (let i = 0; i < inputsA.length; i++) {
    let columnA = inputsA[i];
    let columnB = inputsB[i]; 
    let temp = columnA.value;
    columnA.value = columnB.value;
    columnB.value = temp;
  }
  await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds))
}

async function highlightRow(row, stepTimeInMilliseconds) {
  let inputs = row.querySelectorAll("input");
  for (const input of inputs) {
    input.classList.add("inputHighlight");
  }
  await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds));
  for (const input of inputs) {
    input.classList.remove("inputHighlight")
  }
}

//Destaca o input passado como parametro pela quantidade de tempo determinada
async function asyncHighlight(DOMnode, stepTimeInMilliseconds){
  DOMnode.classList.add("inputHighlight");
  await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds));
  DOMnode.classList.remove("inputHighlight")
}


function calculateDeterminant(m) {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0]*m[1][1] - m[0][1]*m[1][0];

  return m[0].reduce((det, val, j) => {
    const sub = m.slice(1).map(row => row.filter((_, col) => col !== j));
    return det + ((j % 2 === 0 ? 1 : -1) * val * calculateDeterminant(sub));
  }, 0);
}

export const operations = {
  addition: (a, b) => a + b,
  subtract: (a, b) => a - b,
};