var leclercdrivefr = function() {
	this.name = 'leclercdrivefr';
	this.domain = 'leclercdrive.fr';
	this.lang = 'fr';
	this.selector = '#ulListeProduits';
	
	this.productSelector = '.divWCRS310_HD';
	this.productClassname = 'liWCRS310_Product';
};

leclercdrivefr.prototype = new Drive('leclercdrivefr');

leclercdrivefr.prototype.localMutationObserver=function(mutations,localThis){
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
  
leclercdrivefr.prototype.addingExtension = function(){
	$(this.productSelector).append(this.DriveOffLocal.clickImgFileHTML);
};
	
leclercdrivefr.prototype.getProductInfo=function(elm){
	this.searchTerms = elm.parent(this.productSelector).prevAll(".pWCRS310_Desc").find("a").html();
};
