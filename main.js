import "./style.css";
import SafeInterval from "./SafeInterval";

const restOpts = document.querySelectorAll("input[name=rest-opt]");
const customTimeInput = document.getElementById("custom-time");
const timerInitButton = document.querySelector(".timer-init-button");
const customTimeContainer = document.querySelector(".custom-time-container");
const errorMessage = document.getElementById("error-message");

const timerElement = document.getElementById("timer");

let time, timerON;

// transforma los segundos en un formato mas legible (ej. 06:59)
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
  sessionStorage.setItem("TIMER", time);
  if (time == 0) {
    timerInitButton.textContent = "INICIAR";
    timerON = false;
    console.log("FINISHED TIMER");
    timerElement.dispatchEvent(FINISHED_TIME_EVENT);
    // solo manda la notificacion si el usuario dejo terminar el contador
    const noti = new Notification("Tu descanso ha terminado.");
    myTimer.stop();
  }
}, 1000);

// recupera el contador si es que se reincio la pagina
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("TIMER") && sessionStorage.getItem("TIMER") != 0) {
    timerON = true;
    timerInitButton.textContent = "DETENER";
    time = sessionStorage.getItem("TIMER");
    myTimer.start();
  }
});

// sessionStorage.clear()

timerON = false;
document.getElementById("rest-form").addEventListener("submit", (e) => {
  e.preventDefault();

  if (timerON) {
    console.log("STOPPED TIMER");
    myTimer.stop();
    timerElement.dispatchEvent(FINISHED_TIME_EVENT);
    timerInitButton.textContent = "INICIAR";
    timerON = false;
    time = 0;
    sessionStorage.setItem("TIMER", time);
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
    if (isNaN(customTime) || customTime < 1 || customTime > 3600) {
      errorMessage.textContent =
        "Ingresa un tiempo mayor a cero y menor a una hora.";
      console.log("custom time is invalid");
      return;
    }
    selectedTime = customTime;
  }

  document.querySelector(".modal").style.display = "block";

  const startTimer = () => {
    timerON = true;
    timerInitButton.textContent = "DETENER";

    time = parseInt(selectedTime);
    myTimer.start();

    console.log("STARTED TIMER");
  };

  // El navegador del usuario no puede mandar notificaciones (medio raro)
  if (!("Notification" in window)) {
    console.warn("El navegador no puede mandar notificaciones");
  } else if (Notification.permission == "granted") {
    // El usuario ya permitio las notificaciones antes
    document.querySelector(".modal").style.display = "none";
    startTimer();
  } else {
    // Se le pide el permiso de mandar notificaciones al usuario
    Notification.requestPermission()
      .then((result) => {
        if (result == "denied") {
          // Pone un mensaje que sugiera al usuario activar las notificaciones
          setTimeout(
            () => (document.querySelector(".modal").style.display = "none"),
            5000
          );
        } else if (result == "granted") {
          document.querySelector(".modal").style.display = "none";
        }
      })
      .finally(startTimer);
  }
});
