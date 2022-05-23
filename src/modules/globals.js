// DOM ELEMENT VARIABLES
const DOM = {
  layoutForm: document.querySelector("#layout-form"),
  layoutFormSubmit: document.querySelector("#layout-submit"),
  viewSwitcher: document.querySelector("#view-switcher"),
  layerNav: document.querySelector("#layer-nav"),
  keyboard: document.querySelector("#keyboard"),
};

// GLOBAL VARIABLES
const Store = {
  data: {},
  layers: [],
  layerStack: [],
  getCurrLayer() {
    return this.layerStack[this.layerStack.length - 1];
  },
  toLocalStorage(lData) {
    localStorage.setItem("KBLayoutData", JSON.stringify(lData));
  },
  fromLocalStorage() {
    return JSON.parse(localStorage.getItem("KBLayoutData"));
  },
  localStorageExists() {
    return this.fromLocalStorage() !== null;
  },
};

export { DOM, Store };
