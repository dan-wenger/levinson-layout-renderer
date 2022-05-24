export const Extract = {
  layoutData(src) {
    const srcLayers = src.split(/(?<=')$/m);
    let extracted = {};
    
    for (let i in srcLayers) {
      // iterate over Layers
      let name = extractLayerName(srcLayers[i]);
      let rows = extractRows(srcLayers[i]);

      let keys = rows.map((row, i) => {
        //iterate over rows
        if (i === 3) {
          return extractKeys(row, 6);
        } else {
          return extractKeys(row);
        }
      });

      extracted[name] = keys;
    }

    return extracted;
  },
  layerNames(src) {
    return Object.keys(src).map((lName) => {
      return lName;
    });
  },
};

// INTERNAL
function extractLayerName(layer) {
  return layer.match(/^\w+$/m)[0];
}
function extractRows(layer) {
  return layer.match(/^\|[^\-].+$/gm);
}
function extractKeys(row, twoUKeyAt) {
  let rowCleaned = row.replace(/((?<=\|)\s\|)|(^\|)|(\|$)/g, "");
  let keys = rowCleaned.match(/.{1,8}/g);

  let keysTwoUsMerged = [];
  for (let i = 0; i < keys.length; i++) {
    if (i == twoUKeyAt) {
      keysTwoUsMerged.push(`${keys[i]}${keys[i + 1]}`);
      i++;
    } else {
      keysTwoUsMerged.push(keys[i]);
    }
  }

  let keysCleaned = keysTwoUsMerged.map((key) => {
    return key.slice(0, -1);
  });

  return keysCleaned;
}
