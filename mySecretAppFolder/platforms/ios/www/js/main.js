 /*****************************************************************
                                 File: main.js
                                 Author: Kai Gao
                                 App Name: Messenger App
                                 Description: 
                                 Here is the sequence of logic for the app
                                 --add cordova plugins
                                 Good to note:
                                 --about header in html
                                 adding <br>
                                 --about take-pic button and img replacing take-pic button
                                 the basic send modal window has no take pic button and no img in it
                                 every time, entering send modal window, create a take pic button, after take a pic, 
                                 remove the take pic button, add the pic after the take pic button.
                                 every time, leaving send modal window, clear take-pic button and pics if they exist
                                 Version: 0.0.1
                                 Updated: Arpil 23, 2017
                                 ***************************************************************/
 var app = {
     currentUserId: null
     , currentUserGuid: null
     , baseurl: "https://griffis.edumedia.ca/mad9022/steg/"
     , currentImgURI: null
     , idForDeletingMsgClicked: null
     , init: function () {
         document.addEventListener("deviceready", app.onDeviceReady);
     }
     , onDeviceReady: function () {
         //hide the Status Bar
         if (StatusBar.isVisible) {
             StatusBar.hide();
         }
         else {
             StatusBar.show();
         }
         //  button register
         var btnRegister = document.getElementById("register");
         btnRegister.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             var url = app.baseurl + "register.php";
             console.log(url);
             var fd = new FormData();
             fd.append("user_name", document.getElementById("userName").value);
             fd.append("email", document.getElementById("email").value);
             var req = new Request(url, {
                 method: "POST"
                 , mode: "cors"
                 , body: fd
             });
             fetch(req).then(function (response) {
                 return response.json();
             }).then(function (data) {
                 console.dir(data);
                 //generate register success or fail message for user
                 if (data.code == 0) {
                     //store user_id and user_guid in golobal variables for all subsequent calls to server
                     app.currentUserId = data.user_id;
                     app.currentUserGuid = data.user_guid;
                     let divparent = document.getElementById("loginPage");
                     let form = document.getElementById("loginForm");
                     let divMsg = document.createElement("div");
                     divMsg.classList.add("msg");
                     setTimeout(function () {
                         divMsg.classList.add("good");
                     }, 20);
                     divMsg.textContent = "Registered successfully and login in now.";
                     //insert the message before the form.
                     divparent.insertBefore(divMsg, form);
                     setTimeout((function (dparent, dm) {
                         return function () {
                             dparent.removeChild(dm);
                         }
                     })(divparent, divMsg), 2500);
                     setTimeout(function () {
                         app.loginOrRegisterSuccess();
                     }, 2500);
                 }
                 else if (data.code == 888) {
                     // message: "Username or e-mail already in use."
                     //generate a message to user indicating loging is not successfully and make the message disappear after 3 seconds
                     let divparent = document.getElementById("loginPage");
                     let form = document.getElementById("loginForm");
                     let divMsg = document.createElement("div");
                     divMsg.classList.add("msg");
                     setTimeout(function () {
                         divMsg.classList.add("bad");
                     }, 20);
                     divMsg.textContent = "Username or e-mail already in use.";
                     //insert the message before the form.
                     divparent.insertBefore(divMsg, form);
                     setTimeout((function (dparent, dm) {
                         return function () {
                             dparent.removeChild(dm);
                         }
                     })(divparent, divMsg), 3000);
                 }
                 else if (data.code == 999) {
                     //                     code: 999, message: "Invalid e-mail provided.
                     let divparent = document.getElementById("loginPage");
                     let form = document.getElementById("loginForm");
                     let divMsg = document.createElement("div");
                     divMsg.classList.add("msg");
                     setTimeout(function () {
                         divMsg.classList.add("bad");
                     }, 20);
                     divMsg.textContent = "Invalid e-mail provided.";
                     //insert the message before the form.
                     divparent.insertBefore(divMsg, form);
                     setTimeout((function (dparent, dm) {
                         return function () {
                             dparent.removeChild(dm);
                         }
                     })(divparent, divMsg), 3000);
                 }
             });
         });
         //button login
         var btnLogin = document.getElementById("login");
         btnLogin.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             var url = app.baseurl + "login.php";
             var fd = new FormData();
             fd.append("user_name", document.getElementById("userName").value);
             fd.append("email", document.getElementById("email").value);
             var req = new Request(url, {
                 method: "POST"
                 , mode: "cors"
                 , body: fd
             });
             fetch(req).then(function (response) {
                 return response.json();
             }).then(function (data) {
                 //                     console.dir(data);
                 if (data.code == 0) {
                     //store user_id and user_guid in golobal variables for all subsequent calls to server
                     app.currentUserId = data.user_id;
                     app.currentUserGuid = data.user_guid;
                     app.loginOrRegisterSuccess();
                 }
                 else {
                     //generate a message to user indicating loging is not successfully and make the message disappear after 3 seconds
                     let divparent = document.getElementById("loginPage");
                     let form = document.getElementById("loginForm");
                     let divMsg = document.createElement("div");
                     divMsg.classList.add("msg");
                     setTimeout(function () {
                         divMsg.classList.add("bad");
                     }, 20);
                     divMsg.textContent = "Login match is not found!";
                     //insert the message before the form.
                     divparent.insertBefore(divMsg, form);
                     setTimeout((function (dparent, dm) {
                         return function () {
                             dparent.removeChild(dm);
                         }
                     })(divparent, divMsg), 3000);
                 }
             });
         });
         //since there two send inons in two modoals(details-modal and msg-list-modal) that can link to send-msg-modal
         //I need to dynamically create an take-pic button for these two icons, so I make a function called app.showPageSend() which will be used for the two icons.
         //Note that showPageSend  function will also clear all previous imgs in the ul
         //button send in msgListModal. for linking modals properly
         var btnSendMsgListModal = document.getElementById("btnSendMsgListModal");
         btnSendMsgListModal.addEventListener("touchstart", function (ev) {
                 var msgSendModal = document.getElementById("msgSendModal");
                 msgSendModal.classList.add("active");
                 // dynamically create an take-pic button
                 //Note that showPageSend function will also clear all previous imgs in the ul
                 app.showPageSend();
             })
             //button send in DetailMsgModal. for linking modals properly
         var btnSendDetailMsgModal = document.getElementById("btnSendDetailsMsgModal");
         btnSendDetailMsgModal.addEventListener("touchstart", function (ev) {
             //remove active from detailsMsgModal's class name list
             var detailsMsgModal = document.getElementById("detailsMsgModal");
             detailsMsgModal.classList.remove("active");
             //add active for msgSendModal's class name list
             //Do this because Before going to msgSendModal, msgListModal appears unexpectedly
             var msgSendModal = document.getElementById("msgSendModal");
             msgSendModal.classList.add("active");
             // dynamically create an take-pic button
             app.showPageSend();
         });
         //back button in Details modal
         var btnBackInDetailModal = document.getElementById("btnBackInDetailsModal");
         btnBackInDetailModal.addEventListener("touchstart", function (ev) {
                 ev.preventDefault();
                 //just refresh the list of messages
                 app.showPageList();
             })
             //back button in Send modal
         var btnBackInSendModal = document.getElementById("btnBack");
         btnBackInSendModal.addEventListener("touchstart", function () {
                 //since pics already removed everytime when two send icons being tapped because of showPageSend function being called, we only have to remove take-pic button
                 var takePicBtn = document.getElementById("takePicSendModal");
                 // remove the take-pic button if take-pic button exists
                 if (takePicBtn) {
                     var formParent = document.getElementById("formSendModal");
                     formParent.removeChild(takePicBtn);
                 }
                 //clear the select option and textarea. Place1/2. Also do this for real send button
                 var listSelect = document.getElementById("selectNextSibling");
                 listSelect.selectedIndex = 0;
                 var text = document.getElementById("textSendmodal");
                 text.value = "";
                 //reset the global variable app.currentImgURI to null, this is for before sending image to server
                 app.currentImgURI = null;
                 //refresh the message list because the current user might send msg to himself
                 app.showPageList();
             })
             //button Send, This is real button for sending msg to server
         var btnSendToServer = document.getElementById("btnSend");
         btnSendToServer.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             console.log("real send button clicked");
             //This belongs to part2. putting here is to generate bad message
             var select = document.getElementById("selectNextSibling");
             var idSelectedUser = select.options[select.selectedIndex].value;
             if (idSelectedUser == "disabledOption" || app.currentImgURI == null) {
                 //pop up user sending fail message
                 let divparent = document.getElementById("sendPage");
                 let ul = document.getElementById("msg-send-list");
                 let divMsg = document.createElement("div");
                 divMsg.classList.add("msg");
                 setTimeout(function () {
                     divMsg.classList.add("bad");
                 }, 20);
                 if (idSelectedUser == "disabledOption" && app.currentImgURI == null) {
                     divMsg.textContent = "Please take a picture and select a recipient!";
                 }
                 else {
                     if (idSelectedUser == "disabledOption") {
                         divMsg.textContent = "Please select a recipient";
                     }
                     else {
                         divMsg.textContent = "Please take a picture!";
                     }
                 }
                 //insert the message before the form.
                 divparent.insertBefore(divMsg, ul);
                 setTimeout((function (dparent, dm) {
                     return function () {
                         dparent.removeChild(dm);
                     }
                 })(divparent, divMsg), 4000);
             }
             //part1 on canvas. place the img on the canvas. then embed other information into canvas including recipient_id, msg-length and msg itself
             var canvas = document.createElement("canvas");
             //         document.body.appendChild(app.canvas);
             var ctx = canvas.getContext("2d");
             var img = document.getElementById("imgTempInSendModalForDrawInCanvas");
             img.src = app.currentImgURI;
             var w = img.width;
             var h = img.height;
             canvas.style.width = w + "px";
             canvas.style.height = h + "px";
             canvas.width = w;
             canvas.height = h;
             ctx.drawImage(img, 0, 0);
             //get the id of the selected recipient
             //part2             on canvas. set recipient's id on canvas--- the globale variable
             //             var select = document.getElementById("selectNextSibling");
             //             var idSelectedUser = select.options[select.selectedIndex].value;
             console.log("show idSelectedUser");
             console.log(idSelectedUser);
             //embed other 3 parts into canvas including recipient_id, msg-length and msg itself
             //id of the selected recipient 
             var idBitArray = BITS.numberToBitArray(idSelectedUser);
             console.log(idBitArray);
             //
             console.log("can I get user ID before setting it in canvas?");
             //console.dir(app.getUserId(canvas));
             //note that return value is canvas element
             canvas = BITS.setUserId(idBitArray, canvas);
             //test if I can get user ID after setting user ID in canvas
             console.log("can I get user ID after setting it in canvas?");
             //console.dir(app.getUserId(canvas));
             //part 3           on canvas. set the msg length on canvas
             var text = document.getElementById("textSendmodal");
             console.log("text message and its length");
             console.log(text.value);
             console.log(text.value.length);
             //This is the number of bits in the message. (The number of characters * 16)
             var numOfBits = text.value.length * 16;
             //             console.log(numOfBits);
             var lengthBitArray = BITS.numberToBitArray(numOfBits);
             //             console.dir(lengthBitArray);
             canvas = BITS.setMsgLength(lengthBitArray, canvas);
             //test if I can get message length after setting it on canvas
             console.log("can I get message length in canvas?");
             console.dir(app.getMsgLength(canvas));
             //part 4               on canvas. the message itself embeded on canvas
             var textBitArray = BITS.stringToBitArray(text.value);
             canvas = BITS.setMessage(textBitArray, canvas);
             //test 
             console.log("can I get message after embeding it in canvas?");
             console.dir(BITS.getMessage(idSelectedUser, canvas));
             //Now app.canvas has all the information, ready to be sent to server
             //grab the binary file image from the app.canvas. binary version of the image
             //             console.log("print canvas here");
             //             console.dir(canvas);
             //test
             //             var c = document.getElementById("myCanvasID");
             //delete this line: before sending the binary image file, make sure select a recipient and picture has already taken
             //after the text has been sent successfully, pop up a success message to the user
             canvas.toBlob(function (blob) {
                 //                 console.log("enter send button toBlob function");
                 //                 console.dir(blob);
                 var url = "https://griffis.edumedia.ca/mad9022/steg/" + "msg-send.php";
                 var fd = new FormData();
                 fd.append("user_id", app.currentUserId);
                 fd.append("user_guid", app.currentUserGuid);
                 fd.append("recipient_id", idSelectedUser);
                 fd.append("image", blob, "test102.png");
                 var req = new Request(url, {
                     method: "POST"
                     , mode: "cors"
                     , body: fd
                 });
                 fetch(req).then(function (response) {
                     return response.json();
                 }).then(function (data) {
                     console.log("sending it to server");
                     console.dir(data);
                     //if send successfully or not
                     if (data.code == 0) {
                         ////generate a message to user indicating sending is successful and make the message disappear after 3 seconds
                         let divparent = document.getElementById("sendPage");
                         let ul = document.getElementById("msg-send-list");
                         let divMsg = document.createElement("div");
                         divMsg.classList.add("msg");
                         setTimeout(function () {
                             divMsg.classList.add("good");
                         }, 20);
                         divMsg.textContent = "Message has been sent!";
                         //insert the message before the form.
                         divparent.insertBefore(divMsg, ul);
                         setTimeout((function (dparent, dm) {
                             return function () {
                                 dparent.removeChild(dm);
                             }
                         })(divparent, divMsg), 4000);
                     }
                 });
             }, 'image/png');
         });
         //button Delete msg
         var btnDelete = document.getElementById("btnDelete");
         btnDelete.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             //Delete the messge in the details modal window
             var url = app.baseurl + "msg-delete.php";
             var fd = new FormData();
             fd.append("user_id", app.currentUserId);
             fd.append("user_guid", app.currentUserGuid);
             fd.append("message_id", app.idForDeletingMsgClicked);
             var req = new Request(url, {
                 method: "POST"
                 , mode: "cors"
                 , body: fd
             });
             fetch(req).then(function (response) {
                 return response.json();
             }).then(function (data) {
                 console.dir(data);
                 if (data.code == 0) {
                     //dispatch touchend evnt on the back button in the details page
                     var myTouchEndEv = new CustomEvent("touchend", {
                         bubbles: true
                     });
                     var btnBackInDetailModal2 = document.getElementById("btnBackInDetailsModal");
                     btnBackInDetailModal2.dispatchEvent(myTouchEndEv);
                     app.showPageList();
                 }
             });
         });
     }
     , showPageList: function () {
         var url = app.baseurl + "msg-list.php";
         var fd = new FormData();
         fd.append("user_id", app.currentUserId);
         fd.append("user_guid", app.currentUserGuid);
         var req = new Request(url, {
             method: "POST"
             , mode: "cors"
             , body: fd
         });
         fetch(req).then(function (response) {
             return response.json();
         }).then(function (data) {
             //                 console.log("enter showPageList function");
             //                 console.dir(data);
             var list = document.getElementById("msg-list");
             list.innerHTML = "";
             // if returned JSON object's code is 0,build msg list one msg by one msg,
             if (data.code == 0) {
                 data.messages.forEach(function (msg) {
                     let li = document.createElement("li");
                     li.className = "table-view-cell ";
                     let div = document.createElement("div");
                     //store sender name for msg clicked, will use it in msg-details-modal
                     div.setAttribute("data-senderName", msg.user_name);
                     div.className = "media-body";
                     div.textContent = "Message from: " + msg.user_name;
                     
                     let div_a_parent = document.createElement("div");
                     div_a_parent.className ="ChevronParent";
                     
                     let a = document.createElement("a");
                     a.className = "navigate-right ";
//                     a.style.display = "inline-block";
//                     a.style.height = a.parentElement.style.height;
//                     a.style.width = a.parentElement.style.width;
                     
                     a.href = "#detailsMsgModal";
                     //store id for msg clicked, will use it in msg-details-modal
                     a.setAttribute("data-msgIdClicked", msg.msg_id);
                     a.addEventListener("touchstart", app.showPageDetails);
                     div.appendChild(a);
                     li.appendChild(div);
                     list.appendChild(li);
                     //a.style.display = "block";
                     //a.parentElement.style.height = a.parentElement.parentElement.style.height;
                     //a.style.height = a.parentElement.style.height;
                     //a.parentElement.style.width = a.parentElement.parentElement.style.width;
                     
                     //a.style.width = a.parentElement.style.width;
                     
//                     div_a_parent.setAttribute("msgIdClicked", msg.msg_id);
//                     div_a_parent.addEventListener("touchstart", app.showPageDetails);
//                     div_a_parent.appendChild(a);
//                     li.appendChild(div);
//                     li.appendChild(div_a_parent);
//                     list.appendChild(li);
                 })
             }
         });
     }
     , showPageDetails: function (ev) {
         let chevronClicked = ev.currentTarget;
         let idForMsgClicked = chevronClicked.getAttribute("data-msgIdClicked");
         app.idForDeletingMsgClicked = idForMsgClicked;
         //grab the name strored as attribute in parent div of chevronClicked
         let nameSender = chevronClicked.parentElement.getAttribute("data-senderName");
         //         console.log(nameSender);
         var url = app.baseurl + "msg-get.php";
         var fd = new FormData();
         fd.append("user_id", app.currentUserId);
         fd.append("user_guid", app.currentUserGuid);
         fd.append("message_id", idForMsgClicked);
         var req = new Request(url, {
             method: "POST"
             , mode: "cors"
             , body: fd
         });
         fetch(req).then(function (response) {
             return response.json();
         }).then(function (data) {
             console.log("enter showPageDetails function");
             console.dir(data);
             if (data.code == 0) {
                 //build the details page
                 //show sender's name and the image from sender
                 let ul = document.getElementById("msg-detail-list");
                 ul.innerHTML = "";
                 //let li_space = document.createElement("li");
                // li_space.innerHTML = "^";
                 //li_space.className = "table-view-divider";
                 let liImg = document.createElement("li");
                 liImg.className = "table-view-cell";
                 liImg.textContent = "From: " + nameSender;
                 let img = document.createElement("img");
                 img.setAttribute('crossorigin', 'anonymous');
                 img.src = app.baseurl + data.image;
                 img.className = "media-object";
                 liImg.append(img);
                 //ul.appendChild(li_space);
                 ul.appendChild(liImg);
                 //place the img on the canvas
                 //decode text from the img
                 var canvas = document.createElement("canvas");
                 var ctx = canvas.getContext("2d");
                 var imgForDrawing = document.getElementById("imgTempInDetailsModalForDrawInCanvas");
                 imgForDrawing.src = app.baseurl + data.image;
                 imgForDrawing.setAttribute('crossorigin', 'anonymous');
                 console.dir(imgForDrawing);
                 imgForDrawing.addEventListener("load", function (ev) {
                     var w = imgForDrawing.width;
                     var h = imgForDrawing.height;
                     console.log("imgForDrawing width and height");
                     console.log(w);
                     console.log(h);
                     canvas.style.width = w + "px";
                     canvas.style.height = h + "px";
                     canvas.width = w;
                     canvas.height = h;
                     console.log(canvas.width);
                     console.log(canvas.height);
                     ctx.drawImage(imgForDrawing, 0, 0);
                     var text = document.getElementById("textDecode");
                     console.log("show current user's id");
                     console.log(app.currentUserId);
                     console.dir(canvas);
                     console.log("show user's id in canvas");
                     //console.log(app.getUserId(canvas));
                     console.dir(BITS.getMessage(app.currentUserId, canvas));
                     text.value = BITS.getMessage(app.currentUserId, canvas);
                 });
             }
         });
     }
     , showPageSend: function () {
         console.log("enter showPageSend");
         //clear the img in html first. purpose is just do not want to delete img sample in html. But in fact it helps to clear pics completely
         var ul = document.getElementById("msg-send-list");
         //every time two send icons being tapped. remove the all imgs in the ul--- img's parent element
         ul.innerHTML = "";
         //create a take pic button
         var btnTakePic = document.createElement("button");
         btnTakePic.className = "btn btn-positive btn-block";
         btnTakePic.setAttribute("id", "takePicSendModal");
         var span = document.createElement("span");
         span.className = "icon icon-play";
         span.textContent = "Take Picture";
         btnTakePic.appendChild(span);
         var formParent = document.getElementById("formSendModal");
         var selectNextSibling = document.getElementById("selectNextSibling");
         formParent.insertBefore(btnTakePic, selectNextSibling);
         //add eventLisner to take-pic button
         var options = {
             quality: 60
             , destinationType: Camera.DestinationType.FILE_URI
             , encodingType: Camera.EncodingType.PNG
             , mediaType: Camera.MediaType.PICTURE
             , pictureSourceType: Camera.PictureSourceType.CAMERA
             , allowEdit: true
             , targetWidth: 300
             , targetHeight: 300
         };
         btnTakePic.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             navigator.camera.getPicture(app.successCallback, app.errorCallback, options);
         });
         //build the drop down list
         //get the list of users
         var url = app.baseurl + "user-list.php";
         var fd = new FormData();
         fd.append("user_id", app.currentUserId);
         fd.append("user_guid", app.currentUserGuid);
         var req = new Request(url, {
             method: "POST"
             , mode: "cors"
             , body: fd
         });
         fetch(req).then(function (response) {
             return response.json();
         }).then(function (data) {
             //                 console.dir(data);
             var listSelect = document.getElementById("selectNextSibling");
             //if JSON object is returned properly, can be emapty array, but can not be null
             if (data.code == 0) {
                 data.users.forEach(function (user) {
                     var option = document.createElement("option");
                     option.value = user.user_id;
                     option.textContent = user.user_name;
                     listSelect.appendChild(option);
                 })
             }
         });
     }
     , successCallback: function (imageURI) {
         console.log("start to take a picture");
         //adding img before the take-pic button, then remove the take-pic button
         var ul = document.getElementById("msg-send-list");
         var liImg = document.createElement("li");
         liImg.className = "table-view-cell";
         var img = document.createElement("img");
         img.className = "media-object ";
         img.src = imageURI;
         liImg.appendChild(img);
         ul.appendChild(liImg);
         //once the img is created, remove the take- pic button
         if (img) {
             var takePicBtn = document.getElementById("takePicSendModal");
             var formParent = document.getElementById("formSendModal");
             formParent.removeChild(takePicBtn);
         }
         //sending message to server side
         app.currentImgURI = imageURI;
     }
     , errorCallback: function (message) {
         console.log("enter error function");
         alert('Failed because: ' + message);
     }
     , loginOrRegisterSuccess: function () {
         //                         console.log("login success");
         //if current user login successfully, create an invisible anchor tag linking to msgListModal
         var a_invisible = document.createElement("a");
         //                    a_invisible.innerHTML = "haha";
         //                         a_invisible.classList.add("invisible");
         a_invisible.href = "#msgListModal";
         var div = document.getElementById("loginPage");
         div.appendChild(a_invisible);
         //dispatch touchend evnt on the invisible anchor
         var myTouchEndEv = new CustomEvent("touchend", {
             bubbles: true
         });
         a_invisible.dispatchEvent(myTouchEndEv);
         //about header issue
         var header = document.getElementById("showHeaderListModal");
         header.style.display = "inline-block";
         //build list of messages for the current user
         app.showPageList();
     }
     , getUserId: function (_canvas) {
         //read the last bit inside each of the first 16 blue channel values
         //return a single two-byte integer built from the 16 bits
         var ctx = _canvas.getContext('2d');
         var imgData = ctx.getImageData(0, 0, _canvas.width, _canvas.height);
         //console.log(imgData.data.length);
         var _bitArray = [];
         for (var i = 0; i < 16; i++) {
             var index = (i * 4) + 2;
             var blue = imgData.data[index];
             var bit = blue & 1;
             _bitArray.push(bit);
         }
         //console.log('user id array', _bitArray);
         return app.bitArrayToNumber(_bitArray);
     }
     , bitArrayToNumber: function (_bitArray) {
         //take a 16 element array of bits and return a two-byte integer
         if (_bitArray.length !== 16) {
             throw new Error('Invalid message length bit array size.');
         }
         var num = 0;
         for (var i = 0; i < 16; i++) {
             var shift = 15 - i;
             //console.log(_bitArray[i] << shift);
             var num = num | (_bitArray[i] << shift);
         }
         return num;
     }
     , getMsgLength: function (_canvas) {
         //read the last bit inside each of the second 16 blue channel values
         //return a single two-byte integer built from the 16 bits
         var ctx = _canvas.getContext('2d');
         var imgData = ctx.getImageData(0, 0, _canvas.width, _canvas.height);
         var _bitArray = [];
         for (var p = 16; p < 32; p++) {
             var index = (p * 4) + 2;
             var blue = imgData.data[index];
             var bit = blue & 1;
             //console.log(index, blue, bit);
             _bitArray.push(bit);
         }
         //console.log('getmsglength', _bitArray);
         return app.bitArrayToNumber(_bitArray);
     }
 };
 app.init();