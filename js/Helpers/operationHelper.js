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
      await highlight(matrix1Column, stepTimeInMilliseconds)
      //Hihglight do operador
      await highlight(operatorInput, stepTimeInMilliseconds)
      //Hihglight da matriz 2
      await highlight(matrix2Column, stepTimeInMilliseconds)
      //Hihglight do igual
      await highlight(equalsButton, stepTimeInMilliseconds)

      //Realiza a operação de soma
      resultMatrixColumn.value = result;

      //Highlight da matriz resultado
      await highlight(resultMatrixColumn, stepTimeInMilliseconds)
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
        await highlight(matrix1Column, stepTimeInMilliseconds)
        //Highlight do operador
        await highlight(operatorInput, stepTimeInMilliseconds)
        //Highlight da matriz 2
        await highlight(matrix2Column, stepTimeInMilliseconds)
        //Highlight do igual
        await highlight(equalsButton, stepTimeInMilliseconds)

        //Insere valor do resultado na matriz resultado
        resultMatrixColumn.value = parseFloat(partialSum.toFixed(2));
        //Highlight da matriz resultado
        await highlight(resultMatrixColumn, stepTimeInMilliseconds)
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
  let operatorInput = document.querySelector(".operatorContainer").firstChild;
  document.getElementById("operationLog").innerHTML = "";

  let swapped = false;
  let dim = matrixSizes[2]; // Tamanho da matriz quadrada
  //Onde iremos guardar o pivot e factor na matrix1 para melhor visualização das operações
  let tempInput = document.querySelector(`.matrix1Container div:nth-child(${1})`).querySelector(`.matrixRowDiv input:nth-child(${1})`);

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
    let pivotCurrentInput = pivotCurrentRow.querySelector(`.matrixRowDiv input:nth-child(${i + 1})`);
    let pivotValue = parseFloat(pivotCurrentInput.value);
    DomHelper.logOperation(`Pivot da linha ${i + 1} é ${pivotValue}`)

    //Se o valor for, temos que trocar a linha do pivot atual com outra linha
    if (pivotValue == 0) {
      DomHelper.logOperation(`Pivot = 0, vamos trocar as linhas`)
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
      let dividedMatrixInput = (parseFloat(matrixInput.value / pivotValue));
      DomHelper.logOperation(`Matriz Original[${i + 1}, ${j + 1}]  ( ${matrixInput.value} ) / Pivô ( ${pivotValue} ) = ${dividedMatrixInput}`)
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
      let dividedIdentityMatrixInput = (parseFloat(identityInput.value / pivotValue));
      DomHelper.logOperation(`Matriz Identidade[${i + 1}, ${j + 1}]  ( ${identityInput.value} ) / Pivô ( ${pivotValue} ) = ${dividedIdentityMatrixInput}`)
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
          DomHelper.logOperation(`Pivô da matriz original na linha ${i + 1} = ${pivotCurrentInput.value}`)

          let identityTargetInput = document.querySelector(`.resultMatrix div:nth-child(${j + 1})`).querySelector(`.resultMatrixRowDiv input:nth-child(${k + 1})`);
          let identityPivotCurrentInput = document.querySelector(`.resultMatrix div:nth-child(${i + 1})`).querySelector(`.resultMatrixRowDiv input:nth-child(${k + 1})`);
          

          // Update matrix2
          let factoredPivotCurrentInput = (factor * parseFloat(pivotCurrentInput.value));
          DomHelper.logOperation(`Fator ( ${factor} ) *  Pivô da matriz original ( ${pivotCurrentInput.value} ) = ${factoredPivotCurrentInput}`)
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
          DomHelper.logOperation(`Matriz Original[${j+1},${k+1}] ( ${targetInput.value} ) -  Valor alterado do pivô ( ${factoredPivotCurrentInput} ) = ${newTargetInputValue}`)
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

          DomHelper.logOperation(`Pivô da matriz identidade na linha ${i + 1} = ${identityPivotCurrentInput.value}`)
          tempInput.value = factor;
          // Update resultMatrix
          let factoredIdentityPivotCurrentInput = (factor * parseFloat(identityPivotCurrentInput.value));
          DomHelper.logOperation(`Fator ( ${factor} ) *  Pivô da matriz identidade ( ${identityPivotCurrentInput.value} ) = ${factoredIdentityPivotCurrentInput}`)
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
          DomHelper.logOperation(`Matriz Identidade[${j+1},${k+1}] ( ${identityTargetInput.value} ) -  Valor alterado do pivô ( ${factoredIdentityPivotCurrentInput} ) = ${newIdentityTargetInputValue}`)
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
  operatorInput.value = "/";

  equalsButton.removeAttribute("disabled");
  DomHelper.generateMatrixButton.removeAttribute("disabled");
  DomHelper.speedSelector.removeAttribute("disabled")
  return swapped = true;
}

async function showOperation(operationValue, input1, operationInput, input2, equals, operationResult, result, stepTimeInMilliseconds){
  stepTimeInMilliseconds = getStepTimeInMilliseconds();
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
  stepTimeInMilliseconds = getStepTimeInMilliseconds();
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
  stepTimeInMilliseconds = getStepTimeInMilliseconds();
  let swapped = await invertMatrix(stepTimeInMilliseconds);
  if(swapped){
    DomHelper.logOperation("Agora iremos multiplicar a matriz 1 pela matriz 2 invertida")
    await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds * 10));
    await multiplyMatrices(stepTimeInMilliseconds);
  }
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

//Destaca o input passado como parametro pela quantidade de tempo determinada
async function highlight(DOMnode, stepTimeInMilliseconds){
  DOMnode.classList.add("inputHighlight");
  await new Promise(resolve => setTimeout(resolve, stepTimeInMilliseconds));
  DOMnode.classList.remove("inputHighlight")
}

async function highlightRow(row, DOMnode, stepTimeInMilliseconds) {
  let rowDiv = document.querySelector(`.${DOMnode} div:nth-child(${row + 1})`);
  let inputs = rowDiv.querySelectorAll(`.matrixRowDiv input`);
  for (let input of inputs) {
    await highlight(input, stepTimeInMilliseconds);
  }
}

export const operations = {
  addition: (a, b) => a + b,
  subtract: (a, b) => a - b,
};