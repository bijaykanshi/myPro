var recognizing;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
reset();
recognition.onend = reset();
var button;
recognition.onresult = function (event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
        //textarea.value += event.results[i][0].transcript;
        var click = document.getElementsByName(event.results[i][0].transcript.trim());
        if (click.length) {
            click[0].click();
        }
        console.log(event.results[i][0].transcript);
    }
  }
}

function reset() {
  button = document.getElementById('speech');
  recognizing = false;
  if (button) {
      button.innerHTML = "Click to Speak";
  }
}

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    reset();
  } else {
    recognition.start();
    recognizing = true;
    if (button) {
        button.innerHTML = "Click to Stop";
    }
    
  }
}