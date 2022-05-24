import { DOM, Store } from "./modules/globals";
import { Extract } from "./modules/layoutExtractor";
import { Keys } from "./modules/keyboardInteraction";
import { Nav } from "./modules/navInteraction";

function readLayout() {
  const srcText = DOM.layoutForm.querySelector("textarea").value;
  Store.data = Extract.layoutData(srcText);
  Store.layers = Extract.layerNames(Store.data);

  switchToKeyboardView();
  if (Store.layerStack.length == 0) {
    Nav.addLayer("MAIN");
  }

  Keys.renderLayer("MAIN");

  Store.toLocalStorage(Store.data);
}

// VIEWPORT FUNCTIONS
function switchToFormView() {
  console.log("going to form view...");
  DOM.keyboard.style.display = "none";
  DOM.layerNav.style.display = "none";
  DOM.viewSwitcher.style.display = "none";
  DOM.layoutForm.style.removeProperty("display");
}
function switchToKeyboardView() {
  console.log("going to keyboard view...");
  DOM.layoutForm.style.display = "none";
  DOM.keyboard.style.removeProperty("display");
  DOM.layerNav.style.removeProperty("display");
  DOM.viewSwitcher.style.removeProperty("display");
}

// [[ SETUP ]]
if (Store.localStorageExists()) {
  Store.data = Store.fromLocalStorage();
  Store.layers = Extract.layerNames(Store.data);
  switchToKeyboardView();
  Nav.addLayer("MAIN");
  Keys.renderLayer("MAIN");
} else {
  switchToFormView();
}

DOM.layoutFormSubmit.addEventListener("click", readLayout);
DOM.viewSwitcher.addEventListener("click", switchToFormView);
