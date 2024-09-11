import "./style.css";
import SafeInterval from "./SafeInterval";

const restOpts = document.querySelectorAll("input[name=rest-opt]");
const customTimeInput = document.getElementById("custom-time");
const timerInitButton = document.querySelector(".timer-init-button");
const customTimeContainer = document.querySelector(".custom-time-container");
const errorMessage = document.getElementById("error-message");

const timerElement = document.getElementById("timer");

let time, timerON;

function parseSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

const FINISHED_TIME_EVENT = new Event("FinishedTime");
timerElement.addEventListener("FinishedTime", () => {
  timerElement.textContent = "00:00";
});

restOpts.forEach((opt) => {
  opt.addEventListener("change", () => {
    if (opt.dataset.timeInSeconds == "custom") {
      customTimeContainer.style.display = "block";
    } else {
      customTimeContainer.style.display = "none";
    }
  });
});

time = 0;
const myTimer = new SafeInterval(() => {
  timerElement.textContent = parseSeconds(time--);
  if (time == 0) {
    timerInitButton.textContent = "INICIAR";
    timerON = false;
    console.log("FINISHED TIMER");
    timerElement.dispatchEvent(FINISHED_TIME_EVENT);
    myTimer.stop();
  }
}, 1000);

timerON = false;
document.getElementById("rest-form").addEventListener("submit", (e) => {
  e.preventDefault();

  if (timerON) {
    console.log("STOPPED TIMER");
    myTimer.stop();
    timerElement.dispatchEvent(FINISHED_TIME_EVENT);
    timerInitButton.textContent = "INICIAR";
    timerON = false;
    return;
  }

  errorMessage.textContent = "";

  let selectedTime;
  restOpts.forEach((opt) => {
    if (opt.checked) {
      selectedTime = opt.dataset.timeInSeconds;
    }
  });
  if (!selectedTime) {
    errorMessage.textContent = "Selecciona una opcion.";
    console.log("no option selected");
    return;
  }
  if (selectedTime == "custom") {
    const customTime = parseInt(customTimeInput.value);
    if (isNaN(customTime) || customTime < 0 || customTime > 3600) {
      errorMessage.textContent =
        "Ingresa un tiempo mayor a cero y menor a una hora.";
      console.log("custom time is invalid");
      return;
    }
    selectedTime = customTime;
  }

  timerON = true;
  timerInitButton.textContent = "DETENER";

  time = parseInt(selectedTime);

  myTimer.start();

  console.log("STARTED TIMER");
});
