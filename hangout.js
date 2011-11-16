var btnActivate = document.getElementById('btnActivate');
var lblActivate = document.getElementById('lblActivate');
var details = document.getElementById('details');

var volumeDOM = document.getElementById('rangeVolume');
var videoDOM = document.getElementById('btnVideo');

var myParticipantID = null;

function onVideoSettingClicked(e) {
  localStorage['video'] = videoDOM.checked;
}

function onActivateClicked(e) {
  lblActivate.classList.toggle('checked');
  details.style.display = isActivated() ? 'block' : 'none';
  localStorage['activated'] = isActivated();
}

function isActivated() {
  return lblActivate.classList.contains('checked');
}

function onActiveSpeaker(activeParticipantID) {
  if (isActivated()) {
    gapi.hangout.getParticipants(function(participants) {
      var isVideoEnabled = videoDOM.value;
      for (var p in participants) {
        var participantID = participants[p].hangoutId;
        if (participantID != activeParticipantID &&
            participantID != myParticipantID) {
          gapi.hangout.av.setParticipantVisible(participantID, isVideoEnabled);
        }
      }
    });
  }
}

function apiReady() {
  console.log('API is ready');
  btnActivate.addEventListener('click', onActivateClicked, false);
  videoDOM.addEventListener('click', onVideoSettingClicked, false);
  gapi.hangout.clearActiveSpeaker();
  myParticipantID = gapi.hangout.getParticipantId();
  gapi.hangout.addActiveSpeakerListener(onActiveSpeaker);
  console.log(gapi.hangout.getActiveSpeaker());
}

// Initialization for gadget.
function init() {
  var activated = localStorage['activated'] === 'true';
  btnActivate.checked = activated ? 'checked' : '';
  if (activated) {
    lblActivate.classList.add('checked');
  }
  else {
    lblActivate.classList.remove('checked');
  } 

  videoDOM.checked = localStorage['video'] === 'true' ? 'checked' : '';
  details.style.display = activated ? 'block' : 'none';
  console.log('Init App');
  gapi.hangout.addApiReadyListener(apiReady);
}
gadgets.util.registerOnLoadHandler(init);
