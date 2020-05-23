var aldifr = function() {
	this.name = 'aldifr';
	this.domain = 'aldi.fr';
	this.lang = 'fr';
	this.selector = '.mod-tiles__items';
	
	this.productSelector = 'div.mod-article-tile--tertiary';
	this.productClassname = 'mod-article-tile--tertiary';
};

aldifr.prototype = new Drive('thirietcom');

aldifr.prototype.localMutationObserver=function(mutations,localThis){
	mutations.forEach(function( mutation ) {
		var newNodes = mutation.addedNodes; // DOM NodeList
		if( newNodes !== null ) { // If there are new nodes added
			var $nodes = $( newNodes ); // jQuery set
			$nodes.each(function() {
				var $node = $( this );
				if( $node.hasClass( localThis.productClassname ) ) {
					console.log("product inserted in DOM");
					$node.find(this.productSelector).append(localThis.DriveOffLocal.clickImgFileHTML);
				}
			});
		}
	}); 
}; 
  
aldifr.prototype.addingExtension = function(){
	$(this.productSelector).append(this.DriveOffLocal.clickImgFileHTML);
};
	
aldifr.prototype.getProductInfo=function(elm){
	var json_data = elm.parent(this.productSelector).attr("data-article");
	json_data = JSON.parse(json_data);
	
	this.brand = json_data.productInfo.brand.replace('®','');
	this.searchTerms = json_data.productInfo.productName;
};
