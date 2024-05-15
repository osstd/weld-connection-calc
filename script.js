// Function to set "Joint penetration groove" as the default option and create inputs accordingly

function setDefaultAndListen() {
  const selectMenu = document.getElementById("weld-type");

  // Set "Joint penetration groove" as the default option
  selectMenu.value = "Joint penetration groove";

  setDefaultValues();
  setWeldType("Joint penetration groove");
  calculate();

  // Add event listener for select menu changes
  selectMenu.addEventListener("change", function () {
    const selectedOption = this.value;
    updateProperties("p-weld-type", "weld-type");

    if (selectedOption === "Joint penetration groove") {
      setWeldType("Joint penetration groove");
      calculate();
    } else if (selectedOption === "Fillet") {
      setWeldType("Fillet");
      calculate();
    } else if (selectedOption === "Flare bevel groove") {
      setWeldType("Flare bevel groove");
      calculate();
    }
  });
}

function updateProperties(notation, input) {
  const element = document.querySelector(`#${notation}`);
  element.innerHTML = document.querySelector(`#${input}`).value;
}

function setDefaultValues() {
  updateProperties("p-weld-type", "weld-type");
  updateProperties("p-electrode-strength", "electrode-strength");
  updateProperties("p-weld-size", "weld-size");
  updateProperties("p-weld-length", "weld-length");
  updateProperties("p-weld-angle", "weld-angle");

  updateProperties("p-thickness", "thickness");
  updateProperties("p-spec-minimum-strength", "spec-minimum-strength");
  updateProperties("p-spec-minimum-yield", "spec-minimum-yield");

  document.querySelector("#res-joint-penetration-groove").style.display =
    "block";
}

// Weld and base metal event listeners

const electrodeStrength = document
  .getElementById("electrode-strength")
  .addEventListener("change", () => {
    updateProperties("p-electrode-strength", "electrode-strength");
    calculate();
  });

const weldSize = document
  .getElementById("weld-size")
  .addEventListener("change", () => {
    updateProperties("p-weld-size", "weld-size");
    calculate();
  });

const weldLength = document
  .getElementById("weld-length")
  .addEventListener("change", () => {
    updateProperties("p-weld-length", "weld-length");
    calculate();
  });

const weldAngle = document
  .getElementById("weld-angle")
  .addEventListener("change", () => {
    updateProperties("p-weld-angle", "weld-angle");
    calculate();
  });

const metalThickness = document
  .getElementById("thickness")
  .addEventListener("change", () => {
    updateProperties("p-thickness", "thickness");
    calculate();
  });

const metalMinimumStrength = document
  .getElementById("spec-minimum-strength")
  .addEventListener("change", () => {
    updateProperties("p-spec-minimum-strength", "spec-minimum-strength");
    calculate();
  });

const metalMinimumYield = document
  .getElementById("spec-minimum-yield")
  .addEventListener("change", () => {
    updateProperties("p-spec-minimum-yield", "spec-minimum-yield");
    calculate();
  });

let selectedWeld;

function setWeldType(weld) {
  selectedWeld = weld;
  console.log("set weld type:", weld);
}

function updateResults(notation, result) {
  const element = document.querySelector(`#${notation}`);
  element.innerHTML = result;
}

