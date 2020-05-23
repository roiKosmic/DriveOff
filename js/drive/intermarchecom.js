/* Problème : le bind sur le clic du Drive prend la main sur le bind du logo OFF */
var intermarchecom = function() {
	this.name = 'intermarchecom';
	this.domain = 'intermarchecom';
	this.lang = 'fr';
	this.selector = '.content_vignettes';
	
	this.productSelector = '.vignette_produit_info';
	this.productClassname = 'vignette_produit_info';
};

intermarchecom.prototype = new Drive('intermarchecom');

intermarchecom.prototype.localMutationObserver=function(mutations,localThis){
	mutations.forEach(function( mutation ) {
		var newNodes = mutation.addedNodes; // DOM NodeList
		if( newNodes !== null ) { // If there are new nodes added
			var $nodes = $( newNodes ); // jQuery set
			$nodes.each(function() {
				var $node = $( this );
				if( $node.hasClass( localThis.productClassname ) ) {
					console.log("product inserted in DOM");
					$node.find(this.productSelector).children('div.conteneur_promos').append(localThis.DriveOffLocal.clickImgFileHTML);
				}
			});
		}
	}); 
};
  
intermarchecom.prototype.addingExtension = function(){
	$(this.productSelector).children('div.conteneur_promos').append(this.DriveOffLocal.clickImgFileHTML);
};
	
intermarchecom.prototype.getProductInfo=function(elm){
	this.searchTerms = elm.parent(this.productSelector).prevAll(".pWCRS310_Desc").find("a").html();
};
