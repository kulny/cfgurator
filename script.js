
document.addEventListener("DOMContentLoaded", function (event) {
  const keySelector = document.getElementById("key-selector");

  let cfgData;
  const defaultCfg =  fetch("./cfgDefault.json")
    .then((response) => response.json()).then((json) => {
      cfgData = json;
    });

    console.log(cfgData);

  keySelector.addEventListener("click", (event) => {
    changeEditbox(event, cfgData);
  });
});

function changeEditbox(event, json) {
  const isButton = event.target.nodeName === "BUTTON";
  if (!isButton) {
    return;
  }
  var bindEditor = document.getElementById("bind-editor");
  var key = event.target.innerHTML;
  console.log(json);

  if (key.toLowerCase() == 'dev') {
    var presetsSelector = document.getElementById('cfg-options');
    var devSelect = document.createElement('option');
    devSelect.innerHTML = 'devTest';
    presetsSelector.replaceChildren(devSelect);
    return;
  }

  buildDropdown(key, bindEditor, json);
}

function buildDropdown(keyboardKey, bindEditor, json) {
  // replace select element if it exists
  if (bindEditor.firstElementChild.nodeName === 'select') {
    bindEditor.removeChild(bindEditor.firstElementChild);
  }
  // create select element
  var presetsSelector = document.createElement("select");
  presetsSelector.setAttribute("id", 'cfg-options' );
  presetsSelector.setAttribute('data-keyboard-key', keyboardKey);
  // add the select element if it is not already there
  if(!bindEditor.contains(document.getElementById('cfg-options'))){
    bindEditor.prepend(presetsSelector);
  }

  var newChildren = [];
  // get the cfg options from json and make option elements from them
  for (var item in json[keyboardKey.toLowerCase()][0]) {

    const option = document.createElement("option");
    option.setAttribute('id', item);
    option.innerHTML = item;
    option.value = item;
    
    newChildren.push(option);
  }
  // the 'current' presetsSelector could be the manufactured one which will not replace the one 
  // that is already there, so we must redefine it as the one that is already in the DOM
  presetsSelector = document.getElementById('cfg-options');
  presetsSelector.replaceChildren(...newChildren);

  // presetsSelector.addEventListener('change', populateEditbox(json));
  presetsSelector.onchange = (event) => {
    populateEditbox(json);
  }
}

function populateEditbox(json){
  var selector = document.getElementById('cfg-options');
  console.log('popeditbox')
  var bindEditBox = document.getElementById('editbox')
  console.log(selector.value);
  bindEditBox.innerHTML = selector.value;
  // bindEditBox.innerHTML = json[selector.dataset.keyboardKey.toLowerCase()][0][selector.value];
}