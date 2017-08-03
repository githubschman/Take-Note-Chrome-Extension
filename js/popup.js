var queryInfo = {
active: true,
currentWindow: true
};

function clickHandler(){
    console.log('i cant believe this works')
}

chrome.tabs.query(queryInfo, function(tabs) {

    var tab = tabs[0];
    var url = tab.url;

    if(url){
        chrome.storage.sync.get([url], function(result) {   
            // console.log(url)
            if(result[url]){
                result[url].forEach(note => {
                    $("#points ul").append('<li>' + note + '<button>edit</button> <button class="delete" id="' + note + '"> DEL </button>' + '</li>');
                })
            }
        });
    }
})  


// pop out your notes??
function showDialog(){
    chrome.windows.create({
        url: 'dialog.html',
        width: 200,
        height: 120,
        type: 'popup'
    });
}    

function init() {
    dialog = document.querySelector('#points');
    dialog.addEventListener('click', showDialog, false);
}    


document.addEventListener('DOMContentLoaded', function() {
    let el = document.getElementsByClassName("delete");
    // HTMLCollection(1)
    console.log(el)
    if(el.length){
        var arr = Array.prototype.slice.call( el )
        console.log(arr)
    }


   
    // for (var i = 0; i < el.length; i++) {
    //     console.log('anything?')
    //     console.log(el[i].id); //second console output
    //     el[i].onClick(function(){
    //         console.log('clicked button')
    //     })
    // }


    // onClick's logic below:
    // el.addEventListener("click", function(){console.log('um ok')}, false);
});

////////////////////////////////////



var notifier,
    dialog;

// function showNotify() {
//     var notify;

//     if (window.webkitNotifications.checkPermission() == 0) {
//         notify = window.webkitNotifications.createNotification(
//             "",
//             'Notification Test',
//             'This is a test of the Chrome Notification System. This is only a test.'
//         );
//         notify.show();
//     } else {
//         window.webkitNotifications.requestPermission();
//     }
// }    


document.addEventListener('DOMContentLoaded', init);