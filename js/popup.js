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
            console.log(url)
            if(result[url]){
                result[url].forEach(note => {
                    $("#points ul").append('<li>' + note + ' <button class="delete" id="' + note + '"> DEL </button>' + '</li>');
                })
            }
        });
    }
})  


document.addEventListener('DOMContentLoaded', function() {
    let button = document.getElementsByClassName('delete');
    // onClick's logic below:
    console.log(button)
    button.addEventListener('click', function() {
        console.log('tryna delete stuff')
    });
});


// var notifier,
//     dialog;

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
// function showDialog(){
//     chrome.windows.create({
//         url: 'dialog.html',
//         width: 200,
//         height: 120,
//         type: 'popup'
//     });
// }    
// function init() {
//     clicker = document.querySelector('#click');
//     dialog = document.querySelector('#dialog');

//     clicker.addEventListener('click', showNotify, false);
//     dialog.addEventListener('click', showDialog, false);
// }    
// document.addEventListener('DOMContentLoaded', init);