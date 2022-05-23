// DOM ELEMENT VARIABLES
const $7ca75c43c592075b$export$cb0933279c36a66b = {
    layoutForm: document.querySelector("#layout-form"),
    layoutFormSubmit: document.querySelector("#layout-submit"),
    viewSwitcher: document.querySelector("#view-switcher"),
    layerNav: document.querySelector("#layer-nav"),
    keyboard: document.querySelector("#keyboard")
};
// GLOBAL VARIABLES
const $7ca75c43c592075b$export$390f32400eaf98c9 = {
    data: {},
    layers: [],
    layerStack: [],
    getCurrLayer () {
        return this.layerStack[this.layerStack.length - 1];
    },
    toLocalStorage (lData) {
        localStorage.setItem("KBLayoutData", JSON.stringify(lData));
    },
    fromLocalStorage () {
        return JSON.parse(localStorage.getItem("KBLayoutData"));
    },
    localStorageExists () {
        return this.fromLocalStorage() !== null;
    }
};


const $d4bc098ebe3c2c74$export$296daa4fd2384194 = {
    layoutData (src) {
        const srcLayers = src.split(/(?<=')$/m);
        let extracted = {};
        for(i in srcLayers){
            // iterate over Layers
            let name = $d4bc098ebe3c2c74$var$extractLayerName(srcLayers[i]);
            let rows = $d4bc098ebe3c2c74$var$extractRows(srcLayers[i]);
            let keys = rows.map((row, i)=>{
                //iterate over rows
                if (i === 3) return $d4bc098ebe3c2c74$var$extractKeys(row, 6);
                else return $d4bc098ebe3c2c74$var$extractKeys(row);
            });
            extracted[name] = keys;
        }
        return extracted;
    },
    layerNames (src) {
        return Object.keys(src).map((lName)=>{
            return lName;
        });
    }
};
// INTERNAL
function $d4bc098ebe3c2c74$var$extractLayerName(layer) {
    return layer.match(/^\w+$/m)[0];
}
function $d4bc098ebe3c2c74$var$extractRows(layer) {
    return layer.match(/^\|[^\-].+$/gm);
}
function $d4bc098ebe3c2c74$var$extractKeys(row, twoUKeyAt) {
    let rowCleaned = row.replace(/((?<=\|)\s\|)|(^\|)|(\|$)/g, "");
    let keys = rowCleaned.match(/.{1,8}/g);
    let keysTwoUsMerged = [];
    for(let i = 0; i < keys.length; i++)if (i == twoUKeyAt) {
        keysTwoUsMerged.push(`${keys[i]}${keys[i + 1]}`);
        i++;
    } else keysTwoUsMerged.push(keys[i]);
    let keysCleaned = keysTwoUsMerged.map((key)=>{
        return key.slice(0, -1);
    });
    return keysCleaned;
}





const $2858149b049d0c94$export$39140c7d8b0ba7b3 = {
    addLayer (layerName) {
        $7ca75c43c592075b$export$390f32400eaf98c9.layerStack.push(layerName);
        let btnDOM = document.createElement("button");
        btnDOM.innerHTML = layerName;
        btnDOM.classList.add("layer-btn");
        btnDOM.id = layerName;
        btnDOM.onclick = ()=>{
            this.clicked(layerName);
        };
        $7ca75c43c592075b$export$cb0933279c36a66b.layerNav.appendChild(btnDOM);
    },
    removeLayer (layerName) {
        $7ca75c43c592075b$export$390f32400eaf98c9.layerStack.pop();
        let layerToRemove = document.getElementById(layerName);
        layerToRemove.remove();
    },
    clicked (targetLayerName) {
        if (targetLayerName == $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer()) {
            if ($7ca75c43c592075b$export$390f32400eaf98c9.layerStack.length > 1) {
                const activeLayer = $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer();
                this.removeLayer(activeLayer);
                const newActiveLayer = $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer();
                $83af2abe3dabaeef$export$4b0075e5ea5e1f26.renderLayer(newActiveLayer);
            }
        } else {
            let currL = $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer();
            while(currL !== targetLayerName){
                this.removeLayer(currL);
                currL = $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer();
            }
            $83af2abe3dabaeef$export$4b0075e5ea5e1f26.renderLayer(targetLayerName);
        }
    }
};


const $83af2abe3dabaeef$export$4b0075e5ea5e1f26 = {
    renderLayer (layerName) {
        let layerData = $7ca75c43c592075b$export$390f32400eaf98c9.data[layerName];
        this.forAll(layerName, (id, r, c)=>{
            let keyData = layerData[r][c];
            const keyDOM = document.getElementById(id);
            keyDOM.classList.remove("pressed");
            if (keyData.match(/^(\s+)?_+(\s+)?$/m)) {
                $83af2abe3dabaeef$export$cd0f44441c3b7719.addFade(id);
                $83af2abe3dabaeef$export$cd0f44441c3b7719.setContent(id, "");
            } else {
                $83af2abe3dabaeef$export$cd0f44441c3b7719.removeFade(id);
                if ($83af2abe3dabaeef$export$cd0f44441c3b7719.getTargetLayer(keyData) === $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer()) {
                    $83af2abe3dabaeef$export$cd0f44441c3b7719.setContent(id, $83af2abe3dabaeef$export$cd0f44441c3b7719.removeSquareBrackets(keyData));
                    keyDOM.classList.add("pressed");
                } else $83af2abe3dabaeef$export$cd0f44441c3b7719.setContent(id, keyData);
            }
        });
        this.updateInteractivity();
    },
    updateInteractivity () {
        const currLayer = $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer();
        this.forAll(currLayer, (id)=>{
            let keyName = $83af2abe3dabaeef$export$cd0f44441c3b7719.getContent(id);
            if ($83af2abe3dabaeef$var$hasLayerInName(keyName)) $83af2abe3dabaeef$export$cd0f44441c3b7719.makeInteractive(id);
            else $83af2abe3dabaeef$export$cd0f44441c3b7719.removeInteractivity(id);
        });
    },
    forAll (layerName, callback) {
        l = $7ca75c43c592075b$export$390f32400eaf98c9.data[layerName];
        for(row in l)for(col in l[row]){
            const id = `${row}x${col}`;
            callback(id, row, col);
        }
    }
};
const $83af2abe3dabaeef$export$cd0f44441c3b7719 = {
    setContent (id, val) {
        let span = document.getElementById(id).getElementsByTagName("span")[0];
        span.innerHTML = val;
    },
    getContent (id) {
        let span = document.getElementById(id).getElementsByTagName("span")[0];
        return span.innerHTML;
    },
    getTargetLayer (keyName) {
        return $7ca75c43c592075b$export$390f32400eaf98c9.layers.find((l)=>{
            return keyName.includes(l);
        });
    },
    makeInteractive (id) {
        let keyDOM = document.getElementById(id);
        keyDOM.onclick = ()=>{
            this.clicked(id);
        };
        keyDOM.classList.add("clickeable");
    },
    removeInteractivity (id) {
        let keyDOM = document.getElementById(id);
        keyDOM.onclick = null;
        keyDOM.classList.remove("clickeable");
    },
    clicked (id) {
        const keyName = this.getContent(id);
        let targetLayer = this.getTargetLayer(keyName);
        if (targetLayer == $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer()) {
            const activeLayer = $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer();
            $2858149b049d0c94$export$39140c7d8b0ba7b3.removeLayer(activeLayer);
            const newActiveLayer = $7ca75c43c592075b$export$390f32400eaf98c9.getCurrLayer();
            $83af2abe3dabaeef$export$4b0075e5ea5e1f26.renderLayer(newActiveLayer);
        } else {
            $2858149b049d0c94$export$39140c7d8b0ba7b3.addLayer(targetLayer);
            $83af2abe3dabaeef$export$4b0075e5ea5e1f26.renderLayer(targetLayer);
        }
    },
    addFade (id) {
        let keyDOM = document.getElementById(id);
        keyDOM.classList.add("faded");
    },
    removeFade (id) {
        let keyDOM = document.getElementById(id);
        keyDOM.classList.remove("faded");
    },
    removeSquareBrackets (keyName) {
        const newName = keyName.replaceAll(/(^\[\s?)|(\s?\]$)/gm, "");
        return newName;
    }
};
function $83af2abe3dabaeef$var$hasLayerInName(keyName) {
    return $7ca75c43c592075b$export$390f32400eaf98c9.layers.some((l)=>{
        return keyName.includes(l);
    });
}



function $f9d83769637380d8$var$readLayout() {
    const srcText = $7ca75c43c592075b$export$cb0933279c36a66b.layoutForm.querySelector("textarea").value;
    $7ca75c43c592075b$export$390f32400eaf98c9.data = $d4bc098ebe3c2c74$export$296daa4fd2384194.layoutData(srcText);
    $7ca75c43c592075b$export$390f32400eaf98c9.layers = $d4bc098ebe3c2c74$export$296daa4fd2384194.layerNames($7ca75c43c592075b$export$390f32400eaf98c9.data);
    $f9d83769637380d8$var$switchToKeyboardView();
    if ($7ca75c43c592075b$export$390f32400eaf98c9.layerStack.length == 0) $2858149b049d0c94$export$39140c7d8b0ba7b3.addLayer("MAIN");
    $83af2abe3dabaeef$export$4b0075e5ea5e1f26.renderLayer("MAIN");
    $7ca75c43c592075b$export$390f32400eaf98c9.toLocalStorage($7ca75c43c592075b$export$390f32400eaf98c9.data);
}
// VIEWPORT FUNCTIONS
function $f9d83769637380d8$var$switchToFormView() {
    console.log("going to form view...");
    $7ca75c43c592075b$export$cb0933279c36a66b.keyboard.style.display = "none";
    $7ca75c43c592075b$export$cb0933279c36a66b.layerNav.style.display = "none";
    $7ca75c43c592075b$export$cb0933279c36a66b.viewSwitcher.style.display = "none";
    $7ca75c43c592075b$export$cb0933279c36a66b.layoutForm.style.removeProperty("display");
}
function $f9d83769637380d8$var$switchToKeyboardView() {
    console.log("going to keyboard view...");
    $7ca75c43c592075b$export$cb0933279c36a66b.layoutForm.style.display = "none";
    $7ca75c43c592075b$export$cb0933279c36a66b.keyboard.style.removeProperty("display");
    $7ca75c43c592075b$export$cb0933279c36a66b.layerNav.style.removeProperty("display");
    $7ca75c43c592075b$export$cb0933279c36a66b.viewSwitcher.style.removeProperty("display");
}
// [[ SETUP ]]
if ($7ca75c43c592075b$export$390f32400eaf98c9.localStorageExists()) {
    $7ca75c43c592075b$export$390f32400eaf98c9.data = $7ca75c43c592075b$export$390f32400eaf98c9.fromLocalStorage();
    $7ca75c43c592075b$export$390f32400eaf98c9.layers = $d4bc098ebe3c2c74$export$296daa4fd2384194.layerNames($7ca75c43c592075b$export$390f32400eaf98c9.data);
    $f9d83769637380d8$var$switchToKeyboardView();
    $2858149b049d0c94$export$39140c7d8b0ba7b3.addLayer("MAIN");
    $83af2abe3dabaeef$export$4b0075e5ea5e1f26.renderLayer("MAIN");
} else $f9d83769637380d8$var$switchToFormView();
$7ca75c43c592075b$export$cb0933279c36a66b.layoutFormSubmit.addEventListener("click", $f9d83769637380d8$var$readLayout);
$7ca75c43c592075b$export$cb0933279c36a66b.viewSwitcher.addEventListener("click", $f9d83769637380d8$var$switchToFormView);


//# sourceMappingURL=index.183e1d30.js.map
