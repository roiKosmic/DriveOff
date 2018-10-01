var url = "https://fr.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&appversion="+encodeURIComponent(chrome.runtime.getManifest().version)+"&appid="+encodeURIComponent(chrome.runtime.getManifest().name);
var _data;
var inListAuchan=false;
var driveSite;
var myContent = "<div class='detail'>"
				+"<div class='title'>Neo Biscuits cacaotés (vanille)</div>"	
				+"	<div class='nutriImg'>"
				+"		<img class='productImg' id ='nutriScore' src='https://static.openfoodfacts.org/images/misc/nutriscore-e.svg'/>"
				+" 		<img class='productImg' id ='novaScore' src='https://static.openfoodfacts.org/images/misc/nova-group-4.svg'/>"
				+"	</div>"
				+"	<div class='nutriTaux'>"
				+	"<ul class='driveOffUl'>"
				+		"<li class='high ' id='sucres'>Sucres:</li>"
				+		"<li class='moderate' id='sels'>Sels:</li>"
				+		"<li class='low' id='graisses'>Graisses:</li>"
				+		"<li class='low' id='sgraisses'>Graisses sat.:</li>"
				+   "</ul>" 
				+"<ul class='driveOffUl'>"
				+		"<li id='sucres100g'>12.22</li>"
				+		"<li id='sels100g'>44.22</li>"
				+		"<li id='graisses100g'>34</li>"
				+		"<li id='sgraisses100g'>23</li>"
				+   "</ul>" 
				+"  </div>"
				+"  <div class='nutriAdditif'>"
				+"<ul class='driveOffUl'>"
				+		"<li class='high' id='sucres'>Sucres:</li>"
				+		"<li class='moderate' id='sels'>Sels:</li>"
				+		"<li class='low' id='graisses'>Graisses:</li>"
				+		"<li class='low' id='sgraisses'>Graisses sat.:</li>"
				+   "</ul>" 
				+"<ul class='driveOffUl'>"
				+		"<li class='high' id='sucres'>Sucres:</li>"
				+		"<li class='moderate' id='sels'>Sels:</li>"
				+		"<li class='low' id='graisses'>Graisses:</li>"
				+		"<li class='low' id='sgraisses'>Graisses sat.:</li>"
				+   "</ul>" 
				+"<ul class='driveOffUl'>"
				+		"<li class='high' id='sucres'>Sucres:</li>"
				+		"<li class='moderate' id='sels'>Sels:</li>"
				+		"<li class='low' id='graisses'>Graisses:</li>"
				+		"<li class='low' id='sgraisses'>Graisses sat.:</li>"
				+   "</ul>" 
				+"  </div>"
				+"<div class='productBarCode'><img id='barcode'/>"
				+"</div>"
				+"<div class='detailfooter'></div>"	
				+"</div>"
				+"<div class='box'>"
				+"<div id='productList'>"
				+"<div id='spinner'>Collecte des données aurpès de Open Food Facts...</div>"	
				+"</div>"
				+"<div class='searchBar'><div class='searchIcon'></div><div  class='inputSearch'><input id='inputBox' type='text'  value='Recherche...'><div class='closeIcon'></div></div></div>"
				+"</div>";

function addingExtensionToCarrefour(){
	var img = chrome.extension.getURL("/img/openFood.png");
	$(".product-card__body").append("<img class='openfood carrefour' src='"+img+"'>");

}
				
