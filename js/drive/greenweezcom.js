var greenweezcom = function() {
	this.name = 'greenweezcom';
	this.domain = 'greenweez.com';
	this.lang = 'fr';
	this.selector = '.page_list';
	
	this.productSelector = '.rayon_img';
	this.productClassname = 'rayon_img';
};

greenweezcom.prototype = new Drive('greenweezcom');

greenweezcom.prototype.localMutationObserver=function(mutations,localThis){
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
  
greenweezcom.prototype.addingExtension = function(){
	$(this.productSelector).append(this.DriveOffLocal.clickImgFileHTML);
}; 
	
greenweezcom.prototype.getProductInfo=function(elm){
	this.searchTerms = elm.parent(this.productSelector).children('section').children('.full_block_link').attr("title");
};
