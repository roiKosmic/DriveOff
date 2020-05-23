var casinodrivefr = function() {
	this.name = 'casinodrivefr';
	this.domain = 'casinodrive.fr';
	this.lang = 'fr';
	this.selector = '.prodlist';
	
	this.productSelector = '.tagClick';
	this.productClassname = 'tagClick';
};

casinodrivefr.prototype = new Drive('casinodrivefr');

casinodrivefr.prototype.localMutationObserver=function(mutations,localThis){
};
  
casinodrivefr.prototype.addingExtension = function(){
	$(this.productSelector).append(this.DriveOffLocal.clickImgFileHTML);
};
	
casinodrivefr.prototype.getProductInfo=function(elm){
	var productName = elm.parent(this.productSelector).attr("data-product-name").trim();
	var productNamePlusBrand = elm.parent(this.productSelector).children('.inner').children('.description').text().trim();
	var productBrand = productNamePlusBrand.replace(productName,'').trim();
	
	var lqtity = elm.parent(this.productSelector).children('.inner').children('.conditionnement').children('.info').text().split("|");
	lqtity = lqtity['0'].trim();
	
	this.brand = productBrand;
	this.quantity = lqtity;
	this.searchTerms = productNamePlusBrand;
};
