var carrefourfr = function() {
	this.name = 'carrefourfr';
	this.domain = 'carrefour.fr';
	this.lang = 'fr';
	this.selector = '.grid';
};

carrefourfr.prototype = new Drive('carrefourfr');

carrefourfr.prototype.localMutationObserver=function(mutations,localThis){
		mutations.forEach(function( mutation ) {
			console.log("mutation detected"+mutation.type);
			var newNodes = mutation.addedNodes; // DOM NodeList
				if( newNodes !== null ) { // If there are new nodes added
					var $nodes = $( newNodes ); // jQuery set
						$nodes.each(function() {
							var $node = $( this );
										
							if( $node.hasClass( "grid-item" ) ) {
								if($(".cd-ProductContainer").length){
										console.log("In carrefour ooshop");
										$node.find(".cd-ProductVisual").append("<img class='openfood carrefour cd-ProductOrigin' src='"+localThis.DriveOffLocal.clickImgFile+"'>");
								}
								$node.find(".product-card__body").append("<img class='openfood carrefour' src='"+localThis.DriveOffLocal.clickImgFile+"'>");
							}
						 });
				}
		});	
};
  
carrefourfr.prototype.addingExtension = function(){
	console.log(this);
		
		if($(".cd-ProductContainer").length){
			console.log("In carrefour ooshop");
			$(".cd-ProductVisual").append("<img class='openfood carrefour cd-ProductOrigin' src='"+this.DriveOffLocal.clickImgFile+"'>");
		}
		$(".product-card__body").append("<img class='openfood carrefour' src='"+this.DriveOffLocal.clickImgFile+"'>");
};
	
carrefourfr.prototype.getProductInfo=function(elm){
		if($(".cd-ProductContainer").length){
			var obj = jQuery.parseJSON(elm.parent().find("a").attr("data-gldata"));
			detail = obj.product_EAN;
			console.log("Get from JSON attribute "+detail);
		}else{
			detail = elm.parent(".product-card__body").parent("article").attr("id");
		}
		
		this.EAN = detail;
};

carrefourfr.prototype.localAdaptUI = function(){
	/*
	$(".nutriTaux").find("li").css("margin-bottom","2px");
	$(".nutriTaux").find("li").css("margin-top","2px");
	$(".nutriTaux").find("li").css("padding-top","2px");
	$(".nutriAdditif").find("li").css("margin-bottom","2px");
	$(".nutriAdditif").find("li").css("margin-top","2px");
	$(".nutriAdditif").find("li").css("padding-top","2px");
	*/
};