function addingExtensionToLeclerc(){
	var img = chrome.extension.getURL("/img/openFood.png"); 
	$(".divWCRS310_HD").append("<img class='openfood' src='"+img+"'>");
	
}
function addingExtensionToAuchanDrive(){
	var img = chrome.extension.getURL("/img/openFood.png"); 

	//Ajout dans la liste des produits sur le liste
	$(".product-item__shortcuts").append("<img class='product-item__shortcutsButton  openfood' src='"+img+"'>");
	
	//Ajout dans le cas d'une liste
	if ( $( ".operations-area" ).length ) {
		$(".operations-area").append("<img class='openfood' src='"+img+"'>");
		inListAuchan=true;
	}
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
						var img = chrome.extension.getURL("/img/openFood.png"); 
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
						var img = chrome.extension.getURL("/img/openFood.png"); 
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

function addingObserverToCarrefour(){
	if($( "body" ).length){
	// The node to be monitored
	 var target = $( "body" )[0];

	// Create an observer instance
	var observer = new MutationObserver(function( mutations ) {
			
				var img = chrome.extension.getURL("/img/openFood.png");
				$(".carrefour").remove();
				$(".product-card__body").append("<img class='openfood carrefour' src='"+img+"'>");
				
				bindOpenFoodIconEvent();
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

	detail = elm.parent(".product-card__body").parent("article").attr("id");
	var _url = "https://fr.openfoodfacts.org/api/v0/product/"+detail+".json";
	return _url;
}
function getLeclercDriveQueryURL(elm){
	var detail;

	detail =elm.parent(".divWCRS310_HD").prevAll(".pWCRS310_Desc").find("a").html();
	console.log("Detail leclerc :");
	console.log(detail);
	return filterTitle(detail);


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

function filterTitle(_title){
	var blackListWords = ['une','un','des','de','au','aux','à','sur','de','d','l','s','par'];
	
	var productTitle = _title.replace(/x\d+/,"");
	productTitle = productTitle.replace(/\d+(l|g|cl|kg)/,"");
	productTitle = productTitle.trim().toLowerCase();
	var split = productTitle.split(/[, ;\.:\/!?"«»)(\*><]+/);
	var searchString ="";
	for (i = 0; i < split.length; i++) { 
		var words = split[i].split(/[\'-]+/);
		
		for (j = 0; j < words.length; j++) { 
			if(blackListWords.indexOf(words[j]) !== -1){continue;}
			if(words[j].length <= 1){continue;}
			searchString +=words[j];
			searchString +=" ";
		}
	}
	var split = searchString.split(" ");
	searchString = "";
	if(split.length<4){
		for(i=0;i<split.length;i++){
			searchString +=split[i];
			searchString +=" ";
		}
	}else{
		for(i=0;i<4;i++){
			searchString +=split[i];
			searchString +=" ";
		}
	}
	searchString = searchString.trim();
	searchString = searchString.trim();
	searchString = encodeURIComponent(searchString);
	console.log("SearchString: "+searchString);
	var search = url+"&search_terms="+searchString;
	console.log("Search URL :"+search);
	return search;
}
$(document).ready(function()  {
   
   
   	//Attaching extension bar to site
   $("<div id='snackbar'>"+myContent+"</div>").appendTo("body");
	driveSite = document.domain;
	driveSite = driveSite.replace(/^([a-z]|[0-9]|\-)*\./,"");
	console.log("drive is :"+driveSite);
	switch (driveSite){
		case "auchandrive.fr":
			addingExtensionToAuchanDrive();
			addingObserverToAuchanDrive();
		break;
		case "leclercdrive.fr":
			console.log("Entering leclercdrive");
			addingExtensionToLeclerc();
			addingObserverToLeclercDrive();
		break;
		
		case "carrefour.fr":
			console.log("Entering carrefour drive");
			addingExtensionToCarrefour();
			addingObserverToCarrefour();
			
		break;
	}
	bindEventToSnackbar();
	bindOpenFoodIconEvent();


});

function bindEventToSnackbar(){
	
	$(".detail").hide();
	$("#snackbar").hide();
	$(".inputSearch").hide();
	
	$(".searchIcon").on("click",function(){
			$(".inputSearch").show("slow");
			
	});
	
	$(".closeIcon").on("click",function(){
			$(".inputSearch").hide("slow");
			$('#inputBox').val("Recherche...");
			$('#inputBox').text("Recherche...");
	});

	
	$(".box").on("mouseleave",function(){
		
		var x = document.getElementById("snackbar");
		$("#snackbar").fadeOut("slow");
		$(".inputSearch").hide();
		$('#inputBox').val("Recherche...");
		$(".detail").hide();
		$("#productList").html("<div id='spinner'>Collecte des données aurpès de Open Food Facts...</div>");
		console.log("leave box");
	});
	
	$("#inputBox").on('focus', function() { $(this).select(); });
	
	 $('#inputBox').on('keypress', function (e) {
         if(e.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
			$("#productList").html("<div id='spinner'>Recherche en cours...</div>");
			$(".detail").hide();
			var manualSearch = url + "&search_terms="+encodeURIComponent($(this).val());
			console.log("Manual search "+manualSearch);
			data_ = [];
            $.ajax({
			url: manualSearch,
		
			error: function() {
      
			},
			success: function(data) {
			console.log(data);
			data_ = data;
			fillList();
			},
	
			type: 'GET'
		});

            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
         }
   });

}
function bindOpenFoodIconEvent(){

	$(".openfood").on("mouseenter",function(){
		console.log("Openfood details");
		$("#productList").empty();
		$("#productList").html("<div id='spinner'>Collecte des données aurpès de Open Food Facts...</div>");
		switch (driveSite){
		case "auchandrive.fr":
			 var queryURL = getAuchanDriveQueryURL($(this));
		break;
		
		case "leclercdrive.fr":
			var queryURL = getLeclercDriveQueryURL($(this));
		break;
		
		case "carrefour.fr":
			var queryURL = getCarrefourQueryURL($(this));
		break;
		
		}
		
		console.log(queryURL);
		data_ = [];
		$.ajax({
			url: queryURL,
		
			error: function() {
      
			},
			success: function(data) {
			console.log(data);
			data_ = data;
			fillList();
			},
			
			type: 'GET'
		});
		
		// Add the "show" class to DIV
		//x.className = "show";
		$("#snackbar").fadeIn("slow");
		// After 3 seconds, remove the show class from DIV
		//setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
		}
	);
	

}

function fillList(){
	$("#productList").empty();
	if(data_.products === undefined){
		if(data_.status==1){ 
				$("#productList").append("<div indice='0' class='product'>"
						+"<div class='triangle'>&nbsp;</div>"
						+"<div id='pimg_0' class='pDescription'></div>"
						+"	</div>");
					
					if(data_.product.image_url===undefined){
						$("#pimg_0").css("background-image","url("+chrome.extension.getURL('/img/unknown.jpg')+")");
					}else{
						$("#pimg_0").css("background-image","url("+data_.product.image_url+")");
					}
			
		}else{
			$("#productList").html("<div id='spinner'>La recherche n'a retourné aucun résultat</div>");
			//setTimeout(function(){ $("#snackbar").fadeOut("slow");; }, 2000);
			
		}
	
	}else{
		if(data_.products.length > 0){ 
			for(i=0;i<data_.products.length;i++){
			
				$("#productList").append("<div indice="+i+" class='product'>"
						+"<div class='triangle'>&nbsp;</div>"
						+"<div id='pimg_"+i+"' class='pDescription'></div>"
						+"	</div>");
					
				if(data_.products[i].image_url===undefined){
					$("#pimg_"+i).css("background-image","url("+chrome.extension.getURL('/img/unknown.jpg')+")");
				}else{
					$("#pimg_"+i).css("background-image","url("+data_.products[i].image_url+")");
				}
			
			}
			
		}else{
			$("#productList").html("<div id='spinner'>La recherche n'a retourné aucun résultat</div>");
			//setTimeout(function(){ $("#snackbar").fadeOut("slow");; }, 2000);
			
		}
	}
	
	$(".product").on("mouseover",function(){
				$(this).find(".triangle").css("background-color","rgb(105,105,105)");
				var indice = $(this).attr("indice");
				fillDetail(indice);
			});
			
			$(".product").on("mouseenter",function(){
				$(".detail").fadeIn("slow");
			});
			
			$(".product").on("mouseout",function(){
				$(this).find(".triangle").css("background-color","rgb(211, 211, 211)");
			});
			
}
function fillDetail(indice_){
	var product_;
	if(data_.products === undefined){
		product_ = data_.product;
	}else{
		product_ = data_.products[indice_];
	}
	var name = product_.product_name;
	var nutriScore =  product_.nutrition_grade_fr;
	var novaScore = product_.nova_groups;
	
	var sugarLevel = product_.nutrient_levels["sugars"];
	var saturatedFatLevel = product_.nutrient_levels["saturated-fat"];
	var fatLevel = product_.nutrient_levels["fat"];
	var saltLevel = product_.nutrient_levels["salt"];
	
	var sugar100g = Number(product_.nutriments["sugars_100g"]).toFixed(2);
	var salt100g = Number(product_.nutriments["salt_100g"]).toFixed(2);
	var fat100g = Number(product_.nutriments["fat_100g"]).toFixed(2);
	var saturatedFat100g = Number(product_.nutriments["saturated-fat_100g"]).toFixed(2);
	
	var additivesArray = product_.additives_tags;
	
	$(".detail").find(".title").html(name);
	
	if(nutriScore===undefined){
		var nutriURL = chrome.extension.getURL("/img/unknown.jpg");
	}else{
		var nutriURL  = chrome.extension.getURL("/img/nutriscore-"+nutriScore+".svg");
	}
	$(".detail").find("#nutriScore").attr("src",nutriURL);
	
	if(novaScore===undefined){
		var novaURL = chrome.extension.getURL("/img/unknown.jpg");
	}else{
		var novaURL  = chrome.extension.getURL("/img/nova-group-"+novaScore+".svg");
	}
	$(".detail").find("#novaScore").attr("src",novaURL);
	
	$(".detail").find('#sucres').attr("class",sugarLevel);
	$(".detail").find('#sels').attr("class",saltLevel);
	$(".detail").find('#graisses').attr("class",fatLevel);
	$(".detail").find('#sgraisses').attr("class",saturatedFatLevel);
	
	$(".detail").find('#sucres100g').html(sugar100g);
	$(".detail").find('#sels100g').html(salt100g);
	$(".detail").find('#graisses100g').html(fat100g);
	$(".detail").find('#sgraisses100g').html(saturatedFat100g);
	var string="";
	
	var checkAdditivesFillIn = product_.states.search("ingredients-completed");
	if(checkAdditivesFillIn !=-1){
		
		for(i=0;i<additivesArray.length;i+=4){
			string += "<ul class='driveOffUl'>";
			j=i;
			while(j<additivesArray.length && j < i+4){
				var additif = additivesArray[j].replace("en:e", "E");
				string+="<li class='unknown'>"+additif+"</li>";
				j++;
			}
			string +="</ul>";
		}
		if(additivesArray.length==0){string="<div class='additiveInfo'>Aucun additif</div>";}
		$(".detail").find(".nutriAdditif").html(string);
	}else{
		$(".detail").find(".nutriAdditif").html("<div class='additiveInfo' >Additifs non renseignés.</div>");
	}
	
	JsBarcode("#barcode", product_.code, {format: "EAN13"})
}
