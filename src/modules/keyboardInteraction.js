import { Store } from "./globals";
import { Nav } from "./navInteraction";

const Keys = {
  renderLayer(layerName) {
    let layerData = Store.data[layerName];

    this.forAll(layerName, (id, r, c) => {
      let keyData = layerData[r][c];
      const keyDOM = document.getElementById(id);

      keyDOM.classList.remove("pressed");

      if (keyData.match(/^(\s+)?_+(\s+)?$/m)) {
        Key.addFade(id);
        Key.setContent(id, "");
      } else {
        Key.removeFade(id);
        if (Key.getTargetLayer(keyData) === Store.getCurrLayer()) {
          Key.setContent(id, Key.removeSquareBrackets(keyData));
          keyDOM.classList.add("pressed");
        } else {
          Key.setContent(id, keyData);
        }
      }
    });

    this.updateInteractivity();
  },
  updateInteractivity() {
    const currLayer = Store.getCurrLayer();

    this.forAll(currLayer, (id) => {
      let keyName = Key.getContent(id);

      if (hasLayerInName(keyName)) {
        Key.makeInteractive(id);
      } else {
        Key.removeInteractivity(id);
      }
    });
  },
  forAll(layerName, callback) {
    l = Store.data[layerName];
    for (row in l) {
      for (col in l[row]) {
        const id = `${row}x${col}`;
        callback(id, row, col);
      }
    }
  },
};

const Key = {
  setContent(id, val) {
    let span = document.getElementById(id).getElementsByTagName("span")[0];
    span.innerHTML = val;
  },
  getContent(id) {
    let span = document.getElementById(id).getElementsByTagName("span")[0];
    return span.innerHTML;
  },
  getTargetLayer(keyName) {
    return Store.layers.find((l) => {
      return keyName.includes(l);
    });
  },
  makeInteractive(id) {
    let keyDOM = document.getElementById(id);

    keyDOM.onclick = () => {
      this.clicked(id);
    };
    keyDOM.classList.add("clickeable");
  },
  removeInteractivity(id) {
    let keyDOM = document.getElementById(id);

    keyDOM.onclick = null;
    keyDOM.classList.remove("clickeable");
  },
  clicked(id) {
    const keyName = this.getContent(id);
    let targetLayer = this.getTargetLayer(keyName);

    if (targetLayer == Store.getCurrLayer()) {
      const activeLayer = Store.getCurrLayer();
      Nav.removeLayer(activeLayer);
      const newActiveLayer = Store.getCurrLayer();
      Keys.renderLayer(newActiveLayer);
    } else {
      Nav.addLayer(targetLayer);
      Keys.renderLayer(targetLayer);
    }
  },
  addFade(id) {
    let keyDOM = document.getElementById(id);

    keyDOM.classList.add("faded");
  },
  removeFade(id) {
    let keyDOM = document.getElementById(id);

    keyDOM.classList.remove("faded");
  },
  removeSquareBrackets(keyName) {
    const newName = keyName.replaceAll(/(^\[\s?)|(\s?\]$)/gm, "");
    return newName;
  },
};

function hasLayerInName(keyName) {
  return Store.layers.some((l) => {
    return keyName.includes(l);
  });
}

export { Keys, Key };
