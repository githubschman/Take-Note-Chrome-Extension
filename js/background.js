$(document).ready(function() {
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    let url = changeInfo.url;
    if(url){
          chrome.storage.sync.get([url], function(result) {
            let text = result[url]
            if(text){
             // alert(text)
            }
        })
    }

  }); 
})


function saveChanges(url, text) {
    chrome.storage.sync.get([url], function(result) {       
        result[url] = result[url] ? result[url] : []
        result[url].push(text); // you can save a lot of text
        chrome.storage.sync.set(result, function() {
           alert(result[url].length)
        });
      });
}

      
const clickHandler = function(e) {
    let url = e.pageUrl;
    let text = e.selectionText;
    if(text.length >= 10){
      saveChanges(url, text)
    }
};

chrome.contextMenus.create({
    "title": "Take Note",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : clickHandler
});

var queryInfo = {
active: true,
currentWindow: true
};

function deletedNote(newList){

  chrome.tabs.query(queryInfo, function(tabs) {

    var tab = tabs[0];
    var url = tab.url;

    chrome.storage.sync.get([url], function(result) {
        result[url] = newList;       
        chrome.storage.sync.set(result, function() {
          alert(result[url].length)
        });
      });
  })
}


// listener for when you go to a new URL... this is really for debugging. I'll delete this!
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    let storageChange = changes[key];
    alert('yep, a new url has been added!')
  }
});