/*
** CLASS DriveOff
**
** OpenFoodFacts Website 	:	https://world.openfoodfacts.org/
**
** GitHub Project 	:	https://github.com/roiKosmic/DriveOff
**
** Version 2.0.0 datée du 21-05-2020
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
	clickImgFileHTML : '',
	
	buildURL: function (action,value,brand){
		var parametersURI = [];
		for(i in this.searchParameters) {
			if ( typeof(this.searchParameters[i]) !== 'undefined')
			{
				parametersURI.push(i+'='+this.searchParameters[i]);
			}
		}
		
		if(value === '' || typeof value === 'undefined'){
			throw chrome.i18n.getMessage("messageEmptysearch");
		}
		
		if(action == 'product'){
			this.requestURL = this.http+'://'+this.lang+'.'+this.domain+this.requestProductPattern.replace('[[value]]',value);
		}else if(typeof brand !== "undefined"){
			this.requestURL = this.http+'://'+this.lang+'.'+this.domain+this.requestSearchURI+'?'+parametersURI.join('&')+"&search_terms="+value+"&tagtype_0=brands&tag_contains_0=contains&tag_0="+brand;
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
		this.clickImgFileHTML = "<img class='driveoff-openfood' src='"+this.clickImgFile+"' />";
		
		this.driveDomain = document.domain.replace(/^([a-z]|[0-9]|\-)*\./,"");
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
		// doublon avec localThis.DriveOffLocal.bindOpenFoodIconEvent();
		//this.bindOpenFoodIconEvent();
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
		
		$(".driveoff-openfood").on("click",function(){
			console.log("Openfood details");
			$("#driveoff-productlist").empty();
			$("#driveoff-productlist").html("<div id='driveoff-spinner'>"+chrome.i18n.getMessage("messageDatacollection")+"</div>");
			
			DriveOffLocal.showLog(DriveOffLocal.driveDomain);
			
		//	var HTMLObject = $(this);
			
			var queryURL = DriveOffLocal.driveObject.getQueryURL($(this));
			
			// get CACHE
			var json_data = sessionStorage.getItem(queryURL);
			var data = null;
			if(json_data !== null){
				data = JSON.parse(json_data);
			}
			
			if(typeof(queryURL) !== 'undefined' && data === null){
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
						
						// set CACHE
						var json_data = JSON.stringify(data);
						sessionStorage.setItem(queryURL,json_data);
					},
					
					type: 'GET'
				});
			}else if(data !== null){
				DriveOffLocal.showLog('CACHED');
				DriveOffLocal.showLog(data);
				DriveOffLocal.fillList(data);
			}
			
			// Add the "show" class to DIV
			//x.className = "show";
			$("#driveoff-snackbar").fadeIn("slow");
			// After 3 seconds, remove the show class from DIV
			//setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
		});
	},
	
	initDisplay:function (){
		$(".driveoff-detail").hide();
		$("#driveoff-snackbar").hide();
		$(".driveoff-inputsearch").hide();
	},
	
	bindEventToSnackbar:function (){
		// SAVE "this" reference for .on local use to avoir conflict between 2 different "this" references
		var DriveOffLocal = this;
		
		$(".driveoff-searchicon").on("click",function(){
			$(".driveoff-inputsearch").show("slow");
		});
		
		$(".driveoff-closeicon").on("click",function(){
				$(".driveoff-inputsearch").hide("slow");
				$('#driveoff-inputbox').val("Recherche...");
				$('#driveoff-inputbox').text("Recherche...");
		});

		
		$(".driveoff-box").on("mouseleave",function(){
			var x = document.getElementById("driveoff-snackbar");
			$("#driveoff-snackbar").fadeOut("slow");
			$(".driveoff-inputsearch").hide();
			$('#driveoff-inputbox').val("Recherche...");
			$(".driveoff-detail").hide();
			$("#driveoff-productlist").html("<div id='driveoff-spinner'>"+chrome.i18n.getMessage("messageDatacollection")+"</div>");
			DriveOffLocal.showLog("leave box");
		});
		
		$("#driveoff-inputbox").on('focus', function() { $(this).select(); });
		
		
		$('#driveoff-inputbox').on('keypress', function (e) {
			 if(e.which === 13){

				//Disable textbox to prevent multiple submit
				$(this).attr("disabled", "disabled");
				$("#driveoff-productlist").html("<div id='driveoff-spinner'>"+chrome.i18n.getMessage("messageDatasearch")+"</div>");
				$(".driveoff-detail").hide();
				var manualSearch = DriveOffLocal.buildURL('search',encodeURIComponent($(this).val()));
				 DriveOffLocal.showLog("Manual search "+manualSearch);
				data_ = [];
				$.ajax({
				url: manualSearch,
			
				error: function() {
					console.log('ERROR bindEventToSnackbar');
				},
				success: function(data) {
					console.log('SUCCESS bindEventToSnackbar');
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
		$("<div id='driveoff-snackbar'>"+this.getContent()+"</div>").appendTo("body");
	},

	getContent : function(){
		return `<div class='driveoff-detail'>
				  <div class='driveoff-title'>[[TITLE]]</div>
					<div class='driveoff-nutriimg'>
						<img class='driveoff-productImg' id ='driveoff-nutriscore' src='`+chrome.extension.getURL("/img/nutriscore-unknown.svg")+`'/>
						<img class='driveoff-productImg' id ='driveoff-novascore' src='`+chrome.extension.getURL("/img/nova-group-unknown.svg")+`'/>
					</div>
					<div class='driveoff-nutritaux'>
					  <ul class='driveoff-ul'>
						<li class='driveoff-status' id='driveoff-sucres'>`+chrome.i18n.getMessage("labelSugar")+`:</li>
						<li class='driveoff-status' id='driveoff-sels'>`+chrome.i18n.getMessage("labelSalt")+`:</li>
						<li class='driveoff-status' id='driveoff-graisses'>`+chrome.i18n.getMessage("labelFat")+`Graisses:</li>
						<li class='driveoff-status' id='driveoff-sgraisses'>`+chrome.i18n.getMessage("labelSaturatedfat")+`:</li>
					  </ul>
					  <ul class='driveoff-ul'>
						<li id='driveoff-sucres100g'>[[SUGAR]]</li>
						<li id='driveoff-sels100g'>[[SALT]]</li>
						<li id='driveoff-graisses100g'>[[FAT]]</li>
						<li id='driveoff-sgraisses100g'>[[SFAT]]</li>
					  </ul>
					</div>
					<div class='driveoff-nutriadditif'>
					  <ul class='driveoff-ul'>
						<li class='driveoff-status' id='driveoff-sucres'>`+chrome.i18n.getMessage("labelSugar")+`:</li>
						<li class='driveoff-status' id='driveoff-sels'>`+chrome.i18n.getMessage("labelSalt")+`:</li>
						<li class='driveoff-status' id='driveoff-graisses'>`+chrome.i18n.getMessage("labelFat")+`:</li>
						<li class='driveoff-status' id='driveoff-sgraisses'>`+chrome.i18n.getMessage("labelSaturatedfat")+`:</li>
					  </ul>
				  </div>
				<div class='driveoff-productbarcode'><img id='driveoff-barcode'/>
				</div>
				<div class='driveoff-detailfooter'></div>
				</div>
				<div class='driveoff-box'>
				<div id='driveoff-productlist'>
				<div id='driveoff-spinner'>`+chrome.i18n.getMessage("messageDatacollection")+`</div>
				</div>
				<div class='driveoff-searchbar'><div class='driveoff-searchicon'></div>
				<div  class='driveoff-inputsearch'><input id='driveoff-inputbox' type='text'  value='Recherche...'>
				<div class='driveoff-closeicon'></div>
				</div></div>
				</div>`;
	},
	
	fillList:function(data){
		this.data = data;
		
		// SAVE "this" reference for .on local use to avoid conflict between 2 different "this" references
		var DriveOffLocal = this;
		
		$("#driveoff-productlist").empty();
		if(this.data.products === undefined){
			if(this.data.status==1){ 
					$("#driveoff-productlist").append("<div indice='0' class='driveoff-product'>"
							+"<div class='driveoff-triangle'>&nbsp;</div>"
							+"<div id='driveoff-pimg_0' class='driveoff-pdescription'></div>"
							+"	</div>");
						
						if(this.data.product.image_url===undefined){
							$("#driveoff-pimg_0").css("background-image","url("+chrome.extension.getURL('/img/unknown.jpg')+")");
						}else{
							$("#driveoff-pimg_0").css("background-image","url("+this.data.product.image_url+")");
						}
				
			}else{
				$("#driveoff-productlist").html("<div id='driveoff-spinner'>La recherche n'a retourné aucun résultat</div>");
			} 
		
		}else{
			if(this.data.products.length > 0){ 
				for(i=0;i<this.data.products.length;i++){
				
					$("#driveoff-productlist").append("<div indice="+i+" class='driveoff-product'>"
							+"<div class='driveoff-triangle'>&nbsp;</div>"
							+"<div id='driveoff-pimg_"+i+"' class='driveoff-pdescription'></div>"
							+"	</div>");
						
					if(this.data.products[i].image_url===undefined){
						$("#driveoff-pimg_"+i).css("background-image","url("+chrome.extension.getURL('/img/unknown.jpg')+")");
					}else{
						$("#driveoff-pimg_"+i).css("background-image","url("+this.data.products[i].image_url+")");
					}
				
				}
				
			}else{
				$("#driveoff-productlist").html("<div id='driveoff-spinner'>La recherche n'a retourné aucun résultat</div>");
				//setTimeout(function(){ $("#snackbar").fadeOut("slow");; }, 2000);
				
			}
		}
		
		$(".driveoff-product").on("mouseover",function(){
			$(this).find(".driveoff-triangle").css("background-color","rgb(105,105,105)");
			var indice = $(this).attr("indice");
			console.log('INDICE : '+indice);
			DriveOffLocal.fillDetail(indice);
			//$(".driveoff-detail").fadeIn("slow");
		});
				
		$(".driveoff-product").on("click",function(){
			$(".driveoff-detail").fadeIn("slow");
		});
				
		$(".driveoff-product").on("mouseout",function(){
			$(this).find(".driveoff-triangle").css("background-color","rgb(211, 211, 211)");
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
		
		$(".driveoff-detail").find(".driveoff-title").html(name);
		
		if(nutriScore===undefined){
			var nutriURL = chrome.extension.getURL("/img/nutriscore-unknown.svg");
		}else{
			var nutriURL  = chrome.extension.getURL("/img/nutriscore-"+nutriScore+".svg");
		}
		$(".driveoff-detail").find("#driveoff-nutriscore").attr("src",nutriURL);
		
		if(novaScore===undefined){
			var novaURL = chrome.extension.getURL("/img/nova-group-unknown.svg");
		}else{
			var novaURL  = chrome.extension.getURL("/img/nova-group-"+novaScore+".svg");
		}
		$(".driveoff-detail").find("#driveoff-novascore").attr("src",novaURL);
		
		$(".driveoff-detail").find('#driveoff-sucres').attr("class","driveoff-"+sugarLevel);
		$(".driveoff-detail").find('#driveoff-sels').attr("class","driveoff-"+saltLevel);
		$(".driveoff-detail").find('#driveoff-graisses').attr("class","driveoff-"+fatLevel);
		$(".driveoff-detail").find('#driveoff-sgraisses').attr("class","driveoff-"+saturatedFatLevel);
		
		$(".driveoff-detail").find('#driveoff-sucres100g').html(sugar100g);
		$(".driveoff-detail").find('#driveoff-sels100g').html(salt100g);
		$(".driveoff-detail").find('#driveoff-graisses100g').html(fat100g);
		$(".driveoff-detail").find('#driveoff-sgraisses100g').html(saturatedFat100g);
		var string="";
		
		var checkAdditivesFillIn = product_.states.search("ingredients-completed");
		if(checkAdditivesFillIn !=-1){
			
			for(i=0;i<additivesArray.length;i+=4){
				string += "<ul class='driveoff-ul'>";
				j=i;
				while(j<additivesArray.length && j < i+4){
					var additif = additivesArray[j].replace("en:e", "E");
					string+="<li class='driveoff-unknown'>"+additif+"</li>";
					j++;
				}
				string +="</ul>";
			}
			if(additivesArray.length==0){string="<div class='driveoff-additiveinfo'>Aucun additif</div>";}
			$(".driveoff-detail").find(".driveoff-nutriadditif").html(string);
		}else{
			$(".driveoff-detail").find(".driveoff-nutriadditif").html("<div class='driveoff-additiveinfo' >Additifs non renseignés.</div>");
		}
		
		JsBarcode("#driveoff-barcode", product_.code, {format: "EAN13"})
	},

	showLog: function (msg) {
		if (this.debug) { console.log(msg); }
	}
};
