import { Store, DOM } from "./globals";
import { Keys } from "./keyboardInteraction";

const Nav = {
  addLayer(layerName) {
    Store.layerStack.push(layerName);

    let btnDOM = document.createElement("button");
    btnDOM.innerHTML = layerName;
    btnDOM.classList.add("layer-btn");
    btnDOM.id = layerName;
    btnDOM.onclick = () => {
      this.clicked(layerName);
    };

    DOM.layerNav.appendChild(btnDOM);
  },
  removeLayer(layerName) {
    Store.layerStack.pop();

    let layerToRemove = document.getElementById(layerName);
    layerToRemove.remove();
  },
  clicked(targetLayerName) {
    if (targetLayerName == Store.getCurrLayer()) {
      if (Store.layerStack.length > 1) {
        const activeLayer = Store.getCurrLayer();
        this.removeLayer(activeLayer);
        const newActiveLayer = Store.getCurrLayer();
        Keys.renderLayer(newActiveLayer);
      }
    } else {
      let currL = Store.getCurrLayer();
      while (currL !== targetLayerName) {
        this.removeLayer(currL);
        currL = Store.getCurrLayer();
      }

      Keys.renderLayer(targetLayerName);
    }
  },
};

export { Nav };
