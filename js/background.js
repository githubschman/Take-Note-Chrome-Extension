let siteInfo = {
  currentUrl: null
}

let testArr = [];

let markedSite = function(){
  this.url = ''
  this.placeholders = []
}

let placeHolder = function(height, direction){
  this.height = height,
  this.direction = direction // depending on mouse click
}

markedSite.prototype.addPlaceHolder = function(height,direction){
  this.placeholders.push(new placeHolder(height, direction))
}

// function renderStatus(statusText) {
//   document.getElementById('status').textContent = statusText;
// }

// document.addEventListener('DOMContentLoaded', function() {
//   alert("new site loaded");
//   getCurrentTabUrl(function(url) {
//     siteInfo.currentUrl = url;
//   });
// });


// function getClickHandler() {
//   return function(info, tab) {

//     // The srcUrl property is only available for image elements.
//     var url = 'info.html#' + info.srcUrl;

//     // Create a new window to the info page.
//     chrome.windows.create({ url: url, width: 520, height: 660 });
//   };
// };

/**
 * Create a context menu which will only show up for images.
 */
// chrome.contextMenus.create({
//   "title" : "i dunno",
//   "type" : "normal",
//   "contexts" : ["image"],
//   "onclick" : getClickHandler()
// });




function saveChanges(url) {
  // Get a value saved:
  testArr.push(url)
  var theValue = testArr;

  // Check that there's some code there.
  if (!theValue) {
    alert('Error: No value specified');
    return;
  }

  // Save it! using the Chrome extension storage API.
  chrome.storage.sync.set({'value': theValue}, function() {
    // Notify that we saved.
    alert(theValue);
  });
}

// eventually, you can "get" the saved value of 'value'

// listener for when you go to a new URL... will use as a template for saving 
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    let storageChange = changes[key];
    alert('new url!')
  }
});
      
      



 ///// SAND BOX ///// 

var counter = 0;
chrome.browserAction.onClicked.addListener(function (tab) {
    counter++;
    if (counter > 0) {

    var queryInfo = {
      active: true,
      currentWindow: true
    };
    
    chrome.tabs.query(queryInfo, function(tabs) {
      
      var tab = tabs[0];
      var url = tab.url;
      console.assert(typeof url == 'string', 'tab.url should be a string');
      if(url){
        siteInfo.currentUrl = url;
        alert(siteInfo.currentUrl)
        saveChanges(url);
      }
    })
  }
    
});
