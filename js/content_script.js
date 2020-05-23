var DriveOff;

const lang = chrome.i18n.getUILanguage();

$(document).ready(function(){
	DriveOff = new DriveOff(lang);
	DriveOff.init();
});
