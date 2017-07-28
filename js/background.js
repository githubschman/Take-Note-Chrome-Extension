let siteInfo = {
  currentUrl: null
}

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


///////////////////////////////////////////

function saveChanges(url) {
  
  // Get a value saved:
  // testArr.push(url)
  
  let newSite = url;
  
  // // Save it! using the Chrome extension storage API.
  // chrome.storage.sync.set({'newSite': newSite}, function() {
  //   // Notify that we saved.
  //   alert('saved:' +  newSite);
  // });

  // untested
  // chrome.storage.sync.get(["savedSites"], function(result) {

  //       let arr = result[savedSites]?result[savedSites]:[];
    
  //       arr.unshift(newSite);
        
  //       let siteObj = {};
  //       siteObj[savedSites] = arr;

  //       chrome.storage.sync.set(siteObj, function() {
  //           alert("Saved a new array item");
  //       });
  // });
    chrome.storage.sync.get([url], function(result) {
            
            var array = result[url] ? result[url] : [];

            alert("trying to save");

            array.unshift('test');

            var jsonObj = {};
            jsonObj[url] = array;

            chrome.storage.sync.set(jsonObj, function() {
                alert("Saved a new array item");
            });
        });


}


// listener for when you go to a new URL... 
chrome.storage.onChanged.addListener(function(changes, namespace) {
  alert('changes made!')
  for (key in changes) {
    let storageChange = changes[key];
    alert('new url!')
  }

    // read existing value in get, and append the new value
    // StorageArea.get(null,function(items){
    //   for(item in items){
    //     alert('!')
    //     alert(items[item])
    //   }

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
        // alert('visited' + siteInfo.currentUrl)
        saveChanges(url);
      }
    })
  }
    
});
