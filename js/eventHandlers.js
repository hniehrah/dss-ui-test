import { createSections } from "./app.js";

/**
 * Event listener for user inputs
 * @param {*} event 
 * @param {*} HomePage object containing HomePage data, including current selected thumbnails and sections
 */
export function keyEventListener(event, HomePage) {
  const { key } = event;
  const { selectedThumbnail } = HomePage;
  const scrollOptions = { behavior: "smooth", block: "start", inline: "start" };
  const openModal = document.getElementsByClassName("modal-open");
  if (key === "Escape" || key === "Backspace" && openModal.length) {
    selectedThumbnail.toggleModal(true);
  } 

  if (key === "Enter") {
    document.getElementById(selectedThumbnail.id).scrollIntoView();
    selectedThumbnail.createModalContainer();
  } else {
    const selectedThumbnail = document.querySelector(".thumbnail-button-selected");

    const currentSectionId = HomePage.currentSection.id;
    const currentSectionElement = document.getElementById(currentSectionId);
    
    if (key === "ArrowRight" || key === "ArrowLeft") {
      const currentSelected = key === "ArrowRight" ? selectedThumbnail.nextElementSibling : selectedThumbnail.previousElementSibling;
      if (currentSelected) {
        selectedThumbnail.classList.remove("thumbnail-button-selected")
        HomePage.setSelectedThumbnailById(currentSelected.id);
        currentSelected.classList.add("thumbnail-button-selected");
        currentSelected.scrollIntoView(scrollOptions);
      }
    } else if (key === "ArrowUp" || key === "ArrowDown") {
      const nextSection = key === "ArrowUp" ? currentSectionElement.previousElementSibling : currentSectionElement.nextElementSibling;
      if (nextSection) {
        HomePage.saveSection();
        HomePage.currentSection = HomePage.getSectionById(nextSection.id);
        selectedThumbnail.classList.remove("thumbnail-button-selected")
        const nextSelection = nextSection.children[1].children[HomePage.currentSection.selectedIndex];
        HomePage.setSelectedThumbnailById(nextSelection.id);
        nextSelection.classList.add("thumbnail-button-selected")
        nextSection.scrollIntoView(scrollOptions);
      }
    }
  }

  const isLastSection = HomePage.sections[HomePage.sections.length - 1].id === HomePage.currentSection.id;
  if (isLastSection && HomePage.remainingSections.length) {
    createSections(HomePage.remainingSections.splice(0, 2));
  }
}
