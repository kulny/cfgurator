
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

  buildDropdown(key, bindEditor, json);
  var editbox = document.getElementById("editbox");
  editbox.value = event.target.innerHTML;
}

function buildDropdown(key, bindEditor, json) {
  // var tag = '<select name="options" id="cfg-options"></select>';
  var tag = document.createElement("select");
  tag.setAttribute("id", 'cfg-options' );
  if(!bindEditor.contains(document.getElementById('cfg-options'))){
    bindEditor.prepend(tag);
  }
  for (const [key, value] of Object.entries(json)) {
    if (_.isEmpty(value[0])){
      continue;
    }
    const option = document.createElement("option");
    option.setAttribute('id', key);
    option.innerHTML = key;
    
    document.getElementById('cfg-options').appendChild(option);
  }
}
