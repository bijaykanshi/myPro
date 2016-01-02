var chat = {
	 socket: io(),
	 preMsg: {},
	 initialization: function (myInfo) {
	 	this.socket.emit('userRegistration', {userDetail: myInfo});
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
		chatScreen = document.getElementById('chat_screen' + id);
		chatScreen.innerHTML += li;
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
});