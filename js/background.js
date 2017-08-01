
/////////////////////
$(document).ready(function() {
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    let url = changeInfo.url;
    if(url){
          chrome.storage.sync.get([url], function(result) {
            // alert('looking in ' + url)
            let text = result[url]
            if(text){
              alert(text)
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


// listener for when you go to a new URL... this is really for debugging. I'll delete this!
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    let storageChange = changes[key];
    alert('yep, a new url has been added!')
  }
});
      
var clickHandler = function(e) {
    var url = e.pageUrl;
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




// this was code for the popup:
// var counter = 0;
// chrome.browserAction.onClicked.addListener(function (tab) {
//     counter++;
//     if (counter > 0) {

  //   var queryInfo = {
  //     active: true,
  //     currentWindow: true
  //   };
    
  //   chrome.tabs.query(queryInfo, function(tabs) {
      
  //     var tab = tabs[0];
  //     var url = tab.url;
  //     console.assert(typeof url == 'string', 'tab.url should be a string');
  //     if(url){
  //       siteInfo.currentUrl = url;
  //       saveChanges(url);
  //     }
  //   })
  // }   
// });
