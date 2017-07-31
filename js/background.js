// this will run anytime a new site is visited. If the site contains markers,
// it will alert that it has stuff saved. 


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo.url;
  if(url){
        chrome.storage.sync.get([url], function(result) {
          let text = result[url]
          if(text){
            let selection = $(`*:contains(${text})`);
            alert('yay')
            let div = document.createElement("DIV");
            selection.appendChild(div);
            let img = document.createElement("IMG");
            img.src = "/images/mark.png";
            div.appendChild(img);
            alert(result[url])
          }
      })
  }

}); 

// add onclick to img?
function saveChanges(url, text) {
    chrome.storage.sync.get([url], function(result) {       
        let obj = {};
        obj[url] = text; // you can only have one mark 
        chrome.storage.sync.set(obj, function() {
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
    let text = e.selectionText;
    if(text.length >= 40){
      saveChanges(url, text)
    }
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
