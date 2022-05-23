(function () {
// DOM ELEMENT VARIABLES
var $1d10439ed30113bc$export$cb0933279c36a66b = {
    layoutForm: document.querySelector("#layout-form"),
    layoutFormSubmit: document.querySelector("#layout-submit"),
    viewSwitcher: document.querySelector("#view-switcher"),
    layerNav: document.querySelector("#layer-nav"),
    keyboard: document.querySelector("#keyboard")
};
// GLOBAL VARIABLES
var $1d10439ed30113bc$export$390f32400eaf98c9 = {
    data: {},
    layers: [],
    layerStack: [],
    getCurrLayer: function() {
        return this.layerStack[this.layerStack.length - 1];
    },
    toLocalStorage: function(lData) {
        localStorage.setItem("KBLayoutData", JSON.stringify(lData));
    },
    fromLocalStorage: function() {
        return JSON.parse(localStorage.getItem("KBLayoutData"));
    },
    localStorageExists: function() {
        return this.fromLocalStorage() !== null;
    }
};


var $532e48d753ec596d$export$296daa4fd2384194 = {
    layoutData: function(src) {
        var srcLayers = src.split(RegExp("(?<=')$", "m"));
        var extracted = {};
        for(i in srcLayers){
            // iterate over Layers
            var name = $532e48d753ec596d$var$extractLayerName(srcLayers[i]);
            var rows = $532e48d753ec596d$var$extractRows(srcLayers[i]);
            var keys = rows.map(function(row, i) {
                //iterate over rows
                if (i === 3) return $532e48d753ec596d$var$extractKeys(row, 6);
                else return $532e48d753ec596d$var$extractKeys(row);
            });
            extracted[name] = keys;
        }
        return extracted;
    },
    layerNames: function(src) {
        return Object.keys(src).map(function(lName) {
            return lName;
        });
    }
};
// INTERNAL
function $532e48d753ec596d$var$extractLayerName(layer) {
    return layer.match(/^\w+$/m)[0];
}
function $532e48d753ec596d$var$extractRows(layer) {
    return layer.match(/^\|[^\-].+$/gm);
}
function $532e48d753ec596d$var$extractKeys(row, twoUKeyAt) {
    var rowCleaned = row.replace(RegExp("((?<=\\|)\\s\\|)|(^\\|)|(\\|$)", "g"), "");
    var keys = rowCleaned.match(/.{1,8}/g);
    var keysTwoUsMerged = [];
    for(var i = 0; i < keys.length; i++)if (i == twoUKeyAt) {
        keysTwoUsMerged.push("".concat(keys[i]).concat(keys[i + 1]));
        i++;
    } else keysTwoUsMerged.push(keys[i]);
    var keysCleaned = keysTwoUsMerged.map(function(key) {
        return key.slice(0, -1);
    });
    return keysCleaned;
}





var $9ed66bdaffd26b14$export$39140c7d8b0ba7b3 = {
    addLayer: function(layerName) {
        var _this = this;
        $1d10439ed30113bc$export$390f32400eaf98c9.layerStack.push(layerName);
        var btnDOM = document.createElement("button");
        btnDOM.innerHTML = layerName;
        btnDOM.classList.add("layer-btn");
        btnDOM.id = layerName;
        btnDOM.onclick = function() {
            _this.clicked(layerName);
        };
        $1d10439ed30113bc$export$cb0933279c36a66b.layerNav.appendChild(btnDOM);
    },
    removeLayer: function(layerName) {
        $1d10439ed30113bc$export$390f32400eaf98c9.layerStack.pop();
        var layerToRemove = document.getElementById(layerName);
        layerToRemove.remove();
    },
    clicked: function(targetLayerName) {
        if (targetLayerName == $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer()) {
            if ($1d10439ed30113bc$export$390f32400eaf98c9.layerStack.length > 1) {
                var activeLayer = $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer();
                this.removeLayer(activeLayer);
                var newActiveLayer = $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer();
                $784a1f0f7ae57548$export$4b0075e5ea5e1f26.renderLayer(newActiveLayer);
            }
        } else {
            var currL = $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer();
            while(currL !== targetLayerName){
                this.removeLayer(currL);
                currL = $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer();
            }
            $784a1f0f7ae57548$export$4b0075e5ea5e1f26.renderLayer(targetLayerName);
        }
    }
};


var $784a1f0f7ae57548$export$4b0075e5ea5e1f26 = {
    renderLayer: function(layerName) {
        var layerData = $1d10439ed30113bc$export$390f32400eaf98c9.data[layerName];
        this.forAll(layerName, function(id, r, c) {
            var keyData = layerData[r][c];
            var keyDOM = document.getElementById(id);
            keyDOM.classList.remove("pressed");
            if (keyData.match(/^(\s+)?_+(\s+)?$/m)) {
                $784a1f0f7ae57548$export$cd0f44441c3b7719.addFade(id);
                $784a1f0f7ae57548$export$cd0f44441c3b7719.setContent(id, "");
            } else {
                $784a1f0f7ae57548$export$cd0f44441c3b7719.removeFade(id);
                if ($784a1f0f7ae57548$export$cd0f44441c3b7719.getTargetLayer(keyData) === $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer()) {
                    $784a1f0f7ae57548$export$cd0f44441c3b7719.setContent(id, $784a1f0f7ae57548$export$cd0f44441c3b7719.removeSquareBrackets(keyData));
                    keyDOM.classList.add("pressed");
                } else $784a1f0f7ae57548$export$cd0f44441c3b7719.setContent(id, keyData);
            }
        });
        this.updateInteractivity();
    },
    updateInteractivity: function() {
        var currLayer = $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer();
        this.forAll(currLayer, function(id) {
            var keyName = $784a1f0f7ae57548$export$cd0f44441c3b7719.getContent(id);
            if ($784a1f0f7ae57548$var$hasLayerInName(keyName)) $784a1f0f7ae57548$export$cd0f44441c3b7719.makeInteractive(id);
            else $784a1f0f7ae57548$export$cd0f44441c3b7719.removeInteractivity(id);
        });
    },
    forAll: function(layerName, callback) {
        l = $1d10439ed30113bc$export$390f32400eaf98c9.data[layerName];
        for(row in l)for(col in l[row]){
            var id = "".concat(row, "x").concat(col);
            callback(id, row, col);
        }
    }
};
var $784a1f0f7ae57548$export$cd0f44441c3b7719 = {
    setContent: function(id, val) {
        var span = document.getElementById(id).getElementsByTagName("span")[0];
        span.innerHTML = val;
    },
    getContent: function(id) {
        var span = document.getElementById(id).getElementsByTagName("span")[0];
        return span.innerHTML;
    },
    getTargetLayer: function(keyName) {
        return $1d10439ed30113bc$export$390f32400eaf98c9.layers.find(function(l) {
            return keyName.includes(l);
        });
    },
    makeInteractive: function(id) {
        var _this = this;
        var keyDOM = document.getElementById(id);
        keyDOM.onclick = function() {
            _this.clicked(id);
        };
        keyDOM.classList.add("clickeable");
    },
    removeInteractivity: function(id) {
        var keyDOM = document.getElementById(id);
        keyDOM.onclick = null;
        keyDOM.classList.remove("clickeable");
    },
    clicked: function(id) {
        var keyName = this.getContent(id);
        var targetLayer = this.getTargetLayer(keyName);
        if (targetLayer == $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer()) {
            var activeLayer = $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer();
            $9ed66bdaffd26b14$export$39140c7d8b0ba7b3.removeLayer(activeLayer);
            var newActiveLayer = $1d10439ed30113bc$export$390f32400eaf98c9.getCurrLayer();
            $784a1f0f7ae57548$export$4b0075e5ea5e1f26.renderLayer(newActiveLayer);
        } else {
            $9ed66bdaffd26b14$export$39140c7d8b0ba7b3.addLayer(targetLayer);
            $784a1f0f7ae57548$export$4b0075e5ea5e1f26.renderLayer(targetLayer);
        }
    },
    addFade: function(id) {
        var keyDOM = document.getElementById(id);
        keyDOM.classList.add("faded");
    },
    removeFade: function(id) {
        var keyDOM = document.getElementById(id);
        keyDOM.classList.remove("faded");
    },
    removeSquareBrackets: function(keyName) {
        var newName = keyName.replaceAll(/(^\[\s?)|(\s?\]$)/gm, "");
        return newName;
    }
};
function $784a1f0f7ae57548$var$hasLayerInName(keyName) {
    return $1d10439ed30113bc$export$390f32400eaf98c9.layers.some(function(l) {
        return keyName.includes(l);
    });
}



function $02096351441826cb$var$readLayout() {
    var srcText = $1d10439ed30113bc$export$cb0933279c36a66b.layoutForm.querySelector("textarea").value;
    $1d10439ed30113bc$export$390f32400eaf98c9.data = $532e48d753ec596d$export$296daa4fd2384194.layoutData(srcText);
    $1d10439ed30113bc$export$390f32400eaf98c9.layers = $532e48d753ec596d$export$296daa4fd2384194.layerNames($1d10439ed30113bc$export$390f32400eaf98c9.data);
    $02096351441826cb$var$switchToKeyboardView();
    if ($1d10439ed30113bc$export$390f32400eaf98c9.layerStack.length == 0) $9ed66bdaffd26b14$export$39140c7d8b0ba7b3.addLayer("MAIN");
    $784a1f0f7ae57548$export$4b0075e5ea5e1f26.renderLayer("MAIN");
    $1d10439ed30113bc$export$390f32400eaf98c9.toLocalStorage($1d10439ed30113bc$export$390f32400eaf98c9.data);
}
// VIEWPORT FUNCTIONS
function $02096351441826cb$var$switchToFormView() {
    console.log("going to form view...");
    $1d10439ed30113bc$export$cb0933279c36a66b.keyboard.style.display = "none";
    $1d10439ed30113bc$export$cb0933279c36a66b.layerNav.style.display = "none";
    $1d10439ed30113bc$export$cb0933279c36a66b.viewSwitcher.style.display = "none";
    $1d10439ed30113bc$export$cb0933279c36a66b.layoutForm.style.removeProperty("display");
}
function $02096351441826cb$var$switchToKeyboardView() {
    console.log("going to keyboard view...");
    $1d10439ed30113bc$export$cb0933279c36a66b.layoutForm.style.display = "none";
    $1d10439ed30113bc$export$cb0933279c36a66b.keyboard.style.removeProperty("display");
    $1d10439ed30113bc$export$cb0933279c36a66b.layerNav.style.removeProperty("display");
    $1d10439ed30113bc$export$cb0933279c36a66b.viewSwitcher.style.removeProperty("display");
}
// [[ SETUP ]]
if ($1d10439ed30113bc$export$390f32400eaf98c9.localStorageExists()) {
    $1d10439ed30113bc$export$390f32400eaf98c9.data = $1d10439ed30113bc$export$390f32400eaf98c9.fromLocalStorage();
    $1d10439ed30113bc$export$390f32400eaf98c9.layers = $532e48d753ec596d$export$296daa4fd2384194.layerNames($1d10439ed30113bc$export$390f32400eaf98c9.data);
    $02096351441826cb$var$switchToKeyboardView();
    $9ed66bdaffd26b14$export$39140c7d8b0ba7b3.addLayer("MAIN");
    $784a1f0f7ae57548$export$4b0075e5ea5e1f26.renderLayer("MAIN");
} else $02096351441826cb$var$switchToFormView();
$1d10439ed30113bc$export$cb0933279c36a66b.layoutFormSubmit.addEventListener("click", $02096351441826cb$var$readLayout);
$1d10439ed30113bc$export$cb0933279c36a66b.viewSwitcher.addEventListener("click", $02096351441826cb$var$switchToFormView);

})();
//# sourceMappingURL=index.a0658191.js.map
