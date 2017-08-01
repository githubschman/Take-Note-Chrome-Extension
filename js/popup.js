
console.log('hay1')
// this was code for the popup:

console.log('hay2')
var queryInfo = {
active: true,
currentWindow: true
};

chrome.tabs.query(queryInfo, function(tabs) {

var tab = tabs[0];
var url = tab.url;

if(url){
    console.log('hay3')

chrome.storage.sync.get([url], function(result) {   
    console.log(url) 
    console.log($("#points ul"))
    $("#points ul").append('<li>test test teeeest</li>');

});

}
})  


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