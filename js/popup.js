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
                    if(note){
                        let noteID = note.replace(/\W+/g, "")
                        $("#points ul").append('<li id="' + noteID + 'note' + '">' + note + '<button> edit </button> <button class="delete" id="' + note + '"> delete </button>' + '</li>');
                    }
                })
            }
            // maybe move this to init?
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
                let first = result[url].slice(0,result[url].indexOf(text));
                let last = result[url].slice(result[url].indexOf(text)+1);
                result[url] = [...first, ...last];

                text = text.replace(/\W+/g, "")
                let id = '#' + text + 'note';
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
                let siteClass = sites[i].replace(/\W+/g, "");
                $("#sites ul").append('<li id="' + sites[i] + '" class =' +  siteClass + '>' + '<a href=' + sites[i] + '>' + title + '</a> <button class="deleteSite" id="' + sites[i] + '"> remove site </button>' + '</li>');
            })
        }
    });
}


function editNote(){
    
}

function deleteSite(url){  
    chrome.storage.sync.get([url], function(result) { 
        let theClass = "." + url.replace(/\W+/g, "")
        $(theClass).hide();     
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

function handleNote(e){
    if(e.target.outerText === 'delete'){
        deleteNote(e.target.id);
    }
    else if(e.target.outerText === 'edit'){
        editNote(e.target.id);
    }   
}  

function handleSites(e){
    let site = e.target.id, url = e.target.href;
    if(e.target.outerText === 'remove site'){
        deleteSite(site)
    }
    else {
        $("#single").hide();
        $("#all").hide();
        $("#specific").fadeIn();
        $("#spec").text(url);
        $("#specificPoints ul").empty()
        
        chrome.storage.sync.get([url], function(result) {  
        result[url].forEach(note => {
                let noteID = note.replace(/\W+/g, "")
                    $("#specificPoints ul").append('<li id="' + noteID + 'note' + '">' + note + '<button> edit </button> <button class="delete" id="' + note + '"> delete </button>' + '</li>');
                })
        });
        
    }
}


function init() {

    let dialog = document.querySelector('#dialog');
    dialog.addEventListener('click', showDialog, false);

    let notes = document.querySelector('#points');
    notes.addEventListener('click', handleNote, false)
    
    let spec = document.querySelector('#spec');
    spec.addEventListener('click', handleNote, false)

    $("#all").hide();
    $("#specific").hide();

    $("#showHome").click(function(){

        $("#single").hide();
        $("#specific").hide();
        $("#all").fadeIn();
    });

    $("#showSingle").click(function(){
        $("#all").hide();
        $("#specific").hide();
        $("#single").fadeIn();
    });

    getAllNotes();

    let pages = document.querySelector('#sites');
    pages.addEventListener('click', handleSites, false)
}    



document.addEventListener('DOMContentLoaded', init);