/*
** CLASS Drive
**
** Part of GitHub Project 	:	https://github.com/roiKosmic/DriveOff
**
** 
*/

function Drive(className) {
	this.className = className;
}//__construct

Drive.prototype = {
	domain:'',
	lang : '',
	selector:'',
	DriveOffLocal:'',
	
	className:'',
	currentDriveObj:'',
	
	searchTerms:'',
	EAN:'',
	
	// This function allows to load "dynamically" stuff depends on the current domain without hard coding any drive names in the code
	loadObject:function(className){
		var localFunction = window[className];
		
		if(typeof localFunction === 'function') {
			console.log(className+' : OK');
			var localObject = new localFunction();
			this.currentDriveObj = localObject;
			return localObject;
		}else{
			throw "This website is not available on DriveOFF";
		}
	},
	
	addingObserver: function(){
		var localThis = this;
		
		if($( localThis.selector ).length){
		// The node to be monitored
		 var target = $( localThis.selector )[0];

		// Create an observer instance
		var observer = new MutationObserver(function( mutations ) {
			localThis.localMutationObserver(mutations,localThis);
			localThis.DriveOffLocal.bindOpenFoodIconEvent();
		});

		// Configuration of the observer:
		var config = { 
			attributes: true, 
			childList: true, 
			characterData: true,
			
		};
	 
		// Pass in the target node, as well as the observer options
		observer.observe(target, config);
		}
	},
	
	addingExtension:function(){
		this.addingExtension();
	},
	getQueryURL:function(elementHTML){
		this.getProductInfo(elementHTML);
		
		if(this.EAN !== ''){
			return this.DriveOffLocal.buildURL('product',this.EAN);
		}else{
			return this.DriveOffLocal.buildURL('search',this.DriveOffLocal.buildSearchString(this.searchTerms));
		}
	},
	
	adaptUI:function(){
		var localThis = this;
		if(typeof (localThis.localAdaptUI) == 'function'){
			localThis.localAdaptUI(); 
		}
	}
};
