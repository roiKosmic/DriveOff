function addingExtensionToAuchanDrive(){
	var img = browser.extension.getURL("/img/openFood.png"); 

	//Ajout dans la liste des produits sur le liste
	$(".product-item__shortcuts").append("<img class='product-item__shortcutsButton  openfood' src='"+img+"'>");
	
	//Ajout dans le cas d'une liste
	if ( $( ".operations-area" ).length ) {
		$(".operations-area").append("<img class='openfood' src='"+img+"'>");
		inListAuchan=true;
	}
}

function addingObserverToAuchanDrive(){
	if($( "main" ).length){
	// The node to be monitored
	 var target = $( "main" )[0];

	// Create an observer instance
	var observer = new MutationObserver(function( mutations ) {
			mutations.forEach(function( mutation ) {
				
				var newNodes = mutation.addedNodes; // DOM NodeList
				if( newNodes !== null ) { // If there are new nodes added
						var $nodes = $( newNodes ); // jQuery set
						var img = browser.extension.getURL("/img/openFood.png"); 
							$nodes.each(function() {
								var $node = $( this );
								
								if( $node.hasClass( "product-item" ) ) {
								
									console.log("product inserted in DOM");
									$node.find(".product-item__shortcuts").append("<img class='product-item__shortcutsButton  openfood' src='"+img+"'>");
									
								}
							});
				}
			}); 
			bindOpenFoodIconEvent();
	});

	// Configuration of the observer:
	var config = { 
		attributes: true, 
		childList: true, 
		characterData: true 
	};
 
	// Pass in the target node, as well as the observer options
	observer.observe(target, config);
	}
}



function getAuchanDriveQueryURL(elm){
	var detail;
	if(!inListAuchan){
			detail = elm.closest("article").attr("data-name");
	}else{
		detail =elm.parent(".operations-area").prevAll(".libelle-produit").find("span").html();
		console.log("inlist");
	}
	console.log(detail);
	
	//var preFilter = ['auchan bio','auchan'];
	
	return filterTitle(detail);


}

