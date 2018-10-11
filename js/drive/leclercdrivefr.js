var leclercdrivefr = function() {
	this.name = 'leclercdrivefr';
	this.domain = 'leclercdrive.fr';
	this.lang = 'fr';
	this.selector = '#ulListeProduits';
};

leclercdrivefr.prototype = new Drive('leclercdrivefr');

leclercdrivefr.prototype.localMutationObserver=function(mutations,localThis){
	mutations.forEach(function( mutation ) {
		var newNodes = mutation.addedNodes; // DOM NodeList
		if( newNodes !== null ) { // If there are new nodes added
			var $nodes = $( newNodes ); // jQuery set
			$nodes.each(function() {
				var $node = $( this );
				if( $node.hasClass( "liWCRS310_Product" ) ) {
					console.log("product inserted in DOM");
					$node.find(".divWCRS310_HD").append("<img class='openfood' src='"+localThis.DriveOffLocal.clickImgFile+"'>");
				}
			});
		}
	}); 
};
  
leclercdrivefr.prototype.addingExtension = function(){
	$(".divWCRS310_HD").append("<img class='openfood' src='"+this.DriveOffLocal.clickImgFile+"'>");
};
	
leclercdrivefr.prototype.getProductInfo=function(elm){
	var detail = elm.parent(".divWCRS310_HD").prevAll(".pWCRS310_Desc").find("a").html();
		
	this.searchTerms = detail;
};
