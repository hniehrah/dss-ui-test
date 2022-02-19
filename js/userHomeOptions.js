import { fetchAsync } from "./app.js";

export class UserHomePage {
  constructor(selectedThumbnail, currentSection) {
    this.selectedThumbnail = selectedThumbnail;
    this.currentSection = currentSection;
    this.sections = [];
    this.remainingSections = undefined;
  }

  /**
   * Adds new section
   * @param {*} container 
   * @returns carousel HTML element
   */
  async addSection(container) {
    const id = container.set.refId || container.set.setId;
    const title = container.set.text.title.full.set.default.content;
    const section = new Section(id, 0, title);

    if (!this.currentSection) {
      this.currentSection = section;
    }
    
    const sectionElement = document.createElement("section");
    const isSpecialSet = title === "Trending" || title === "New to Disney+";
    if (isSpecialSet) {
      sectionElement.setAttribute("class", "special-set");
    }
    sectionElement.setAttribute("id", id);
    const subheader = document.createElement("h2");
    subheader.textContent = title;
    sectionElement.appendChild(subheader);

    const createCarousel = (items) => {
      const carousel = new Carousel(id, isSpecialSet, title);
      const carouselElement = carousel.createCarousel(items);

      section.carousel = carousel;
      this.sections.push(section);
      sectionElement.appendChild(carouselElement);
      return sectionElement;
    }
    
    // Create carousel component
    const url = `https://cd-static.bamgrid.com/dp-117731241344/sets/${id}.json`;
    if (container.set.items) {
      return createCarousel(container.set.items);
    } else {
      const refData = await fetchAsync(url);
      const objKey = Object.keys(refData.data)[0];
      return createCarousel(refData.data[objKey].items);
    }
  }

  /**
   * Sets currently selected thumbnail
   * @param {string} id 
   */
  setSelectedThumbnailById(id) {
    const thumbnail = this.currentSection.carousel.items.find((item, index) => {
      if (item.id === id) {
        this.currentSection.selectedIndex = index;
        return true;
      }
    });
    this.selectedThumbnail = thumbnail;
  }

  /**
   * Saves s
   */
  saveSection() {
    const index = this.sections.findIndex(item => item.id === this.currentSection.id);
    this.sections[index] = this.currentSection;
  }

  getSectionById(id) {
    return this.sections.find(item => item.id === id);
  }
}

export class Carousel {
  constructor(id, isSpecialSet, sectionName) {
    this.id = id;
    this.items = [];
    this.isSpecialSet = isSpecialSet;
    this.sectionName = sectionName;
  }

  /**
   * Creates carousel of thumbnail images
   * @param {*} items items within ref set
   * @returns carousel HTML element
   */
  createCarousel(items) {
    const carousel = document.createElement("div");
    carousel.setAttribute("id", `carousel-${this.id}`);
    carousel.setAttribute("class", "carousel");
    items.forEach(item => {
      const { 
        contentId, 
        collectionId, 
        text, 
        image, 
        ratings, 
        releases 
      } = item;
      const id = this.sectionName + "-" + (contentId || collectionId);
      const titleObject = Object.entries(text.title.full).find(item => item[0] !== "slug")[0];
      const title = text.title.full[titleObject].default.content;
      
      const res = "1.78";
      const titleObj = image.title_treatment_layer && Object.keys(image.title_treatment_layer[res])[0];

      const imageRes = image.tile["0.71"]
      const tileImage = imageRes[titleObj || "default"].default.url;
      
      const thumbnailImage = image.tile[res][titleObj || "default"].default.url;
      const thumbnail = new Thumbnail(
        id, 
        title,
        thumbnailImage, 
        tileImage, 
        this.isSpecialSet, 
        ratings?.[0]?.system,
        releases?.[0]?.releaseYear
      );
      this.items.push(thumbnail);
      const thumbnailElement = thumbnail.createThumbnailButton();
      carousel.appendChild(thumbnailElement);
    })
    return carousel;
  }
}

export class Section {
  constructor(id, selectedIndex, title, carousel) {
    this.id = id;
    this.selectedIndex = selectedIndex;
    this.title = title;
    this.carousel = carousel;
  }
}

export class Thumbnail {
  constructor(id, title, image, imageTile, isSpecialSet, rating, releaseYear) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.imageTile = imageTile;
    this.isSpecialSet = isSpecialSet;
    this.rating = rating;
    this.releaseYear = releaseYear;
  }

  /**
   * Creates thumbnail button. If image returns an error, provides a generic blank div with title displayed as text.
   * @returns thumbnail HTML element
   */
  createThumbnailButton() {
    const thumbnail = document.createElement("div");
    const img = document.createElement("img");
    img.src = this.isSpecialSet || screen.width < 1201
      ? this.imageTile
      : this.image;
    img.onerror = (item) => {
      this.onerror = null;
      thumbnail.removeChild(img);
      const title = document.createElement("div");
      title.setAttribute("class", "thumbnail-button-title");
      title.textContent = this.title;
      thumbnail.append(title);
    }
    img.style.width = "100%";
    thumbnail.append(img);
    thumbnail.setAttribute("id", this.id);
    thumbnail.setAttribute("alt", this.title);
    thumbnail.setAttribute("aria-label", this.title);
    thumbnail.setAttribute("class", this.isSpecialSet ? "thumbnail-button-special" : "thumbnail-button");
    
    return thumbnail;
  }

  /**
   * Creates modal element for each thumbnail when clicked
   * @returns modal HTML element
   */
  createModal() {
    const modal = document.createElement("div");
    modal.setAttribute("class", "modal-open");
    const header = document.createElement("div");
    header.setAttribute("class", "modal-header");
    header.style.backgroundImage = `url(${this.imageTile})`;
    modal.appendChild(header);
    
    const div = document.createElement("div");
    modal.appendChild(div);
    div.setAttribute("class", "modal-content");
    const title = document.createElement("h1");
    title.textContent = this.title;
    div.appendChild(title);

    if (this.rating) {
      const rating = document.createElement("div");
      rating.setAttribute("class", "rating-label");
      rating.textContent = this.rating;
      div.appendChild(rating);
    }
    
    const paragraph = document.createElement("p");
    // placeholder
    paragraph.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    div.appendChild(paragraph);
    
    if (this.releaseYear) {
      const releaseYear = document.createElement("div");
      releaseYear.setAttribute("class", "releaseYear-label");
      releaseYear.textContent = "Released in " + this.releaseYear;
      div.appendChild(releaseYear);
    }

    return modal;
  }

  /**
   * Creates modal container for each thumbnail when clicked
   */
  createModalContainer() {
    const modalExists = document.getElementById(`modal-${this.id}`);
    if (modalExists) {
      this.toggleModal();
    } else {
      const modalContainer = document.createElement("div");
      modalContainer.setAttribute("class", "modal-background");
      modalContainer.setAttribute("id", `modal-${this.id}`);
      const modal = this.createModal();
      modalContainer.appendChild(modal);
      const section = document.getElementById(this.id).parentElement.parentElement;
      section.appendChild(modalContainer);
    }
  }

  /**
   * Toggles modal on/off
   * @param {boolean} closeModal if modal is to be closed
   */
  toggleModal(closeModal) {
    const modal = document.getElementById(`modal-${this.id}`);
    modal.style.display = closeModal ? "none" : "flex";
  }

  /**
   * Sets current thumbnail as selected
   */
  setAsCurrentSelected() {
    const currentSelected = document.getElementById(this.id);
    currentSelected.classList.add("thumbnail-button-selected");
  }
}