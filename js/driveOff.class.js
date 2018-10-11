/*
** CLASS DriveOff
**
** OpenFoodFacts Website 	:	https://world.openfoodfacts.org/
**
** GitHub Project 	:	https://github.com/roiKosmic/DriveOff
**
** Version 1.0.0 datée du 04-10-2018
**
** 
*/

//@lang 	string (lang of the DB you need)
function DriveOff(lang) {
	this.lang 	= lang;
	this.messageError 	= [];
}//__construct



DriveOff.prototype = {
	/* ***Paramétrage de la classe*** */
	debug : true,  
	messageError: [],
	
	data : [],
	
	driveDomain : '',
	driveClassName : '',
	driveObject : '',
	
	requestURL:'',
	lang : 'fr',
	http : 'https',
	domain : 'openfoodfacts.org',
	requestSearchURI : '/cgi/search.pl',
	searchParameters: {
		search_simple : '1',
		action 	: 'process',
		json 	: '1',
		appversion 	: encodeURIComponent(chrome.runtime.getManifest().version),
		appid 		: encodeURIComponent(chrome.runtime.getManifest().name)
	},
	requestProductPattern : '/api/v0/product/[[value]].json',
	maxWordsSearch:4,
	
	blackListWords : ['une','un','des','de','au','aux','à','sur','de','d','l','s','par'],
	clickImg : "/img/openFood.png",
	clickImgFile : "/img/openFood.png",
	
	buildURL: function (action,value){
		var parametersURI = [];
		for(i in this.searchParameters) {
			if ( typeof(this.searchParameters[i]) !== 'undefined')
			{
				parametersURI.push(i+'='+this.searchParameters[i]);
			}
		}
		
		if(value === '' || typeof value === 'undefined'){
			throw "You must have a value if you want to search on OFF";
		}
		
		if(action == 'product'){
			this.requestURL = this.http+'://'+this.lang+'.'+this.domain+this.requestProductPattern.replace('[[value]]',value);
		}else{
			this.requestURL = this.http+'://'+this.lang+'.'+this.domain+this.requestSearchURI+'?'+parametersURI.join('&')+"&search_terms="+value;
		}
		
		this.showLog(this.requestURL);
		
		return this.requestURL;
	},
	
	/* ***** GET FUNCTIONS ****** */

	//desc 	retourne le message d'erreur courant
	getMessageError: function() { 
		return this.messageError;
	},
	
	/* ***** SET FUNCTIONS ****** */
	
	//@bool	boolean (true = debug activated)
	//desc	initialise the debug mode
	setDebug: function (bool) { 
		this.debug = bool;
	},
	
	/* ***** EXECUTION FUNCTIONS ****** */
	
	init:function(){
		Drive = new Drive();
		
		this.clickImgFile = chrome.extension.getURL(this.clickImg);
		
		this.driveDomain = document.domain;
		this.driveDomain = this.driveDomain.replace(/^([a-z]|[0-9]|\-)*\./,"");
		this.driveClassName = this.driveDomain.replace(/\./,"");
		
		try {
			this.showLog(this.driveDomain+' : OK');
			var driveObject = Drive.loadObject(this.driveClassName);
			driveObject.DriveOffLocal = this;
			
			// Avoid infinite loop into the object
			this.driveObject = driveObject;
			
			this.driveObject.addingExtension();
			this.driveObject.addingObserver();
		}catch(error) {
			this.showLog(this.driveDomain);
			this.showLog(error);
			return;
		}
		
		this.attachExtensionBar();
		
		this.initDisplay();
		
		this.bindEventToSnackbar();
		this.bindOpenFoodIconEvent();
	},
	
	buildSearchString:function(title){
		var productTitle = title.replace(/x\d+/,"");
		productTitle = productTitle.replace(/<[a-zA-Z]*>/,"");
		productTitle = productTitle.replace(/\d+(l|g|cl|kg)/,"");
		productTitle = productTitle.trim().toLowerCase();
		console.log("Before splitting :"+productTitle);
		var split = productTitle.split(/[, ;\.:\/!?"«»)(\*><]+/);
		var searchString ="";
		for (i = 0; i < split.length; i++) { 
			var words = split[i].split(/[\'-]+/);
			
			for (j = 0; j < words.length; j++) { 
				if(this.blackListWords.indexOf(words[j]) !== -1){continue;}
				if(words[j].length <= 1){continue;}
				searchString +=words[j];
				searchString +=" ";
			}
		}
		var split = searchString.split(" ");
		searchString = "";
		if(split.length<this.maxWordsSearch){
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
		/*
		console.log("SearchString: "+searchString);
		var search = url+"&search_terms="+searchString;
		*/
		console.log("Search URL : "+searchString);
		return searchString;
	},
	
	/* ***** BINDING Functions ****** */
	
	bindOpenFoodIconEvent:function (){
		// SAVE "this" reference for .on local use to avoir conflict between 2 different "this" references
		var DriveOffLocal = this;
		
		$(".openfood").on("mouseenter",function(){
			console.log("Openfood details");
			$("#productList").empty();
			$("#productList").html("<div id='spinner'>Collecte des données auprès de Open Food Facts...</div>");
			
			DriveOffLocal.showLog(DriveOffLocal.driveDomain);
			
			var HTMLObject = $(this);
			
			var queryURL = DriveOffLocal.driveObject.getQueryURL(HTMLObject);
			
			if(typeof(queryURL) !== 'undefined'){
				data_ = [];
				$.ajax({
					url: queryURL,
				
					error: function() {
						DriveOffLocal.showLog('ERROR');
					},
					success: function(data) {
						DriveOffLocal.showLog('SUCCESS');
						DriveOffLocal.showLog(data);
						DriveOffLocal.fillList(data);
					},
					
					type: 'GET'
				});
			}
			
			// Add the "show" class to DIV
			//x.className = "show";
			$("#snackbar").fadeIn("slow");
			// After 3 seconds, remove the show class from DIV
			//setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
			}
		);
	},
	
	initDisplay:function (){
		$(".detail").hide();
		$("#snackbar").hide();
		$(".inputSearch").hide();
	},
	
	bindEventToSnackbar:function (){
		// SAVE "this" reference for .on local use to avoir conflict between 2 different "this" references
		var DriveOffLocal = this;
		
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
			$("#productList").html("<div id='spinner'>Collecte des données auprès de Open Food Facts...</div>");
			DriveOffLocal.showLog("leave box");
		});
		
		$("#inputBox").on('focus', function() { $(this).select(); });
		
		$('#inputBox').on('keypress', function (e) {
			 if(e.which === 13){

				//Disable textbox to prevent multiple submit
				$(this).attr("disabled", "disabled");
				$("#productList").html("<div id='spinner'>Recherche en cours...</div>");
				$(".detail").hide();
				var manualSearch = url + "&search_terms="+encodeURIComponent($(this).val());
				DriveOffLocal.showLog("Manual search "+manualSearch);
				data_ = [];
				$.ajax({
				url: manualSearch,
			
				error: function() {
		  
				},
				success: function(data) {
					DriveOffLocal.showLog(data);
					DriveOffLocal.fillList(data);
				},
		
				type: 'GET'
			});

				//Enable the textbox again if needed.
				$(this).removeAttr("disabled");
			 }
	   });

	},
	
	/* ***** DISPLAY FUNCTIONS ****** */
	attachExtensionBar:function(){
		//Attaching extension bar to site
		$("<div id='snackbar'>"+this.getContent()+"</div>").appendTo("body");
	},

	getContent : function(){
		return "<div class='detail'>"
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
				+"<div id='spinner'>Collecte des données auprès de Open Food Facts...</div>"	
				+"</div>"
				+"<div class='searchBar'><div class='searchIcon'></div><div  class='inputSearch'><input id='inputBox' type='text'  value='Recherche...'><div class='closeIcon'></div></div></div>"
				+"</div>";
	},
	
	fillList:function(data){
		this.data = data;
		
		// SAVE "this" reference for .on local use to avoir conflict between 2 different "this" references
		var DriveOffLocal = this;
		
		$("#productList").empty();
		if(this.data.products === undefined){
			if(this.data.status==1){ 
					$("#productList").append("<div indice='0' class='product'>"
							+"<div class='triangle'>&nbsp;</div>"
							+"<div id='pimg_0' class='pDescription'></div>"
							+"	</div>");
						
						if(this.data.product.image_url===undefined){
							$("#pimg_0").css("background-image","url("+chrome.extension.getURL('/img/unknown.jpg')+")");
						}else{
							$("#pimg_0").css("background-image","url("+this.data.product.image_url+")");
						}
				
			}else{
				$("#productList").html("<div id='spinner'>La recherche n'a retourné aucun résultat</div>");
				//setTimeout(function(){ $("#snackbar").fadeOut("slow");; }, 2000);
				
			}
		
		}else{
			if(this.data.products.length > 0){ 
				for(i=0;i<this.data.products.length;i++){
				
					$("#productList").append("<div indice="+i+" class='product'>"
							+"<div class='triangle'>&nbsp;</div>"
							+"<div id='pimg_"+i+"' class='pDescription'></div>"
							+"	</div>");
						
					if(this.data.products[i].image_url===undefined){
						$("#pimg_"+i).css("background-image","url("+chrome.extension.getURL('/img/unknown.jpg')+")");
					}else{
						$("#pimg_"+i).css("background-image","url("+this.data.products[i].image_url+")");
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
					console.log('INDICE : '+indice);
					DriveOffLocal.fillDetail(indice);
				});
				
				$(".product").on("mouseenter",function(){
					$(".detail").fadeIn("slow");
				});
				
				$(".product").on("mouseout",function(){
					$(this).find(".triangle").css("background-color","rgb(211, 211, 211)");
				});
	},

	fillDetail:function (indice){
		var product_;
		if(this.data.products === undefined){
			product_ = this.data.product;
		}else{
			product_ = this.data.products[indice];
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
	},

	//desc 	montre des erreur de code en alert si le debuggage est actif
	showLog: function (msg) {
		if (this.debug) { console.log(msg); }
	}
};
