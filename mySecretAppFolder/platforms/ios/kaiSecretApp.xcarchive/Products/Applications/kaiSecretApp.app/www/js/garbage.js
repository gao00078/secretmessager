


             img.addEventListener("load", function (ev) {
                 //image has been loaded
                 ctx.drawImage(img, 0, 0);

                 //resize the canvas to match the image size
                 var w = img.width;
                 var h = img.height;
                 canvas.style.width = w + "px";
                 canvas.style.height = h + "px";
                 canvas.width = w;
                 canvas.height = h;

                 console.log(w);
                 console.log(h);
                 console.dir(canvas);
                 console.log(canvas.style.width);
                 console.log(canvas.style.height);
                 console.log(canvas.width);
                 console.log(canvas.height);

                 //get the id of the selected recipient
                 //part2             on canvas. set recipient's id on canvas--- the globale variable
                 var select = document.getElementById("selectNextSibling");
                 var idSelectedUser = select.options[select.selectedIndex].value;
                 //             console.log(idSelectedUser);

                 //embed other 3 parts into canvas including recipient_id, msg-length and msg itself
                 //id of the selected recipient 
                 var idBitArray = BITS.numberToBitArray(idSelectedUser);
                 //             console.log(idTempBitArray);
                 //note that return value is canvas element
                 canvas = BITS.setUserId(idBitArray, canvas);
                 //part 3           on canvas. set the msg length on canvas
                 var text = document.getElementById("textSendmodal");
                 console.log(text.value);
                 console.log(text.value.length);
                 //This is the number of bits in the message. (The number of characters * 16)
                 var numOfBits = text.value.length * 16;
                 console.log(numOfBits);
                 var lengthBitArray = BITS.numberToBitArray(numOfBits);
                 console.dir(lengthBitArray);
                 canvas = BITS.setMsgLength(lengthBitArray, canvas);
                 //part 4               on canvas. the message itself embeded on canvas
                 var textBitArray = BITS.stringToBitArray(text.value);
                 canvas = BITS.setMessage(textBitArray, canvas);
                 //Now app.canvas has all the information, ready to be sent to server
                 //grab the binary file image from the app.canvas. binary version of the image
                 console.log("print canvas here");
                 console.dir(canvas);
                 //test
                 //             var c = document.getElementById("myCanvasID");
                 canvas.toBlob(function (blob) {
                     console.log("enter send button toBlob function");
                     console.dir(blob);
                     var url = "https://griffis.edumedia.ca/mad9022/steg/" + "msg-send.php";
                     var fd = new FormData();
                     fd.append("user_id", app.currentUserId);
                     fd.append("user_guid", app.currentUserGuid);
                     fd.append("recipient_id", idSelectedUser);
                     fd.append("image", blob, "test102.png");
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









                          canvas.toBlob(function (blob) {
                                  console.log("enter send button toBlob function");
                                  console.dir(blob);
                                  var url = "https://griffis.edumedia.ca/mad9022/steg/" + "msg-send.php";
                                  var fd = new FormData();
                                  fd.append("user_id", app.currentUserId);
                                  fd.append("user_guid", app.currentUserGuid);
                                  fd.append("recipient_id", 30);
                                  fd.append("image", blob, "test102.png");
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










     , testBolb: function () {
         console.log("can enter testToBolb function");
         //create an canvas element off the screen
         var canvas = document.createElement("canvas");
         //         var canvas = document.getElementById("canvasTest");
         //         document.body.appendChild(app.canvas);
         var ctx = canvas.getContext("2d");
         //test
         ctx.moveTo(100, 200);
         ctx.lineTo(200, 50);
         ctx.lineWidth = 4;
         ctx.strokeStyle = '#BADA55';
         ctx.lineTo(10, 10);
         ctx.stroke();
         canvas.toBlob(function (blob) {
             console.log("enter delete button TestBolb's toBlob function");
             console.dir(blob);
             var url = "https://griffis.edumedia.ca/mad9022/steg/" + "msg-send.php";
             var fd = new FormData();
             fd.append("user_id", 30);
             fd.append("user_guid", "c38d121e18ad03cbdaae4704dc1ce83fcff72118");
             fd.append("recipient_id", 30);
             fd.append("image", blob, "test108.png");
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
             });
         }, 'image/png');
         //test end 
         //         var img = document.createElement("img");
         //         img.src = "https://griffis.edumedia.ca/mad9022/steg/messages/msg-1492951309.png";
         //         img.setAttribute('crossorigin', 'anonymous');
         //
         //         img.addEventListener("load", function (ev) {
         //             //image has been loaded
         //             ctx.drawImage(img, 0, 0);
         //             canvas.toBlob(function (blob) {
         //                 console.log("enter toBlob method");
         //
         //                 var url = "https://griffis.edumedia.ca/mad9022/steg/" + "msg-send.php";
         //                 var fd = new FormData();
         //                 fd.append("user_id", 30);
         //                 fd.append("user_guid", "c38d121e18ad03cbdaae4704dc1ce83fcff72118");
         //                 fd.append("recipient_id", 30);
         //                 fd.append("image", blob, "test108.png");
         //                 var req = new Request(url, {
         //                     method: "POST",
         //                     mode: "cors",
         //                     body: fd
         //                 });
         //                 fetch(req)
         //                     .then(function (response) {
         //                         return response.json();
         //                     }).then(function (data) {
         //                         console.log("sending it to server");
         //                         console.log(data);
         //                     });
         //             });
         //
         //         });
     }

















             //
             //             img.addEventListener("load", function (ev) {
             //                 //image has been loaded
             //                 ctx.drawImage(img, 0, 0);
             //
             //                 //resize the canvas to match the image size
             //                 var w = img.width;
             //                 var h = img.height;
             //                 canvas.style.width = w + "px";
             //                 canvas.style.height = h + "px";
             //                 canvas.width = w;
             //                 canvas.height = h;
             //
             //                 console.log(w);
             //                 console.log(h);
             //                 console.dir(canvas);
             //                 console.log(canvas.style.width);
             //                 console.log(canvas.style.height);
             //                 console.log(canvas.width);
             //                 console.log(canvas.height);
             //
             //                 //get the id of the selected recipient
             //                 //part2             on canvas. set recipient's id on canvas--- the globale variable
             //                 var select = document.getElementById("selectNextSibling");
             //                 var idSelectedUser = select.options[select.selectedIndex].value;
             //                 //             console.log(idSelectedUser);
             //
             //                 //embed other 3 parts into canvas including recipient_id, msg-length and msg itself
             //                 //id of the selected recipient 
             //                 var idBitArray = BITS.numberToBitArray(idSelectedUser);
             //                 //             console.log(idTempBitArray);
             //                 //note that return value is canvas element
             //                 canvas = BITS.setUserId(idBitArray, canvas);
             //                 //part 3           on canvas. set the msg length on canvas
             //                 var text = document.getElementById("textSendmodal");
             //                 console.log(text.value);
             //                 console.log(text.value.length);
             //                 //This is the number of bits in the message. (The number of characters * 16)
             //                 var numOfBits = text.value.length * 16;
             //                 console.log(numOfBits);
             //                 var lengthBitArray = BITS.numberToBitArray(numOfBits);
             //                 console.dir(lengthBitArray);
             //                 canvas = BITS.setMsgLength(lengthBitArray, canvas);
             //                 //part 4               on canvas. the message itself embeded on canvas
             //                 var textBitArray = BITS.stringToBitArray(text.value);
             //                 canvas = BITS.setMessage(textBitArray, canvas);
             //                 //Now app.canvas has all the information, ready to be sent to server
             //                 //grab the binary file image from the app.canvas. binary version of the image
             //                 console.log("print canvas here");
             //                 console.dir(canvas);
             //                 //test
             //                 //             var c = document.getElementById("myCanvasID");
             //                 canvas.toBlob(function (blob) {
             //                     console.log("enter send button toBlob function");
             //                     console.dir(blob);
             //                     var url = "https://griffis.edumedia.ca/mad9022/steg/" + "msg-send.php";
             //                     var fd = new FormData();
             //                     fd.append("user_id", app.currentUserId);
             //                     fd.append("user_guid", app.currentUserGuid);
             //                     fd.append("recipient_id", idSelectedUser);
             //                     fd.append("image", blob, "test102.png");
             //                     var req = new Request(url, {
             //                         method: "POST",
             //                         mode: "cors",
             //                         body: fd
             //                     });
             //                     fetch(req)
             //                         .then(function (response) {
             //                             return response.json();
             //                         }).then(function (data) {
             //                             console.log("sending it to server");
             //                             console.dir(data);
             //                         });
             //
             //                 }, 'image/png');
             //
             //             });
             
             