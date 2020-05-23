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
		
		if(typeof $(".product-card__twigwrap") === undefined){console.log(".product-card__twigwrap is undefined");}
		else{console.log($(".product-card__twigwrap").innerHTML);}
		
		//$(".product-card__twigwrap").append(localThis.DriveOffLocal.clickImgFileHTML);
		$(".ds-product-card").append(localThis.DriveOffLocal.clickImgFileHTML);
		
		// ??	
		if($(".cd-ProductContainer").length){
			console.log("In carrefour ooshop");
			$(".cd-ProductVisual").append(localThis.DriveOffLocal.clickImgFileHTML);	
		}
};
  
carrefourfr.prototype.addingExtension = function(){
	//console.log(this);
		$(".nutritaux").height("120");
		$(".nutriadditif").height("120");
		$(".productBarCode").height("120");
		$(".nutriimg").height("120");
		if($(".cd-ProductContainer").length){
			console.log("In carrefour ooshop");
			$(".cd-ProductVisual").append("<img class='driveoff-openfood cd-ProductOrigin' src='"+this.DriveOffLocal.clickImgFile+"'>");
		}
		$(".product-card__body").append(this.DriveOffLocal.clickImgFileHTML);
};
	
carrefourfr.prototype.getProductInfo=function(elm){
		this.EAN = elm.parent(".ds-product-card").attr("id");
};
