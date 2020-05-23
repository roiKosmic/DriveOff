var coradrivefr = function() {
	this.name = 'coradrivefr';
	this.domain = 'coradrive.fr';
	this.lang = 'fr';
	this.selector = '#container';
	
	this.productSelector = '.item-wrapper';
	this.productClassname = 'item-wrapper';
};

coradrivefr.prototype = new Drive('coradrivefr');

coradrivefr.prototype.localMutationObserver=function(mutations,localThis){
	console.log("drive dom mutation");
	mutations.forEach(function( mutation ) {
		var newNodes = mutation.addedNodes; // DOM NodeList
		if( newNodes !== null ) { // If there are new nodes added
			var $nodes = $( newNodes ); // jQuery set
			$nodes.each(function() {
				var $node = $( this );
				if( $node.hasClass( this.productClassname ) ) {
					console.log("product inserted in DOM");
					$node.find(this.productSelector).children(".picture").append(localThis.DriveOffLocal.clickImgFileHTML);
				}
			});
		}
		
	}); 
};
  
coradrivefr.prototype.addingExtension = function(){
	$(this.productSelector).children(".picture").append(this.DriveOffLocal.clickImgFileHTML);
}; 
	
coradrivefr.prototype.getProductInfo=function(elm){
	this.searchTerms = elm.parent(".picture").children('a').attr("title");
};
