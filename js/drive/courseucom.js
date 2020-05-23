var courseucom = function() {
	this.name = 'courseucom';
	this.domain = 'courseu.com';
	this.lang = 'fr';
	this.selector = '.prodlist';
	
	this.productSelector = '.grid-tile';
	this.productClassname = 'grid-tile';
};

courseucom.prototype = new Drive('courseucom');

courseucom.prototype.localMutationObserver=function(mutations,localThis){
	console.log("drive dom mutation");
	mutations.forEach(function( mutation ) {
		var newNodes = mutation.addedNodes; // DOM NodeList
		if( newNodes !== null ) { // If there are new nodes added
			var $nodes = $( newNodes ); // jQuery set
			$nodes.each(function() {
				var $node = $( this );
				if( $node.hasClass( this.productClassname ) ) {
					console.log("product inserted in DOM");
					$node.find(this.productSelector).append(localThis.DriveOffLocal.clickImgFileHTML);
				}
			});
		}
		
	}); 
};
  
courseucom.prototype.addingExtension = function(){
	$(this.productSelector).append(this.DriveOffLocal.clickImgFileHTML);
}; 
	
courseucom.prototype.getProductInfo=function(elm){
	this.searchTerms = elm.parent(".item-wrapper").closest('.picture').closest('a').attr("title");
};
