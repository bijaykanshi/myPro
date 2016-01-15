var chat = {
	 socket: io(),
	 preMsg: {},
	 initialization: function (myInfo) {
	 	this.socket.emit('userRegistration', {userDetail: myInfo});
	 	chat.logout = false;
	 	this.myInfo = myInfo;
	 },
	 
	 enterPress: function (id) { 
	 	if(event.keyCode == 13) {
			var message = document.getElementById('msg' + id),
				insertDbId;
			this.createChatMessage(message.value, id, 'you');
			//scrollToBottom(id);
			if (id < this.myInfo.id) {
				insertDbId = id + this.myInfo.id;
			} else {
				insertDbId = this.myInfo.id + id;
			}
			chat.global.msgList[insertDbId].push({id: insertDbId, msg: message.value, senderId: this.myInfo.id});
			this.socket.emit('msg', {msg: message.value, receiver: id, sender: this.myInfo, insertDbId: insertDbId});
			message.value = "";
		}
	 },
	 createChatMessage: function(msg, id, who){
		var idForImage,
			imgSrc,
			li,
			chatScreen;
		if (who === 'you') {
			idForImage = this.myInfo.id;
		} else {
			idForImage = id;
		}
		imgSrc = 'images/peopleList/' + idForImage;
		li = '<li class=' + who + '>'+
				'<div class="image">' +
					'<img class = "imgChat" src=' + imgSrc + ' onerror="chat.imageSrcNotFound(this)" />' +
				'</div>' +
				'<p class = "dynamicMsg bgColourMsg">' + msg + '</p>' +
			'</li>';
		var $injector = angular.element('#chatBox').injector();
        $injector.invoke(function($rootScope, $compile){
            angular.element('#' + 'chat_screen' + id).append($compile(li)($rootScope));
        });
		chatScreen = document.getElementById('chat_screen' + id);
		//chatScreen.innerHTML += li;
		window.scrollTo(0,document.body.scrollHeight);
		chatScreen.scrollTop = chatScreen.scrollHeight;
	},
	insertPreviousMsg: function (msgList) {
		var i,
		leftOrRightDisplay,
		id,
		myId = this.myInfo.id.toString(),
		youId,
		msgId = msgList[0].id.toString(),
		index = msgId.indexOf(myId),
		start,
		end;
		if (!index) {
			start = myId.length;
			end = msgId.length;
		} else {
			start = 0;
			end = myId.length;
		}
		youId = parseInt(msgId.substring(start, end));
		for (i = 0; i < msgList.length;i += 1) {
			leftOrRightDisplay = (this.myInfo.id === msgList[i].senderId) ? 'you' : 'me';
			this.createChatMessage(msgList[i].msg, youId, leftOrRightDisplay);
		}

	},
	imageSrcNotFound: function(self) {
		self.src = 'images/peopleList/1';
	}
};
chat.socket.on('receive', function(data) {
    register_popup(data.sender.id, data.sender.name);
    chat.createChatMessage(data.msg, data.sender.id, 'me');
    //chat.global.press(data.sender.id, data.msg);
    /*var $injector = angular.element('#chatBox').injector();
    var bothId = data.sender.id < chat.global.myInfo.id ?  data.sender.id.toString() + chat.global.myInfo.id.toString() : chat.global.myInfo.id.toString() + data.sender.id.toString();
    if (!chat.global.msgList[bothId]) {
		chat.global.msgList[bothId] = [];
	}
	var obj = {id: bothId, msg: data.msg, senderId: data.sender.id};
	$injector.invoke(function($rootScope, $compile){
        $compile(obj)($rootScope);
    });
	chat.global.msgList[bothId].push(obj);*/
});
chat.socket.on('disconnect', function(){
 	if (!chat.logout) {
 		chat.socket = io();
 		chat.socket.emit('userRegistration', {userDetail: chat.myInfo});
 	}
 	alert('you have been disconnect');
 });
 window.onbeforeunload = function(e) {
 	window.onunload  = function (a, b, c, d) {
 		console.log('kkjljs');
 	}
 	chat.global.stateChange();
	return ' '; 
};