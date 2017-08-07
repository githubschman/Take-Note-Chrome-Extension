let queryInfo = {
active: true,
currentWindow: true
};

let tempText = "";

function containsCode(text){
  let test = 0;
  text.indexOf('var') > -1 ? test += 3 : test; text.indexOf('const') > -1 ? test += 3 : test; text.indexOf('function') > -1 ? test += 5 : test; text.indexOf('{') > -1 ? test += 4 : test; text.indexOf('}') > -1 ? test += 4 : test; text.indexOf(';') > -1 ? test += 5 : test; text.indexOf('def') > -1 ? test += 3 : test; text.indexOf('<') > -1 ? test += 5 : test; text.indexOf('>') > -1 ? test += 5 : test;
  return test > 10;
}

chrome.tabs.query(queryInfo, function(tabs) {

    var tab = tabs[0];
    var url = tab.url;

    if(url){
        chrome.storage.sync.get([url], function(result) {   

            if(result[url]){
                result[url].forEach(note => {
                    if(note){
                        let content, edit;
                        if(containsCode(note)){
                            edit = ""
                            content = '<pre class="prettyprint">' + note + '</pre>'
                        }else{
                            edit = '<button id="' + note + '"> edit </button>' 
                            content = note;
                        }

                        console.log(content)
                        let noteID = note.replace(/\W+/g, "")
                        $("#points ul").append('<li id="' + noteID + 'note' + '">' + content + edit + '<button class="delete" id="' + note + '"> delete </button>' + '</li>');
                    }
                })
            }
            // maybe move this to init? For popping out text!
            // $("#pointz ul").append('<li>lol this prob wont work lol</li>')
        });
    }
})  

function formatAddress(address) {
    let com = address.indexOf('.com') < 0 ? address.indexOf('.org') : address.indexOf('.com');

    if(address.indexOf('//') > -1 && address.indexOf('www') < 0){
        address = address.slice(address.indexOf('//')+2, com);
    }else if(address.indexOf('www')){
        address = address.slice(address.indexOf('www')+4, com);
    }
    else{
        address = address.slice(address.indexOf(0, com));
    }
    return address;
}


function getAllNotes(){
    chrome.storage.sync.get(null, function(result) {
        let titles = [], sites = [];
        if(result){
            for(let address in result){
                if(result[address]){ 
                    let formatted = formatAddress(address)
                    titles.push(formatted)
                    sites.push(address);
                }
            }
            titles.forEach((title, i) => {
                let siteClass = sites[i].replace(/\W+/g, "");
                $("#sites ul").append('<li id="' + sites[i] + '" class =' +  siteClass + '>' + '<a href=' + sites[i] + '>' + title + '</a> <button class="deleteSite" id="' + sites[i] + '"> remove site </button>' + '</li>');
            })
        }
    });
}

/// EVENT HANDLERS
function handleSites(e){
    let site = e.target.id, url = e.target.href;
 
    if(e.target.outerText === 'remove site'){
        deleteSite(site)
    }
    else { //SPECIFIC SITE
        $("#single").hide();
        $("#all").hide();
        $("#specific").fadeIn();
        $("#spec").text(formatAddress(url));
        $("#specificPoints ul").empty()
        let editSpec = document.querySelector('#editSpec')
        editSpec.name = url;
        chrome.storage.sync.get([url], function(result) {  
        result[url].forEach(note => {
                let noteID = note.replace(/\W+/g, "")
                    $("#specificPoints ul").append('<li id="' + noteID + 'note' + '">' + note + '</li>');
                })
        });
        
    }
}


function editNote(text){ // this just makes the form visible.
    $("#noteInput").val(text);
    let form = $("#form");
    $("#form").fadeIn();
    tempText = text; // caches text to be deleted
}


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


function deleteSite(url){
    chrome.storage.sync.get([url], function(result) { 
        let theClass = "." + url.replace(/\W+/g, "");
        $(theClass).hide();     
        result[url] = null;
        let background = chrome.extension.getBackgroundPage();
        background.deletedSite(url);
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

function goToSite(e){
    chrome.tabs.create({url: e.target.name});
}

function submitNewNote(e){
   e.preventDefault(); //
   console.log(tempText)
    let newNote = e.target["0"].value;
    
    chrome.tabs.query(queryInfo, function(tabs) {
    
        var tab = tabs[0];
        var url = tab.url;

        if(url){
            
            chrome.storage.sync.get([url], function(result) {
                
                let first = result[url].slice(0,result[url].indexOf(tempText));
                let last = result[url].slice(result[url].indexOf(tempText)+1);
                result[url] = [...first, ...last];
                tempID = tempText.replace(/\W+/g, "")
                let id = '#' + tempID + 'note';
                $(id).hide();

                let background = chrome.extension.getBackgroundPage();
                background.deletedNote(result[url]);

                if(result[url].indexOf(newNote) < 0){
                    result[url].push(newNote);
                    let noteID = newNote.replace(/\W+/g, '')
                    $("#points ul").append('<li id="' + noteID + 'note' + '">' + newNote + '<button id="' + newNote + '"> edit </button> <button class="delete" id="' + newNote + '"> delete </button>' + '</li>');
                }
                chrome.storage.sync.set(result, function() {});
            });
        }
    });
    $("#form").hide();
}

function cancelSubmit(e) {
    if(e.srcElement.defaultValue === 'Cancel'){
        $("#form").hide(); 
    }
}

function init() {

    let dialog = document.querySelector('#dialog');
    dialog.addEventListener('click', showDialog, false);

    let notes = document.querySelector('#points');
    notes.addEventListener('click', handleNote, false)

    let editSpec = document.querySelector('#editSpec');
    editSpec.addEventListener('click', goToSite, false);
    
    document.getElementById("editForm").addEventListener('submit', submitNewNote, false);
    document.getElementById("editForm").addEventListener('click', cancelSubmit, false);
    document.body.addEventListener('load', PR.prettyPrint())

    $("#all").hide();
    $("#form").hide();
    $("#specific").hide();

    $("#showHome").click(function(){
        $("#form").hide();
        $("#single").hide();
        $("#specific").hide();
        $("#all").fadeIn();
    });

    $("#showSingle").click(function(){
        $("#form").hide();
        $("#all").hide();
        $("#specific").hide();
        $("#single").fadeIn();
    });

    getAllNotes();

    let pages = document.querySelector('#sites');
    pages.addEventListener('click', handleSites, false)
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


document.addEventListener('DOMContentLoaded', init);
