/* Trop peu d'informations sur le produit... */
var lidlfr = function() {
	this.name = 'lidlfr';
	this.domain = 'lidlfr';
	this.lang = 'fr';
	this.selector = '.row';
	
	this.productSelector = 'article.product';
	this.productClassname = 'product';
};

lidlfr.prototype = new Drive('lidlfr');

lidlfr.prototype.localMutationObserver=function(mutations,localThis){
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
  
lidlfr.prototype.addingExtension = function(){
	$(this.productSelector).append("<img class='driveoff-openfood' src='"+this.DriveOffLocal.clickImgFile+"'>");
};
	
lidlfr.prototype.getProductInfo=function(elm){
	//this.searchTerms = elm.parent(this.productSelector).prevAll(".pWCRS310_Desc").find("a").html();
};
