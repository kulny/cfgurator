let configuredData = {};

document.addEventListener("DOMContentLoaded", function (event) {
  const keySelector = document.getElementById("key-selector");
  // const saveButton = document.getElementById('save')
  const dlButton = document.getElementById('download-button');

  let cfgDataDefault;
  fetch("./cfgDefault.json")
    .then((response) => response.json()).then((json) => {
      cfgDataDefault = json;
    });

  keySelector.addEventListener("click", (event) => {
    changeEditbox(event, cfgDataDefault);
  });
  save.addEventListener("click", (event) => {
    saveCfg();
  });

  addIDsToButtons();

  dlButton.addEventListener('click', function () {
    downloadCfg();

  }, false);
});

function addIDsToButtons() {
  for (let i = 0; i < document.querySelectorAll('button').length; i++) {
    const button = document.querySelectorAll('button')[i];
    if (button.innerHTML == '' || button.innerHTML.indexOf('arrow') != -1) {
      continue;
    }

    button.setAttribute('id', button.innerHTML.toLowerCase());
  }
}

function downloadCfg() {
  var link = document.createElement('a');
  link.setAttribute('download', 'autoexec.cfg');
  link.href = makeCfgFile();
  document.body.appendChild(link);

  window.requestAnimationFrame(function () {
    var event = new MouseEvent('click');
    link.dispatchEvent(event);
    document.body.removeChild(link);
  });
}

function saveCfg(){
  var keyboardKey = document.getElementById('cfg-options').dataset.keyboardKey.toLowerCase();
  var editbox = document.getElementById('editbox');

  configuredData[keyboardKey] = editbox.value;
  document.getElementById(keyboardKey.toLowerCase()).classList.add('edited-button')
  console.log(configuredData)
}

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

  if (configuredData[event.target.innerHTML.toLowerCase()]) {
    var bindEditBox = document.getElementById('editbox')
    bindEditBox.innerHTML = configuredData[event.target.innerHTML.toLowerCase()];
  } else {
    var bindEditBox = document.getElementById('editbox')
    bindEditBox.innerHTML = '';
  }
}

function buildDropdown(keyboardKey, bindEditor, json) {
  // replace select element if it exists
  if (bindEditor.firstElementChild.nodeName === 'select') {
    bindEditor.removeChild(bindEditor.firstElementChild);
  }
  // create select element
  var presetsSelector = document.createElement("select");
  presetsSelector.setAttribute("id", 'cfg-options' );
  // add the select element if it is not already there
  if(!bindEditor.contains(document.getElementById('cfg-options'))){
    bindEditor.prepend(presetsSelector);
  }

  var defaultOption = document.createElement('option');
  defaultOption.setAttribute('id', 'default');
  defaultOption.innerHTML = '--- Presets ---';
  defaultOption.value = '-1';
  var newChildren = [defaultOption];
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
  presetsSelector.setAttribute('data-keyboard-key', keyboardKey);

  presetsSelector.onchange = (event) => {
    populateEditbox(json);
  }
}

function populateEditbox(json){
  var selector = document.getElementById('cfg-options');
  console.log('popeditbox')
  var bindEditBox = document.getElementById('editbox')
  console.log(selector.dataset.keyboardKey);
  if (selector.value == -1) {
    bindEditBox.innerHTML = '';
  } else {
    bindEditBox.innerHTML = json[selector.dataset.keyboardKey.toLowerCase()][0][selector.value];
  }
}

var cfgFile = null,
  makeCfgFile = function () {
    var text = '';
    Object.keys(configuredData).forEach(element => {
      text += '## ' + element + '\n' + configuredData[element] + '\n';
    });

    var data = new Blob([text], {type: 'text/plain'});

    if (cfgFile !== null) {
      window.URL.revokeObjectURL(cfgFile);
    }

    cfgFile = window.URL.createObjectURL(data);

    return cfgFile;
  }