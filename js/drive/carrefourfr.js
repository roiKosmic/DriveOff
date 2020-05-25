var carrefourfr = function() {
	this.name = 'carrefourfr';
	this.domain = 'carrefour.fr';
	this.lang = 'fr';
	this.selector = 'body';
	this.imgSrc ='';
	this.clickImgFileHTML = "<ul class='driveoff-openfood product-badges-list'><li class='product-badges-list__item'><img  class='driveoff-openfood-img' src=''></li>"
};

carrefourfr.prototype = new Drive('carrefourfr');

carrefourfr.prototype.localMutationObserver=function(mutations,localThis){
		console.log("carrefour dom mutation");
		
		$(".driveoff-openfood").remove();
		
		if(typeof $(".product-card__twigwrap") === undefined){console.log(".product-card__twigwrap is undefined");}
		else{console.log($(".product-card__twigwrap").innerHTML);}
		
		//$(".product-card__twigwrap").append(localThis.DriveOffLocal.clickImgFileHTML);
		$(".ds-product-card").append(this.clickImgFileHTML);
		
		// ??	
		if($(".cd-ProductContainer").length){
			console.log("In carrefour ooshop");
			$(".cd-ProductVisual").append(this.clickImgFileHTML);
		}
		
		$(".driveoff-openfood-img").attr('src',this.DriveOffLocal.clickImgFile);
};
  
carrefourfr.prototype.addingExtension = function(){
	//console.log(this);
		/*$(".nutritaux").height("120");
		$(".nutriadditif").height("120");
		$(".productBarCode").height("120");
		$(".nutriimg").height("120");
		*/
		
		if($(".cd-ProductContainer").length){
			console.log("In carrefour ooshop");
			$(".cd-ProductVisual").append(this.clickImgFileHTML);
		}
	$(".ds-product-card").append(this.clickImgFileHTML);
	$(".driveoff-openfood-img").attr('src',this.DriveOffLocal.clickImgFile);
};
	
carrefourfr.prototype.getProductInfo=function(elm){
		this.EAN = elm.parent(".ds-product-card").attr("id");
};
