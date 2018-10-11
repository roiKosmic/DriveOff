function addingExtensionToCarrefour(){
	var img = chrome.extension.getURL("/img/openFood.png");
	$(".nutriTaux").height("120");
	$(".nutriAdditif").height("120");
	$(".productBarCode").height("120");
	$(".nutriImg").height("120");
	if($(".product-list__row").length){
		console.log("In carrefour ooshop");
		$(".cd-ProductVisual").append("<img class='openfood carrefour cd-ProductOrigin' src='"+img+"'>");
		$(".quantity-controller").append("<img class='openfood carrefour quantity-controller__button' src='"+img+"'>");
	}
	$(".product-card__body").append("<img class='openfood carrefour' src='"+img+"'>");
$(".quantity-controller").append("<img class='openfood carrefour quantity-controller__button' src='"+img+"'>");
}



function addingObserverToCarrefour(){
	
	if($( "body" ).length){
	// The node to be monitored
	 var target = $( "body" )[0];

	// Create an observer instance
	var observer = new MutationObserver(function( mutations ) {
				mutations.forEach(function( mutation ) {
					if($(".product-list__grid").length){
						console.log("Product list Inserted, begin watching it:"+mutation.type);
						observer.disconnect();
						var target2 = $(".product-list__grid")[0];
						var observer2 = new MutationObserver(function( mutations ) {
							mutations.forEach(function( mutation ) {
							console.log("carrefour dom mutation product list: "+mutation.type);
							var newNodes = mutation.addedNodes; // DOM NodeList
									if( newNodes !== null ) { // If there are new nodes added
										var $nodes = $( newNodes ); // jQuery set
										var img = chrome.extension.getURL("/img/openFood.png"); 
										$nodes.each(function() {
											var $node = $( this );
												console.log("product list modified ");
													
												if( $node.hasClass( "product-list__item" ) ) {
													console.log("product inserted in DOM");
													
													$node.find(".product-card__body").find(".carrefour").remove();
													$node.find(".product-card__body").append("<img class='openfood carrefour' src='"+img+"'>");
											
												}
										});
										bindOpenFoodIconEvent();
									}
							}); 
						});
					var config2 = { 
								attributes: true, 
								childList: true, 
								characterData: true,
		
							};
							
					observer2.observe(target2, config2);
					}
					
					
					if($(".product-list__row").length){
						console.log("In carrefour ooshop");
						observer.disconnect();
						var target2 = $(".product-list__row")[0];
						var observer2 = new MutationObserver(function( mutations ) {
							mutations.forEach(function( mutation ) {
							console.log("carrefour dom mutation product list: "+mutation.type);
							var newNodes = mutation.addedNodes; // DOM NodeList
									if( newNodes !== null ) { // If there are new nodes added
										var $nodes = $( newNodes ); // jQuery set
										var img = chrome.extension.getURL("/img/openFood.png"); 
										$nodes.each(function() {
											var $node = $( this );
												console.log("product list modified ");
													
												if( $node.hasClass( "products-card" ) ) {
													console.log("product inserted in DOM");
													$(".carrefour").remove();
													$(".quantity-controller").append("<img class='openfood carrefour quantity-controller__button' src='"+img+"'>");
													
									
												}
										});
										bindOpenFoodIconEvent();
									}
							}); 
						});
						var config2 = { 
								attributes: true, 
								childList: true, 
								characterData: true,
		
							};
							
						observer2.observe(target2, config2);
					}
					
					
					
				});
				
			});
			
		
	// Configuration of the observer:
	var config = { 
		attributes: true, 
		childList: true, 
		characterData: true,
		
	};
 
	// Pass in the target node, as well as the observer options
	observer.observe(target, config);
	}
	
		
}


function getCarrefourQueryURL(elm){
	if($(".product-list__row").length){
		var detail = elm.parent(".quantity-controller").parent().find(".products-card__body__content__text__products-name").html();
		
		console.log("Get from oops "+detail);
		return filterTitle(detail);
	}else{
		detail = elm.parent(".product-card__body").parent("article").attr("id");
		var _url = "https://fr.openfoodfacts.org/api/v0/product/"+detail+".json";
		return _url;
	}
	
	
}
