// this will run anytime a new site is visited. If the site contains markers,
// it will alert that it has stuff saved. 

alert("wtf come on");
chrome.runtime.onMessage.addListener (
    function (request, sender, sendResponse) {
        alert("Reached Background.js");
        if (request.Message == "getTextFile") {
            alert("Entered IF Block");
            $.get("http://localhost:63342/Projects/StackOverflow/ChromeEXT/helloWorld1", function(response) {
                alert(response);

                // to send back your response  to the current tab
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {fileData: response}, function(response) {
                        //?
                    });
                });


            })
        }
        else {
            alert("Did not receive the response!!!")
        }
    }
);



/////////////////////

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo.url;
  if(url){
        chrome.storage.sync.get([url], function(result) {
          // alert('looking in ' + url)
          let text = result[url]
          if(text){
            // send mark text to content.js 

            chrome.runtime.sendMessage(null, {"markText": text}, null, function(response){
              alert("sending over " + response.markText)
            })
            // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //   chrome.tabs.sendMessage(tabs[0].id, {markText: text}, function() {
            //     alert('content recieved text!');
            //   });
            // });

          }
      })
  }

}); 

// add onclick to img? for deletion? add <a>?

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
