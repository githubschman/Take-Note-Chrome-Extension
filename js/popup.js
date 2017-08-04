let queryInfo = {
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
                    let noteID = note.replace(/\W+/g, "")
                    $("#points ul").append('<li id="' + noteID + 'note' + '">' + note + '<button> edit </button> <button class="delete" id="' + note + '"> delete </button>' + '</li>');
                })
            }
            // $("#pointz ul").append('<li>lol this prob wont work lol</li>')
        });
    }
})  


function deleteNote(text) {
    chrome.tabs.query(queryInfo, function(tabs) {

        var tab = tabs[0];
        var url = tab.url;

        if(url){
            chrome.storage.sync.get([url], function(result) {      
                console.log(result[url])
                let first = result[url].slice(0,result[url].indexOf(text));
                let last = result[url].slice(result[url].indexOf(text)+1);
                result[url] = [...first, ...last];

                text = text.replace(/\W+/g, "")
                let id = '#' + text + 'note';
                console.log(id)
                $(id).hide();

                let background = chrome.extension.getBackgroundPage();
                background.deletedNote(result[url]);


            });
        }
    });
}  


function getAllNotes(){
    chrome.storage.sync.get(null, function(result) {
        let titles = [], sites = [];
        if(result){
            for(let address in result){
                if(result[address]){
                    if(address.indexOf('www') < 0){
                        titles.push(address.slice(address.indexOf('//')+2, address.indexOf('.com')))
                    }else{
                        titles.push(address.slice(address.indexOf('www')+4, address.indexOf('.com')))
                    }
                    sites.push(address)
                }
            }
            titles.forEach((title, i) => {
                $("#sites ul").append('<li id="' + sites[i] + '">' + '<a href=' + sites[i] + '>' + title + '</a> <button class="deleteSite" id="' + sites[i] + '"> remove site </button>' + '</li>');
            })
        }
    });
}


function editNote(){
    
}

function deleteSite(url){  
    chrome.storage.sync.get([url], function(result) {      
        result[url] = null;
        let background = chrome.extension.getBackgroundPage();
        background.deletedSite(url);
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
    else if(e.target.outerText === 'edit'){
        editNote(e.target.id);
    }   
}  

function handleSites(e){
    let site = e.target.id, link = e.target.href;
    if(e.target.outerText === 'remove site'){
        deleteSite(site)
    }
    else {
        chrome.tabs.create({url: link});
    }
}


function init() {

    let dialog = document.querySelector('#dialog');
    dialog.addEventListener('click', showDialog, false);

    let notes = document.querySelector('#points');
    notes.addEventListener('click', editNote, false)

    $("#all").hide();

    $("#showHome").click(function(){
        $("#all").show();
        $("#single").hide();
    });

    $("#showSingle").click(function(){
        $("#all").hide();
        $("#single").show();
    });

    getAllNotes();

    let pages = document.querySelector('#sites');
    pages.addEventListener('click', handleSites, false)
}    



document.addEventListener('DOMContentLoaded', init);