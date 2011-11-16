// DOM Elements.
var btnActivate = document.getElementById('btnActivate');
var lblActivate = document.getElementById('lblActivate');
var pnlDetails = document.getElementById('details');
var rngVolume = document.getElementById('rangeVolume');
var btnMuteVideo = document.getElementById('btnVideo');
var btnMuteAudio = document.getElementById('btnAudio');

// My Participant ID.
var myParticipantID = null;

function onVideoSettingClicked(e) {
  localStorage['video'] = btnMuteVideo.checked;
  onDisplayedParticipantChanged(gapi.hangout.getDisplayedParticipant());
}

function onAudioSettingClicked(e) {
  localStorage['audio'] = btnMuteAudio.checked;
  onDisplayedParticipantChanged(gapi.hangout.getDisplayedParticipant());
}

function onActivateClicked(e) {
  lblActivate.classList.toggle('checked');
  var activated = isActivated();
  pnlDetails.style.display = activated ? 'block' : 'none';
  localStorage['activated'] = activated;
  doWhisperAction(gapi.hangout.getDisplayedParticipant(), activated);
}

function doWhisperAction(displayedParticipant, force) {
  var participants = gapi.hangout.getParticipants();
  var muteVideo = btnMuteVideo.checked;
  var muteAudio = btnMuteAudio.checked;
  var volumeLevel = parseInt(rngVolume.value);
  for (var p = 0; p < participants.length; p++) {
    var participantID = participants[p].id;
    var isActive = (myParticipantID == participantID || displayedParticipant == participantID);

    var shouldMuteVideo = isActive ? true : !muteVideo;
    var shouldMuteAudio = isActive ? true : !muteAudio;

    if (force != undefined && !force) {
      isActive = true;
      shouldMuteVideo = true;
      shouldMuteAudio = true;
    }

    gapi.hangout.av.setParticipantVisible(participantID, shouldMuteVideo);
    gapi.hangout.av.setParticipantAudible(participantID, shouldMuteAudio);
    // gapi.hangout.av.setParticipantAudioLevel(participantID, isActive ? 1 : 0);
  }
}

function isActivated() {
  return lblActivate.classList.contains('checked');
}

function onDisplayedParticipantChanged(data) {
  console.log('Displayed Participant Changed');
  if (isActivated()) {
    doWhisperAction(gapi.hangout.getDisplayedParticipant());
  }
}

function apiReady(eventObj) {
  if (eventObj.isApiReady) {
    console.log('API is ready');
    gapi.hangout.clearDisplayedParticipant();
    myParticipantID = gapi.hangout.getParticipantId();

    // Initialize the listeners for the UI.
    btnActivate.addEventListener('click', onActivateClicked, false);
    btnMuteVideo.addEventListener('click', onVideoSettingClicked, false);
    btnMuteAudio.addEventListener('click', onAudioSettingClicked, false);

    // Initialize the on displayed participant event.
    gapi.hangout.onDisplayedParticipantChanged.add(onDisplayedParticipantChanged);

    // Start the whisper first.
    onDisplayedParticipantChanged(gapi.hangout.getDisplayedParticipant());
  }
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

  btnMuteVideo.checked = localStorage['video'] === 'true' ? 'checked' : '';
  btnMuteAudio.checked = localStorage['audio'] === 'true' ? 'checked' : '';
  pnlDetails.style.display = activated ? 'block' : 'none';

  console.log('Init App');
  gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
