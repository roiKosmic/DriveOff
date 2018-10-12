function addingExtensionToLeclerc(){
	var img = browser.extension.getURL("/img/openFood.png"); 
	$(".divWCRS310_HD").append("<img class='openfood' src='"+img+"'>");
	
}

function addingObserverToLeclercDrive(){

// The node to be monitored
	if($("#ulListeProduits").length){
	 var target = $("#ulListeProduits")[0];

	// Create an observer instance
	var observer = new MutationObserver(function( mutations ) {
			mutations.forEach(function( mutation ) {
				
				var newNodes = mutation.addedNodes; // DOM NodeList
				if( newNodes !== null ) { // If there are new nodes added
						var $nodes = $( newNodes ); // jQuery set
						var img = browser.extension.getURL("/img/openFood.png"); 
							$nodes.each(function() {
								var $node = $( this );
								
								if( $node.hasClass( "liWCRS310_Product" ) ) {
									console.log("product inserted in DOM");
									$node.find(".divWCRS310_HD").append("<img class='openfood' src='"+img+"'>");
									
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
function getLeclercDriveQueryURL(elm){
	var detail;

	detail =elm.parent(".divWCRS310_HD").prevAll(".pWCRS310_Desc").find("a").html();
	console.log("Detail leclerc :");
	console.log(detail);
	return filterTitle(detail);


}
