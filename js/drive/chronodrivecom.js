var chronodrivecom = function() {
	this.name = 'chronodrivecom';
	this.domain = 'chronodrive.com';
	this.lang = 'fr';
	this.selector = '#productListZone';
	
};

chronodrivecom.prototype = new Drive('chronodrivecom');

chronodrivecom.prototype.localMutationObserver=function(mutations,localThis){
	mutations.forEach(function( mutation ) {
		var newNodes = mutation.addedNodes; // DOM NodeList
		if( newNodes !== null ) { // If there are new nodes added
			var $nodes = $( newNodes ); // jQuery set
					$nodes.each(function() {
						var $node = $( this );
										
						if( $node.hasClass( "item" ) ) {
							console.log("product inserted in DOM");
							$node.find(".item-actions").append("<img class='openfood' src='"+localThis.DriveOffLocal.clickImgFile+"'>");
						}
					});
				}
			}); 
};
  
chronodrivecom.prototype.addingExtension = function(){

	$(".item-actions").append("<img class='openfood' src='"+this.DriveOffLocal.clickImgFile+"'>");
	
	
};
	
chronodrivecom.prototype.getProductInfo=function(elm){
	var detail;	
	detail =elm.parent(".item-actions").prevAll(".item-link").find(".item-desc").html();
	this.DriveOffLocal.showLog(detail);
	this.searchTerms = detail;
};
