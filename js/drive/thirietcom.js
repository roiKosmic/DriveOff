/* Problème : le bind sur le clic du Drive prend la main sur le bind du logo OFF (idem que intermarche) */
var thirietcom = function() {
	this.name = 'thirietcom';
	this.domain = 'thiriet.com';
	this.lang = 'fr';
	this.selector = '.product-blocks';
	
	this.productSelector = 'article.product-block';
	this.productClassname = 'product-block';
	
	this.brand = 'thiriet';
};

thirietcom.prototype = new Drive('thirietcom');

thirietcom.prototype.localMutationObserver=function(mutations,localThis){
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
  
thirietcom.prototype.addingExtension = function(){
	$(this.productSelector).append("<img class='driveoff-openfood' src='"+this.DriveOffLocal.clickImgFile+"'>");
};
	
thirietcom.prototype.getProductInfo=function(elm){
	this.searchTerms = elm.parent(this.productSelector).find(".product-title").children('a').attr("title");
};
