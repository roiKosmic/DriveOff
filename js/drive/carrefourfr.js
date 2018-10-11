var carrefourfr = function() {
	this.name = 'carrefourfr';
	this.domain = 'carrefour.fr';
	this.lang = 'fr';
	this.selector = 'body';
};

carrefourfr.prototype = new Drive('carrefourfr');

carrefourfr.prototype.localMutationObserver=function(mutations,localThis){
		console.log("carrefour dom mutation");
		$(".carrefour").remove();
		$(".product-card__body").append("<img class='openfood carrefour' src='"+this.DriveOffLocal.clickImgFile+"'>");
					
		if($(".cd-ProductContainer").length){
			console.log("In carrefour ooshop");
			$(".cd-ProductVisual").append("<img class='openfood carrefour cd-ProductOrigin' src='"+this.DriveOffLocal.clickImgFile+"'>");	
		}
};
  
carrefourfr.prototype.addingExtension = function(){
	console.log(this);
		$(".nutriTaux").height("120");
		$(".nutriAdditif").height("120");
		$(".productBarCode").height("120");
		$(".nutriImg").height("120");
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
