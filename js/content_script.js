var DriveOff;

const lang = chrome.i18n.getUILanguage();

var DriveOffBinds = [];

$(document).ready(function(){
	DriveOff = new DriveOff(lang);
	DriveOff.init();
});
