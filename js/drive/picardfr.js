var picardfr = function() {
	this.name = 'picardfr';
	this.domain = 'picard.fr';
	this.lang = 'fr';
	this.selector = '.productlisting';
	
	this.productSelector = '.push_produit_01';
	this.productClassname = 'push_produit_01';
	
	this.brand = 'picard';
};

picardfr.prototype = new Drive('picardfr');

picardfr.prototype.localMutationObserver=function(mutations,localThis){
	mutations.forEach(function( mutation ) {
		var newNodes = mutation.addedNodes; // DOM NodeList
		if( newNodes !== null ) { // If there are new nodes added
			var $nodes = $( newNodes ); // jQuery set
			$nodes.each(function() {
				var $node = $( this );
				if( $node.hasClass( localThis.productClassname ) ) {
					console.log("product inserted in DOM");
					$node.find(this.productSelector).append("<img class='driveoff-openfood' src='"+localThis.DriveOffLocal.clickImgFile+"'>");
				}
			});
		}
	}); 
}; 
  
picardfr.prototype.addingExtension = function(){
	$(this.productSelector).append("<img class='driveoff-openfood' src='"+this.DriveOffLocal.clickImgFile+"'>");
};
	
picardfr.prototype.getProductInfo=function(elm){
	this.searchTerms = elm.parent(this.productSelector).find(".productGTMClickCategAll").attr("title");
};
