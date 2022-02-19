import { keyEventListener } from "./eventHandlers.js";
import { UserHomePage } from "./userHomeOptions.js";

var HomePage = new UserHomePage();

function checkError(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    return { response, error: "Error" }
  }
}

export async function fetchAsync(url) {
  const response = await fetch(url);
  return checkError(response);
}

async function createSection(container) {
  const mainContainer = document.getElementById("main-container");
  const section = await HomePage.addSection(container);
  mainContainer.appendChild(section);

  if (!HomePage.selectedThumbnail) {
    HomePage.selectedThumbnail = HomePage.currentSection.carousel.items[0];
    HomePage.selectedThumbnail.setAsCurrentSelected();
  }
}

export async function createSections(containers) {
  containers.forEach(container => createSection(container))
}

function showErrorMessage() {
  const main = document.getElementById("main-container");
  const div = document.createElement("div");
  div.setAttribute("class", "error-message");
  const h2 = document.createElement("h2");
  h2.textContent = "Sorry! There was an error loading the page.";
  const span = document.createElement("span");
  span.textContent = "Please refresh and try again";
  div.appendChild(h2);
  div.appendChild(span);
  main.appendChild(div);
}

function initialize() {
  // grab user - make call to JSON file
  const homePageAPI = "https://cd-static.bamgrid.com/dp-117731241344/home.json";
  const homePageData = fetchAsync(homePageAPI);
  homePageData.then(response => {
    if (response.data) {
      const { containers } = response.data?.StandardCollection;
      containers?.length && createSections(containers.slice(0, 4));
      const remainingSections = containers.slice(4, containers.length);
      HomePage.remainingSections = remainingSections;
    } else {
      showErrorMessage();
    }
  })
  
  window.addEventListener("keydown", (event) => event.preventDefault());
  window.addEventListener("keyup", (event) => keyEventListener(event, HomePage));
}

initialize();