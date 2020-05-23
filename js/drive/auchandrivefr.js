var auchandrivefr = function() {
	this.name = 'auchandrivefr';
	this.domain = 'auchandrive.fr';
	this.lang = 'fr';
	this.selector = 'main';
	this.inListAuchan = false;
};

auchandrivefr.prototype = new Drive('auchandrivefr');

auchandrivefr.prototype.localMutationObserver=function(mutations,localThis){
	mutations.forEach(function( mutation ) {
		var newNodes = mutation.addedNodes; // DOM NodeList
		if( newNodes !== null ) { // If there are new nodes added
			var $nodes = $( newNodes ); // jQuery set
					$nodes.each(function() {
						var $node = $( this );
										
						if( $node.hasClass( "product-item" ) ) {
							console.log("product inserted in DOM");
							$node.find(".product-item__shortcuts").append("<img class='product-item__shortcutsButton driveoff-openfood' src='"+localThis.DriveOffLocal.clickImgFile+"'>");
						}
					});
				}
			}); 
};
  
auchandrivefr.prototype.addingExtension = function(){
	//Ajout dans la liste des produits sur le liste
	$(".product-item__shortcuts").append("<img class='product-item__shortcutsButton driveoff-openfood' src='"+this.DriveOffLocal.clickImgFile+"'>");
		
	//Ajout dans le cas d'une liste
	if ( $( ".operations-area" ).length ) {
		$(".operations-area").append(this.DriveOffLocal.clickImgFileHTML);
		this.inListAuchan=true;
	}
};
	
auchandrivefr.prototype.getProductInfo=function(elm){
	var detail;
	if(this.inListAuchan === false){
		detail = elm.closest("article").attr("data-name");
	}else{
		detail = elm.parent(".operations-area").prevAll(".libelle-produit").find("span").html();
		this.DriveOffLocal.showLog("inlist");
	}
		
	this.DriveOffLocal.showLog(detail);
		
	this.searchTerms = detail;
};
