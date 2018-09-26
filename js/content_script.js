var url = "https://fr.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1";
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
				+	"<ul>"
				+		"<li class='high' id='sucres'>Sucres:</li>"
				+		"<li class='moderate' id='sels'>Sels:</li>"
				+		"<li class='low' id='graisses'>Graisses:</li>"
				+		"<li class='low' id='sgraisses'>Graisses sat.:</li>"
				+   "</ul>" 
				+"<ul>"
				+		"<li id='sucres100g'>12.22</li>"
				+		"<li id='sels100g'>44.22</li>"
				+		"<li id='graisses100g'>34</li>"
				+		"<li id='sgraisses100g'>23</li>"
				+   "</ul>" 
				+"  </div>"
				+"  <div class='nutriAdditif'>"
				+"<ul>"
				+		"<li class='high' id='sucres'>Sucres:</li>"
				+		"<li class='moderate' id='sels'>Sels:</li>"
				+		"<li class='low' id='graisses'>Graisses:</li>"
				+		"<li class='low' id='sgraisses'>Graisses sat.:</li>"
				+   "</ul>" 
				+"<ul>"
				+		"<li class='high' id='sucres'>Sucres:</li>"
				+		"<li class='moderate' id='sels'>Sels:</li>"
				+		"<li class='low' id='graisses'>Graisses:</li>"
				+		"<li class='low' id='sgraisses'>Graisses sat.:</li>"
				+   "</ul>" 
				+"<ul>"
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
				+"<div id='spinner'>Collecte des données aurpès de OpenFoodFact...</div>"	
				+"</div>"
				+"</div>";
				
				
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

function getAuchanDriveQueryURL(elm){
	var detail;
	if(!inListAuchan){
			detail = elm.closest("article").attr("data-name");
	}else{
		detail =elm.parent(".operations-area").prevAll(".libelle-produit").find("span").html();
		console.log("inlist");
	}
	console.log(detail);
	var x = document.getElementById("snackbar");
	
	var preFilter = ['auchan bio','auchan'];
	var blackListWords = ['une','un','des','de','au','aux','à','sur','de','d','l','s','par'];
	
	var productTitle = detail.replace(/x\d+/,"");
	productTitle = productTitle.replace(/\d+(l|g|cl|kg)/,"");
	productTitle = productTitle.trim().toLowerCase();
	
	for (var i = 0; i < preFilter.length; i++) {
		productTitle = productTitle.replace(preFilter[i], '');
	}
	
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
	searchString = searchString.trim();
	searchString = encodeURIComponent(searchString);
	console.log("SearchString: "+searchString);
	var search = url+"&search_terms="+searchString;
	return search;


}
$(document).ready(function()  {
   
   //Attaching extension bar to site
   $("<div id='snackbar'>"+myContent+"</div>").appendTo("body");
   
	driveSite = document.domain;
	
	switch (driveSite){
		case "www.auchandrive.fr":
			addingExtensionToAuchanDrive();
		break;
	
	}
	
	$(".detail").hide();
	$("#snackbar").hide();
	$(".box").on("mouseenter",function(){
			$(".detail").fadeIn("slow");
	});
	
	$(".box").on("mouseleave",function(){
		$(".detail").fadeOut("slow");
		var x = document.getElementById("snackbar");
		$("#snackbar").fadeOut("slow");
		$("#productList").html("<div id='spinner'>Collecte des données aurpès de OpenFoodFact...</div>");
		console.log("leave box");
	});
	
	
	
	
	$(".openfood").on("mouseenter",function(){
		console.log("Openfood details");
		
		
		switch (driveSite){
		case "www.auchandrive.fr":
			 var queryURL = getAuchanDriveQueryURL($(this));
		break;
	
		}
		
		console.log(queryURL);
		
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
	

});

function fillList(){
$("#productList").empty();
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
		$(".product").on("mouseover",function(){
			$(this).find(".triangle").css("background-color","rgb(105,105,105)");
			var indice = $(this).attr("indice");
			fillDetail(indice);
		});

		$(".product").on("mouseout",function(){
			$(this).find(".triangle").css("background-color","rgb(211, 211, 211)");
		
		});
	}else{
		$("#productList").html("<div id='spinner'>La recherche n'a retourné aucun résultat</div>");
		setTimeout(function(){ $("#snackbar").fadeOut("slow");; }, 2000);
		
	}
}
function fillDetail(indice_){
	var name = data_.products[indice_].product_name;
	var nutriScore =  data_.products[indice_].nutrition_grade_fr;
	var novaScore = data_.products[indice_].nova_groups;
	
	var sugarLevel = data_.products[indice_].nutrient_levels["sugars"];
	var saturatedFatLevel = data_.products[indice_].nutrient_levels["saturated-fat"];
	var fatLevel = data_.products[indice_].nutrient_levels["fat"];
	var saltLevel = data_.products[indice_].nutrient_levels["salt"];
	
	var sugar100g = Number(data_.products[indice_].nutriments["sugars_100g"]).toFixed(2);
	var salt100g = Number(data_.products[indice_].nutriments["salt_100g"]).toFixed(2);
	var fat100g = Number(data_.products[indice_].nutriments["fat_100g"]).toFixed(2);
	var saturatedFat100g = Number(data_.products[indice_].nutriments["saturated-fat_100g"]).toFixed(2);
	
	var additivesArray = data_.products[indice_].additives_tags;
	console.log(additivesArray);
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
	
	for(i=0;i<additivesArray.length;i+=4){
		string += "<ul>";
		console.log("i "+i);
		j=i;
		while(j<additivesArray.length && j < i+4){
			console.log("j "+j);
			string+="<li class='unknown'>"+additivesArray[j]+"</li>";
			j++;
		}
		string +="</ul>";
	}
	
	console.log(string);
	$(".detail").find(".nutriAdditif").html(string);
	JsBarcode("#barcode", data_.products[indice_].code, {format: "EAN13"})
}
