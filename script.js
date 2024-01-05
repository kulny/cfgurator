//Javacript comments

document.addEventListener("DOMContentLoaded", function(event){
    const keySelector = document.getElementById('key-selector');

    keySelector.addEventListener('click', changeEditbox);
});

function changeEditbox(event){
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton){
        return;
    }
    var editbox = document.getElementById('editbox');
    editbox.value = event.target.innerHTML;
}
