 /*****************************************************************
               File: main.js
               Author: Kai Gao
               App Name: Messenger App
               Description: 
               Here is the sequence of logic for the app
               --add cordova plugins
               Good to note:
               --about header in html
               1.msg-detail-modal content class name is different form msg-send-modoal's class name. Both look OK but not perfect.
               2.msg-send-modoal is better because it does not fill some garbege space like msg-detail-modal does
               --about take-pic button and img replacing take-pic button
               the basic send modal window has no take pic button and no img in it
               every time, entering send modal window, create a take pic button, after take a pic, 
               remove the take pic button, add the pic after the take pic button.
               every time, leaving send modal window, clear take-pic button and pics if they exist
               Version: 0.0.1
               Updated: Arpil 23, 2017
               ***************************************************************/

 var app = {
     currentUserId: null,
     currentUserGuid: null,
     baseurl: "https://griffis.edumedia.ca/mad9022/steg/",
     canvas: null,
     init: function () {
         document.addEventListener("deviceready", app.onDeviceReady);
     },
     onDeviceReady: function () {


         //hide the Status Bar
         if (StatusBar.isVisible) {
             StatusBar.hide();
         } else {
             StatusBar.show();
         }

         // button register
         var btnRegister = document.getElementById("register");
         btnRegister.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             var url = app.baseurl + "register.php";
             console.log(url);
             var fd = new FormData();
             fd.append("user_name", document.getElementById("userName").value);
             fd.append("email", document.getElementById("email").value);
             var req = new Request(url, {
                 method: "POST",
                 mode: "cors",
                 body: fd
             });
             fetch(req)
                 .then(function (response) {
                     return response.json();
                 }).then(function (data) {
                     console.dir(data);
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
                 method: "POST",
                 mode: "cors",
                 body: fd
             });
             fetch(req)
                 .then(function (response) {
                     return response.json();
                 }).then(function (data) {
                     //                     console.dir(data);
                     if (data.code == 0) {
                         //                         console.log("login success");
                         //store user_id and user_guid in golobal variables for all subsequent calls to server
                         app.currentUserId = data.user_id;
                         app.currentUserGuid = data.user_guid;

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
                         //build list of messages for the current user
                         app.showPageList();
                     } else {
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


         var btnBack = document.getElementById("btnBack");
         btnBack.addEventListener("touchstart", function () {
             //since pics already removed everytime when two send icons being tapped because of showPageSend function being called, we only have to remove take-pic button

             var takePicBtn = document.getElementById("takePicSendModal");
             // remove the take-pic button if take-pic button exists

             if (takePicBtn) {
                 var formParent = document.getElementById("formSendModal");
                 formParent.removeChild(takePicBtn);
             }
             //refresh the message list because the current user might send msg to himself
             app.showPageList();

         })



         //button Send, This is real button for sending msg to server
         var btnSendToServer = document.getElementById("btnSend");
         btnSendToServer.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
             //get the id of the selected recipient
             //part2 on canvas. set recipient's id on canvas--- the globale variable
             var select = document.getElementById("selectNextSibling");
             var idSelectedUser = select.options[select.selectedIndex].value;
             //             console.log(idSelectedUser);

             //embed other 3 parts into canvas including recipient_id, msg-length and msg itself
             //id of the selected recipient 
             var idBitArray = BITS.numberToBitArray(idSelectedUser);
             //             console.log(idTempBitArray);
             //note that return value is canvas element
             app.canvas = BITS.setUserId(idBitArray, app.canvas);
             //part 3 on canvas. set the msg length on canvas
             var text = document.getElementById("textSendmodal");
             console.log(text.value);
             console.log(text.value.length);
             //This is the number of bits in the message. (The number of characters * 16)
             var numOfBits = text.value.length * 16;
             console.log(numOfBits);
             var lengthBitArray = BITS.numberToBitArray(numOfBits);
             console.dir(lengthBitArray);
             app.canvas = BITS.setMsgLength(lengthBitArray, app.canvas);
             //part 4 on canvas. the message itself embeded on canvas
             var textBitArray = BITS.stringToBitArray(text.value);
             app.canvas = BITS.setMessage(textBitArray, app.canvas);
             //Now app.canvas has all the information, ready to be sent to server
             //grab the binary file image from the app.canvas. binary version of the image

             app.canvas.blob(function (blob) {
                 var url = app.baseurl + "msg-send.php";
                 var fd = new FormData();
                 fd.append("user_id", app.currentUserId);
                 fd.append("user_guid", app.currentUserGuid);
                 fd.append("recipient_id", idSelectedUser);
                 fd.append("image", blob, "kai.png");
                 var req = new Request(url, {
                     method: "POST",
                     mode: "cors",
                     body: fd
                 });
                 fetch(req)
                     .then(function (response) {
                         return response.json();
                     }).then(function (data) {
                         console.log("sending it to server");
                         console.dir(data);
                     });



             }, 'image/png');



         });



         //button Delete msg
         var btnDelete = document.getElementById("btnDelete");
         btnDelete.addEventListener("touchstart", function (ev) {
             ev.preventDefault();
         })



     },
     showPageList: function () {
         var url = app.baseurl + "msg-list.php";
         var fd = new FormData();
         fd.append("user_id", app.currentUserId);
         fd.append("user_guid", app.currentUserGuid);
         var req = new Request(url, {
             method: "POST",
             mode: "cors",
             body: fd
         });
         fetch(req)
             .then(function (response) {
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
                         div.setAttribute("senderName", msg.user_name);
                         div.className = "media-body";
                         div.textContent = "Message from: " + msg.user_name;
                         let a = document.createElement("a");
                         a.className = "navigate-right";
                         a.href = "#detailsMsgModal";
                         //store id for msg clicked, will use it in msg-details-modal
                         a.setAttribute("msgIdClicked", msg.msg_id);
                         a.addEventListener("touchstart", app.showPageDetails);
                         div.appendChild(a);
                         li.appendChild(div);
                         list.appendChild(li);
                     })
                 }



             });


     },
     showPageDetails: function (ev) {
         //      console.log("enter showPageDetails function");

         let chevronClicked = ev.currentTarget;
         let idForMsgClicked = chevronClicked.getAttribute("msgIdClicked");
         //grab the name strored as attribute in parent div of chevronClicked
         let nameSender = chevronClicked.parentElement.getAttribute("senderName");
         //         console.log(nameSender);
         var url = app.baseurl + "msg-get.php";
         var fd = new FormData();
         fd.append("user_id", app.currentUserId);
         fd.append("user_guid", app.currentUserGuid);
         fd.append("message_id", idForMsgClicked);
         var req = new Request(url, {
             method: "POST",
             mode: "cors",
             body: fd
         });
         fetch(req)
             .then(function (response) {
                 return response.json();
             }).then(function (data) {
                 //                 console.dir(data);
                 if (data.code == 0) {
                     //build the details page
                     let ul = document.getElementById("msg-detail-list");
                     ul.innerHTML = "";
                     let li_space = document.createElement("li");
                     li_space.innerHTML = "^";
                     li_space.className = "table-view-divider";
                     let liImg = document.createElement("li");
                     liImg.className = "table-view-cell";
                     liImg.textContent = "From: " + nameSender;
                     let img = document.createElement("img");
                     img.setAttribute('crossorigin', 'anonymous');
                     img.src = app.baseurl + data.image;
                     img.className = "media-object";
                     liImg.append(img);
                     ul.appendChild(li_space);
                     ul.appendChild(liImg);
                 }

             });
     },
     showPageSend: function () {
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
             quality: 60,
             destinationType: Camera.DestinationType.FILE_URI,
             encodingType: Camera.EncodingType.PNG,
             mediaType: Camera.MediaType.PICTURE,
             pictureSourceType: Camera.PictureSourceType.CAMERA,
             allowEdit: true,
             targetWidth: 300,
             targetHeight: 300
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
             method: "POST",
             mode: "cors",
             body: fd
         });
         fetch(req)
             .then(function (response) {
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

     },
     successCallback: function (imageURI) {
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
         //create an canvas element off the screen
         app.canvas = document.createElement("canvas");
         document.body.appendChild(app.canvas);
         var ctx = app.canvas.getContext("2d");
         //part1 on canvas. place the img on the canvas. then back to real send button anonymous function to embed other information into canvas including recipient_id, msg-length and msg itself

         img.addEventListener("load", function (ev) {
             //image has been loaded
             ctx.drawImage(img, 0, 0);

             //resize the canvas to match the image size
             var w = img.width;
             var h = img.height;
             app.canvas.style.width = w + "px";
             app.canvas.style.height = h + "px";
             app.canvas.width = w;
             app.canvas.height = h;

             //             console.log(w);
             //             console.log(h);
             //             console.dir(app.canvas);
             //             console.log(app.canvas.style.width);
             //             console.log(app.canvas.style.height);
             //             console.log(app.canvas.width);
             //             console.log(app.canvas.height);
         });



     },
     errorCallback: function (message) {
         console.log("enter error function");
         alert('Failed because: ' + message);
     }



 };
 app.init();