function calculate() {
  console.log("during calculate selectedWeld:", selectedWeld);

  let X, D, L, A, T, FU, FY;

  X = parseFloat(document.getElementById("electrode-strength").value);
  D = parseFloat(document.getElementById("weld-size").value);
  L = parseFloat(document.getElementById("weld-length").value);
  A = parseFloat(document.getElementById("weld-angle").value);
  T = parseFloat(document.getElementById("thickness").value);
  FU = parseFloat(document.getElementById("spec-minimum-strength").value);
  FY = parseFloat(document.getElementById("spec-minimum-yield").value);

  let phiWeld = 0.67;
  let areaFusion = (D * L).toFixed(0);
  let areaWeldThroat = (0.707 * D * L).toFixed(0);

  let baseMetalFracture = ((0.67 * phiWeld * areaFusion * FU) / 1000).toFixed(
    2
  );

  if (selectedWeld === "Joint penetration groove") {
    document.querySelector("#res-joint-penetration-groove").style.display =
      "block";
    document.querySelector("#res-fillet").style.display = "none";
    document.querySelector("#res-flare-bevel-groove").style.display = "none";

    let weldMetalFracture = (
      (0.67 * phiWeld * areaWeldThroat * X) /
      1000
    ).toFixed(2);

    let shearCapacity = Math.min(baseMetalFracture, weldMetalFracture).toFixed(
      2
    );

    updateResults("area-metal", `A<sub>m</sub> = ${areaFusion} mm<sup>2</sup>`);
    updateResults(
      "area-weld",
      `A<sub>w</sub> = ${areaWeldThroat} mm<sup>2</sup>`
    );
    updateResults(
      "shear-resistance-base",
      `0.67 * Φ<sub>w</sub> * A<sub>m</sub> * F<sub>u</sub> = ${baseMetalFracture} kN`
    );
    updateResults(
      "shear-resistance-weld",
      `0.67 * Φ<sub>w</sub> * A<sub>w</sub> * X<sub>u</sub> = ${weldMetalFracture} kN`
    );
    updateResults(
      "shear-capacity",
      `V<sub>r</sub> = min (V<sub>rb</sub>, V<sub>rw</sub>) = ${shearCapacity} kN`
    );
  } else if (selectedWeld === "Fillet") {
    document.querySelector("#res-joint-penetration-groove").style.display =
      "none";
    document.querySelector("#res-fillet").style.display = "block";
    document.querySelector("#res-flare-bevel-groove").style.display = "none";

    let thetaRadians = (A * Math.PI) / 180;

    let weldMetalFracture = (
      (0.67 *
        phiWeld *
        areaWeldThroat *
        X *
        (1 + 0.5 * Math.pow(Math.sin(thetaRadians), 1.5)) *
        1.0) /
      1000
    ).toFixed(2);

    let shearCapacity = Math.min(baseMetalFracture, weldMetalFracture).toFixed(
      2
    );

    updateResults(
      "fillet-area-metal",
      `A<sub>m</sub> = ${areaFusion} mm<sup>2</sup>`
    );
    updateResults(
      "fillet-area-weld",
      `A<sub>w</sub> = ${areaWeldThroat} mm<sup>2</sup>`
    );
    updateResults(
      "fillet-shear-resistance-base",
      `0.67 * Φ<sub>w</sub> * A<sub>m</sub> * F<sub>u</sub> = ${baseMetalFracture} kN`
    );
    updateResults(
      "fillet-shear-resistance-weld",
      `0.67 * Φ<sub>w</sub> * A<sub>w</sub> * X<sub>u</sub> * (1.00+0.50sin<sup>1.5</sup>&theta;) *M<sub>w</sub> = ${weldMetalFracture} kN`
    );
    updateResults(
      "fillet-shear-capacity",
      `V<sub>r</sub> = min (V<sub>rb</sub>, V<sub>rw</sub>) = ${shearCapacity} kN`
    );
  } else {
    document.querySelector("#res-joint-penetration-groove").style.display =
      "none";
    document.querySelector("#res-fillet").style.display = "none";
    document.querySelector("#res-flare-bevel-groove").style.display = "block";

    let areaWeldThroat = (0.5 * D * L).toFixed(0);

    let ultimateStrength = Math.min(FU, X).toFixed(2);

    let shearCaapcity = (
      (0.67 * phiWeld * areaWeldThroat * ultimateStrength) /
      1000
    ).toFixed(2);

    updateResults(
      "flare-area-weld",
      `A<sub>w</sub> = 0.5*w<sub>f</sub>*L = ${areaWeldThroat} mm<sup>2</sup>`
    );

    updateResults(
      "flare-res-tensile-strength",
      `F<sub>u</sub> = min (F<sub>u</sub>, X<sub>u</sub>) = ${ultimateStrength} MPa`
    );

    updateResults(
      "flare-shear-capacity",
      `Shear Capacity, V<sub>r</sub> = 0.67 * Φ<sub>w</sub> * A<sub>w</sub> * F<sub>u</sub>= ${shearCaapcity} kN`
    );
  }
}

function managePopUp() {
  const headerLink = document.getElementById("popup");
  const popupContainer = document.getElementById("popupContainer");
  const copyBtn = document.getElementById("copyLinkBtn");

  // Function to open the popup
  headerLink.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("clicked");
    setTimeout(() => {
      popupContainer.style.display = "block";
    }, 150);
  });

  // Function to close the popup
  function closePopup() {
    popupContainer.style.display = "none";
  }

  // Close the popup when clicking outside or pressing Esc
  document.addEventListener("click", function (event) {
    if (!popupContainer.contains(event.target)) {
      closePopup();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePopup();
    }
  });

  copyBtn.addEventListener("click", function () {
    const linkToCopy = "https://weld-connection-calc.vercel.app";
    navigator.clipboard
      .writeText(linkToCopy)
      .then(function () {
        alert("Link copied to clipboard: " + linkToCopy);
      })
      .catch(function (error) {
        console.error("Unable to copy link: ", error);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setDefaultAndListen();
  managePopUp();
});
