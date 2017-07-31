
$(document).ready(function() {
    alert("DOM READY!");
        chrome.extension.onMessage.addListener(
                function(request, sender, sendResponse){
                    alert("inside msg");
                    var text = request.markText;
                    alert(text);

                });
});

/////

    // $(document.documentElement).keydown(function (e) {
    //     alert("Key Has Been Pressed!");
    //     chrome.runtime.sendMessage({Message: "getTextFile"}, function (response) {
    //         alert('got it!');
    //     })

    // })

//////////
// alert('content???')

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     alert('hello?')
//     if (request.markText){
//         alert('hello from content!')
//     }
// });




            // let selection = $(`*:contains(${text})`).css( "text-decoration", "underline" );;


            // let div = document.createElement("DIV");
            // div.id = "chrome-ext-mark"
            // // alert('div created')
            // selection.appendChild(div);
            // alert('div appended to selection')
            // let img = document.createElement("IMG");
            // img.src = "/images/mark.png";
            // div.appendChild(img);
            // alert('image added')
            // alert(result[url])

