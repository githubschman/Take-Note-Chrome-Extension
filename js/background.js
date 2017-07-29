let placeHolder = function(height, direction){
  this.height = height,
  this.direction = direction // depending on mouse click
}

function saveChanges(url, text) {
    chrome.storage.sync.get([url], function(result) {
          
          let arr = result[url] ? result[url] : [];
          arr.push(text);

          let jsonObj = {};
          jsonObj[url] = arr;

          chrome.storage.sync.set(jsonObj, function() {
            alert('mark saved!')
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
    // let direction = null; // this depends on where their mouse is
    // let position = null;
    let text = e.selectionText;
    saveChanges(url, text)
};

chrome.contextMenus.create({
    "title": "Save Your Place",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : clickHandler
  });




// this was code for the popup:
// var counter = 0;
// chrome.browserAction.onClicked.addListener(function (tab) {
//     counter++;
//     if (counter > 0) {

//     var queryInfo = {
//       active: true,
//       currentWindow: true
//     };
    
//     chrome.tabs.query(queryInfo, function(tabs) {
      
//       var tab = tabs[0];
//       var url = tab.url;
//       console.assert(typeof url == 'string', 'tab.url should be a string');
//       if(url){
//         siteInfo.currentUrl = url;
//         saveChanges(url);
//       }
//     })
//   }   
// });
