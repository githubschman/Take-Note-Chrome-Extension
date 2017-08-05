function saveChanges(url, text) {
    chrome.storage.sync.get([url], function(result) {       
        result[url] = result[url] ? result[url] : []
        if(result[url].indexOf(text) < 0){
          result[url].push(text); // no dupes
        }
        chrome.storage.sync.set(result, function() {});
      });
}

      
const clickHandler = function(e) {
    let url = e.pageUrl;
    let text = e.selectionText;
    if(text.length >= 10 && text.length <= 1000){
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
        chrome.storage.sync.set(result, function() {});
      });
  })
}


function deletedSite(url){
    chrome.storage.sync.get([url], function(result) {
        result[url] = null;       
        chrome.storage.sync.set(result, function() {});
    });
}


// listener for when you go to a new URL... this is really for debugging. I'll delete this!
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    let storageChange = changes[key];
  }
});