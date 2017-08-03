var queryInfo = {
active: true,
currentWindow: true
};

chrome.tabs.query(queryInfo, function(tabs) {

    var tab = tabs[0];
    var url = tab.url;

    if(url){
        chrome.storage.sync.get([url], function(result) {   

            if(result[url]){
                result[url].forEach(note => {
                    $("#points ul").append('<li>' + note + '<button> edit </button> <button class="delete" id="' + note + '"> delete </button>' + '</li>');
                })
            }
        });
    }
})  


function deleteNote(text) {
    chrome.tabs.query(queryInfo, function(tabs) {

        var tab = tabs[0];
        var url = tab.url;

        if(url){
            chrome.storage.sync.get([url], function(result) {      

                let first = result[url].slice(0,result[url].indexOf(text));
                let last = result[url].slice(result[url].indexOf(text)+1);
                result[url] = [...first, ...last];

                console.log('hellloooo?')
                let background = chrome.extension.getBackgroundPage();
                background.deletedNote(result[url]);


            });
        }
    });
}




// pop out your notes??
function showDialog(){
    chrome.windows.create({
        url: 'dialog.html',
        width: 200,
        height: 120,
        type: 'popup'
    });
}  
function editNote(e){
   if(e.target.outerText === 'delete'){
        deleteNote(e.target.id);
   }
}  

function init() {
    let dialog = document.querySelector('#dialog');
    dialog.addEventListener('click', showDialog, false);

    let notes = document.querySelector('#points');
    notes.addEventListener('click', editNote, false)

}    



document.addEventListener('DOMContentLoaded', init);