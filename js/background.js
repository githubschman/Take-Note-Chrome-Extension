let siteInfo = {
  currentUrl: null
}


let placeHolder = function(height, direction){
  this.height = height,
  this.direction = direction // depending on mouse click
}


///////////////////////////////////////////

function saveChanges(url) {
    chrome.storage.sync.get([url], function(result) {
          let mark = new placeHolder(10, 'left')
          let array = result[url] ? result[url] : [];
          array.push(mark);

          let jsonObj = {};
          jsonObj[url] = array;

          chrome.storage.sync.set(jsonObj, function() {
            alert('mark saved!')
          });
      });
}


// listener for when you go to a new URL... 
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    let storageChange = changes[key];
    alert('yep, a new url has been added!')
  }
});
      
 

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
