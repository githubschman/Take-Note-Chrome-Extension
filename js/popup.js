let codify = window.js_beautify;

let queryInfo = {
active: true,
currentWindow: true
};

let tempText = "";

function containsCode(text){
  let test = 0;
  text.indexOf('var') > -1 ? test += 3 : test; text.indexOf('//') > -1 ? test += 7 : test; text.indexOf('const') > -1 ? test += 3 : test; text.indexOf('function') > -1 ? test += 5 : test; text.indexOf('{') > -1 ? test += 4 : test; text.indexOf('}') > -1 ? test += 4 : test; text.indexOf(';') > -1 ? test += 5 : test; text.indexOf('def') > -1 ? test += 3 : test; text.indexOf('<') > -1 ? test += 5 : test; text.indexOf('>') > -1 ? test += 5 : test; text.indexOf('=') > -1 ? test += 4 : test;
  return test > 10;
}

chrome.tabs.query(queryInfo, function(tabs) {

    var tab = tabs[0];
    var url = tab.url;
    
    if(url){
        chrome.storage.sync.get([url], function(result) { 
            
            !result[url].length ? $("#placeholder").fadeIn() : $("#placeholder").hide()

            if(result[url]){

                $("#current").text(formatAddress(url));
                 
                result[url].forEach(note => { // CURRENT PAGE NOTES
                    if(note){
                        let content, edit, noteID = note.replace(/\W+/g, "");
                        if(containsCode(note)){
                            content = codify(note);
                            $("#points ul").append('<pre class="code" id="' + noteID + 'note">' + content + '</pre><button name="' + noteID + '" class = "delete" id = "' + note + '"> x </button>');
                        } else {
                            edit = '<button class="edit" id="' + note + '"> edit </button>' 
                            content = note;
                            $("#points ul").append('<li class="textback" id="' + noteID + 'note">' + content + "<br>" + edit + '<button class="delete" id="' + note + '"> x </button>' + '</li>');

                        }
                    }
                })
            }
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
                $("#sites ul").append('<li id="' + sites[i] + '" class =' +  siteClass + '>' + '<a href=' + sites[i] + '>' + title + '</a> &nbsp <button class="deleteSite" id="' + sites[i] + '"> X </button>' + '</li>');
            })
        }
    });
}

/// EVENT HANDLERS
function handleSites(e){
    let site = e.target.id, url = e.target.href;

    if(e.target.outerText === 'X'){
        deleteSite(site)
    }
    else { // GET A SPECIFIC SITE'S NOTES NOT EDITABLE 
        $("#single").hide();
        $("#all").hide();
        $("#specific").fadeIn();
        $("#spec").text(formatAddress(url));
        $("#specificPoints ul").empty()
        let editSpec = document.querySelector('#editSpec')
        editSpec.name = url;

        chrome.storage.sync.get([url], function(result) {

        !result[url].length ? $("#placeholder2").fadeIn() : $("#placeholder2").hide() 

        result[url].forEach(note => {
                let noteID = note.replace(/\W+/g, "")
                    if(containsCode(note)){
                         let content = codify(note);
                         $("#specificPoints ul").append('<pre class="code" id="' + noteID + 'note">' + content + '</pre>');
                    }else{
                        $("#specificPoints ul").append('<li class="textback" id="' + noteID + 'note' + '">' + note + '</li>');
                    }
                })
        });
        
    }
}


function editNote(text){ // makes the form visible.
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

                let first = result[url].slice(0,result[url].indexOf(text)); // works
                let last = result[url].slice(result[url].indexOf(text)+1); // works
                result[url] = [...first, ...last]; // works
                text = text.replace(/\W+/g, "")
                let id = '#' + text + 'note';

                $(id).hide();
                $("button[name='"+ text + "']").hide();
                !result[url].length ? $("#placeholder").fadeIn() : $("#placeholder").hide()    

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

function handleNote(e){ //////
    if(e.target.className === 'delete'){
        deleteNote(e.target.id);
    }
    else if(e.target.outerText === 'edit'){
        editNote(e.target.id);
    }   
}  

function goToSite(e){
    chrome.tabs.create({url: e.target.name});
}


//// SUBMIT NEW NOTES
function submitNewNote(e){
    e.preventDefault(); //
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

                    $("#points ul").append('<li class="textback" id="' + noteID + 'note">' + newNote + ' <br> <button class="edit" id="' + newNote + '"> edit</button> <button class="delete" id="' + newNote + '">x </button>' + '</li>');
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
    pages.addEventListener('click', handleSites, false);
}   

document.addEventListener('DOMContentLoaded', init);
