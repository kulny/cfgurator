let configuredData = {};

document.addEventListener("DOMContentLoaded", function (event) {
  const keySelector = $("#key-selector");
  // const saveButton = $('#save')
  const dlButton = $("#download-button");

  let cfgDataDefault;
  fetch("./cfgDefault.json")
    .then((response) => response.json())
    .then((json) => {
      cfgDataDefault = json;
    });

  keySelector.on("click", (event) => {
    changeEditbox(event, cfgDataDefault);
  });
  // save.on("click", (event) => {
  //   saveCfg();
  // });

  addIDsToButtons();

  dlButton.on(
    "click",
    function () {
      downloadCfg();
    },
    false
  );
});

function addIDsToButtons() {
  for (let i = 0; i < $("key-selector button").length; i++) {
    const button = $("key-selector button")[i];
    if (button.innerHTML == "" || button.innerHTML.indexOf("arrow") != -1) {
      continue;
    }

    button.attr("id", button.innerHTML.toLowerCase());
  }
}

function downloadCfg() {
  var link = document.createElement("a");
  link.setAttribute("download", "autoexec.cfg");
  link.href = makeCfgFile();
  document.body.appendChild(link);

  window.requestAnimationFrame(function () {
    var event = new MouseEvent("click");
    link.dispatchEvent(event);
    document.body.removeChild(link);
  });
}

function saveCfg() {
  var keyboardKey = document
    .getElementById("cfg-options")
    .dataset.keyboardKey.toLowerCase();
  var editbox = document.getElementById("editbox");

  configuredData[keyboardKey] = editbox.value;
  document
    .getElementById(keyboardKey.toLowerCase())
    .classList.add("edited-button");
  console.log(configuredData);
}

function changeEditbox(event, json) {
  const isButton = event.target.nodeName === "BUTTON";
  if (!isButton) {
    return;
  }
  var bindEditor = document.getElementById("bind-editor");
  var key = event.target.innerHTML;
  console.log(json);

  if (key.toLowerCase() == "dev") {
    var presetsSelector = document.getElementById("cfg-options");
    var devSelect = document.createElement("option");
    devSelect.innerHTML = "devTest";
    presetsSelector.replaceChildren(devSelect);
    return;
  }

  buildDropdown(key, bindEditor, json);

  if (configuredData[event.target.innerHTML.toLowerCase()]) {
    var bindEditBox = document.getElementById("editbox");
    bindEditBox.innerHTML =
      configuredData[event.target.innerHTML.toLowerCase()];
  } else {
    var bindEditBox = document.getElementById("editbox");
    bindEditBox.innerHTML = "";
  }
}

function buildDropdown(keyboardKey, bindEditor, json) {
  var presetsSelector = $("#cfg-options");

  var defaultOption = $("<option id='default' value='-1'>--- Presets ---</option>");
  console.log(defaultOption)
  var newChildren = [defaultOption];

  presetsSelector.append($('<option>', {
    id: "default",
    value: -1,
    text: "--- Presets ---",
  }));
  // get the cfg options from json and make option elements from them
  for (var item in json[keyboardKey.toLowerCase()][0]) {
    presetsSelector.append($("<option>", {
      id: item,
      value: item,
      text: item,
    }));
  }
  presetsSelector.attr("data-keyboard-key", keyboardKey);
  console.log(presetsSelector)

  // presetsSelector.onchange = (event) => {
  //   populateEditbox(json);
  // };
  presetsSelector.on("change", () => {
    populateEditbox(json);
  });
}

function populateEditbox(json) {
  var selector = $("#cfg-options");
  console.log("popeditbox");
  var bindEditBox = $("#editbox");
  console.log(selector.dataset.keyboardKey);
  if (selector.value == -1) {
    bindEditBox.innerHTML = "";
  } else {
    bindEditBox.innerHTML =
      json[selector.dataset.keyboardKey.toLowerCase()][0][selector.value];
  }
}

var cfgFile = null,
  makeCfgFile = function () {
    var text = "";
    Object.keys(configuredData).forEach((element) => {
      text += "## " + element + "\n" + configuredData[element] + "\n";
    });

    var data = new Blob([text], { type: "text/plain" });

    if (cfgFile !== null) {
      window.URL.revokeObjectURL(cfgFile);
    }

    cfgFile = window.URL.createObjectURL(data);

    return cfgFile;
  };
