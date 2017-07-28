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
        saveChanges(url);
      }
    })
  }
    
});


//  The Context menu will be active on the page in general, on any text selection, 
// image (or element that has a “src” attribute) and all links.




 var clickHandler = function(e) {
    // var url = e.pageUrl;
    // var buzzPostUrl = "http://www.google.com/buzz/post?";

    // if (e.selectionText) {
    //     // The user selected some text, put this in the message.
    //     buzzPostUrl += "message=" + encodeURI(e.selectionText) + "&";
    // }

    // if (e.mediaType === "image") {
    //     buzzPostUrl += "imageurl=" + encodeURI(e.srcUrl) + "&";
    // }

    // if (e.linkUrl) {
    //     // The user wants to buzz a link.
    //     url = e.linkUrl;
    // }

    // buzzPostUrl += "url=" + encodeURI(url);

    // // Open the page up.
    // chrome.tabs.create(
    //       {"url" : buzzPostUrl });
};

chrome.contextMenus.create({
    "title": "Save Your Place",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : clickHandler
  });