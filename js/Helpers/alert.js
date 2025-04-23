import { generateMatrixButton } from "./domHelper.js";

export function customizedAlert(
  message,
  headerMessage = "Atenção! Parece que você cometeu um engano:"
) {
  generateMatrixButton.setAttribute("disabled", true)

  const modalContainer = document.querySelector("#modal");
  let errorContainer = document.createElement("div");
  errorContainer.classList.add("errorContainer");

  let messageHeader = document.createElement("div");

  let headerSpan = document.createElement("span");
  headerSpan.classList.add("icon");
  let headerImg = document.createElement("img");
  headerImg.src = "../../assets/errorAlert.png";
  headerSpan.append(headerImg);
  messageHeader.append(headerSpan);

  let headerMessageP = document.createElement("p");
  headerMessageP.classList.add("headerMessage");
  headerMessageP.textContent = headerMessage;
  messageHeader.append(headerMessageP);

  errorContainer.append(messageHeader);

  let alertMessage = document.createElement("p");
  alertMessage.classList.add("alertMessage");
  alertMessage.textContent = message;
  errorContainer.append(alertMessage);

  let closeButton = document.createElement("button");
  closeButton.classList.add("closeButton");
  closeButton.textContent = "Entendi!";

  errorContainer.append(closeButton);

  modalContainer.append(errorContainer);

  closeButton.addEventListener("click", () => {
    if(!errorContainer.nextElementSibling && !errorContainer.previousElementSibling){
      generateMatrixButton.removeAttribute("disabled")
    }
    
    modalContainer.removeChild(errorContainer);
  });
}
