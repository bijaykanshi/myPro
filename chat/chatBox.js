Array.remove = function(array, from, to) {
                var rest = array.slice((to || from) + 1 || array.length);
                array.length = from < 0 ? array.length + from : from;
                return array.push.apply(array, rest);
            };
        
            //this variable represents the total number of popups can be displayed according to the viewport width
            var total_popups = 0;
            
            //arrays of popups ids
            var popups = [];
        
            //this is used to close a popup
            function close_popup(id)
            {
                for(var iii = 0; iii < popups.length; iii++)
                {
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);
                        
                        document.getElementById(id).style.display = "none";
                        
                        calculate_popups();
                        
                        return;
                    }
                }   
            }
        
            //displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
            function display_popups()
            {
                var right = 220;
                
                var iii = 0;
                for(iii; iii < total_popups; iii++)
                {
                    if(popups[iii] != undefined)
                    {
                        var element = document.getElementById(popups[iii]);
                        element.style.right = right + "px";
                        right = right + 320;
                        element.style.display = "block";
                    } else {
						iii = 4;
					}
                }
                
                for(var jjj = iii; jjj < popups.length; jjj++)
                {
                    var element = document.getElementById(popups[jjj]);
                    element.style.display = "none";
                }
            }
            function insertPopup(id, name) {
                for(var iii = 0; iii < popups.length; iii++)
                {   
                    //already registered. Bring it to front.
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);
                    
                        popups.unshift(id);
                        
                        calculate_popups();
                        
                        
                        return;
                    }
                }               
                
                /*var element = '<div class="popup-box chat-popup" id="'+ id +'" >';
                element = element + '<div class="popup-head">';
                element = element + '<div class="popup-head-left">'+ name +'</div>';
                element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
                element = element + '<div style="clear: both"></div></div><div class="popup-messages">'
                element += '<div class = "chatscreen" id="chat_screen'+ id +'">'
                element += '<ul class="chats">' 
                element += '</ul>' + '</div>' 
                element += '<textarea class = "message"  onkeypress = "chat.enterPress(\''+ id +'\')" id="msg'+ id +'" placeholder="Write something.."></textarea>'
                element += '</div>'+ '</div>';
                element = element + '<div style="clear: both"></div></div><div class="popup-messages"></div></div>';
                
                
                //document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  
                document.getElementById('chatBox').innerHTML += element;*/
                var bothId = id < chat.myInfo.id ? id.toString() + chat.myInfo.id.toString() : chat.myInfo.id.toString() + id.toString();
                var you = 'you';
                var me = 'me';
                var element = '<div class="popup-box chat-popup" id="'+ id +'" >';
                element = element + '<div class="popup-head">';
                element = element + '<div class="popup-head-left">'+ name +'</div>';
                element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
                element = element + '<div style="clear: both"></div></div><div class="popup-messages">'
                element += '<div class = "chatscreen" id="chat_screen'+ id +'" scroll-up="global.bringMoreMsg(\''+ id +'\')">'
                //element += '<ul class="chats">'
                element += '<li ng-class = "{you: (global.myInfo.id === msg.senderId), me: (global.myInfo.id !== msg.senderId)}" ng-repeat = "msg in global.msgList[\''+ bothId +'\']">'+
                                '<div class="image">' +
                                    '<img check-image class = "imgChat" ng-src="images/peopleList/1"  />' +
                                '</div>' +
                                '<p class = "dynamicMsg bgColourMsg">{{msg.msg}}</p>' +
                            '</li>'; 
                //element += '</ul>' + '</div>' 
                element += '<textarea class = "message"  onkeypress = "chat.enterPress(\''+ id +'\')" id="msg'+ id +'"  placeholder="Write something.."></textarea>'
                //element += '<textarea class = "message"   id="msg'+ id +'" ng-model="global.textMsg"  ng-keypress="($event.which === 13)?global.press(\''+ id +'\'):0" placeholder="Write something.."></textarea>'
                
                element += '</div>'+ '</div>';
                element = element + '<div style="clear: both"></div></div><div class="popup-messages"></div></div>';
                
                var $injector = angular.element('#chatBox').injector();
                $injector.invoke(function($rootScope, $compile){
                    angular.element('#' + 'chatBox').append($compile(element)($rootScope));
                });
                //document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  
                //document.getElementById('chatBox').innerHTML += element;
        
                popups.unshift(id);
                        
                calculate_popups();
            }
            //creates markup for a new popup. Adds the id to popups array.
            function register_popup(id, name)
            {
                var bothId = id < chat.myInfo.id ? id.toString() + chat.myInfo.id.toString() : chat.myInfo.id.toString() + id.toString();
                if (!chat.preMsg[bothId]) {
                    /*chat.global.sendRequest('/getPreviousMsg?id=' + bothId + '&start=0&end=100',
                        undefined,
                        'GET',
                        function (data, status, headers, config){
                              insertPopup(id, name);
                              if (data.length) {
                                    //chat.insertPreviousMsg(data);
                                    var msgList = chat.global.msgList;
                                    if (msgList[bothId]) {
                                        data.push.apply(data, msgList[bothId]);
                                    }
                                    msgList[bothId] = data;
                              }
                        },
                        function (data, status, headers, config) {
                          insertPopup(id, name);
                          console.log('error');
                        });*/
                    chat.global.bringMoreMsg(id, name);
                    chat.preMsg[bothId] = true;
                } else {
                    insertPopup(id, name);
                }
               
            }
            function calculate_popups()
            {
                var width = window.innerWidth;
                if(width < 540)
                {
                    total_popups = 0;
                }
                else
                {
                    width = width - 200;
                    //320 is width of a single popup box
                    total_popups = parseInt(width/320);
                }
                
                display_popups();
                
            }
            
            //recalculate when window is loaded and also when window is resized.
            window.addEventListener("resize", calculate_popups);
            window.addEventListener("load", calculate_popups);