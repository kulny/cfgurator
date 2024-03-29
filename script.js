let configuredData = {};
let currentKeyboardKey = "";

document.addEventListener("DOMContentLoaded", function (event) {
  const keySelector = $("#key-selector");
  const saveButton = $('#save')
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
  saveButton.on("click", (event) => {
    saveCfg();
  });
  $("#cfg-options").addClass("hidden");

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
  for (let i = 0; i < $("#key-selector button").length; i++) {
    $("#key-selector button").each(
      function(index) {
        if ($(this).text() == "" || $(this).text().indexOf("arrow") != -1) {
          // do nothing because in this case we get the empty or arrow key buttons, which have no use or already have id's (the arrow keys have ids)
        } else {
          $(this).attr("id", $(this).text().toLowerCase());
        }
      }
    )
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
  var keyboardKey = $("#cfg-options").attr("data-keyboard-key").toLowerCase();
  var editbox = $("#editbox");

  configuredData[keyboardKey] = editbox.val();
  $(`#${keyboardKey}`).addClass("edited-button");

  displayFinalCFG();
}

function displayFinalCFG(){
  var finalCfg = $("#final-edit-box");
  var cfgString = '';
  for(var item in configuredData){
    cfgString += configuredData[item] + "\n\n";
  }
  finalCfg.val(cfgString);
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

  // clear dropdown preset options after clicking a different key
  if (currentKeyboardKey != keyboardKey) {
    presetsSelector.empty();
  }
  currentKeyboardKey = keyboardKey;

  presetsSelector.removeClass("hidden");

  var defaultOption = $(
    "<option id='default' value='-1'>--- Presets ---</option>"
  );
  console.log(defaultOption);
    if (!presetsSelector.has("#default").length > 0) {
      presetsSelector.append(
        $("<option>", {
          id: "default",
          value: -1,
          text: "--- Presets ---",
        })
      );
    }
  
  // get the cfg options from json and make option elements from them
  for (var item in json[keyboardKey.toLowerCase()][0]) {
    if (!presetsSelector.has(`#${item}`).length > 0) {
      presetsSelector.append(
        $("<option>", {
          id: item,
          value: item,
          text: item,
        })
      );
    }
  }
  presetsSelector.attr("data-keyboard-key", keyboardKey);
  console.log(presetsSelector);

  presetsSelector.on("change", (event) => {
    populateEditbox(json);
  });
}

function populateEditbox(json) {
  var selector = $("#cfg-options");
  var bindEditBox = $("#editbox");
  if (selector.val() == -1) {
    console.log("tried to clear")
    bindEditBox.val("");
  } else {
    bindEditBox.val(
      json[selector.attr("data-keyboard-key").toLowerCase()][0][
        selector.val()
      ]);
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
