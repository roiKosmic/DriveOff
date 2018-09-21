var url = "https://fr.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1";
var _data;
var myContent = "<div class='detail'>"
				+"<div class='title'>Neo Biscuits cacaotés (vanille)</div>"	
				+"	<div class='nutriImg'>"
				+"		<img class='productImg' src='https://static.openfoodfacts.org/images/misc/nutriscore-e.svg'/>"
				+" 		<img class='productImg' src='https://static.openfoodfacts.org/images/misc/nova-group-4.svg'/>"
				+"	</div>"
				+"	<div class='nutriTaux'>"
				+"</div>"
				+"<div class='nutriAdditif'>"
				+"</div>"
				+"</div>"
				+"<div class='box'>"
				+"<div id='productList'>"
				+"<div class='product'>"
				+"<div class='triangle hide'>&nbsp;</div>"
				+"<div class='pDescription'></div>"
				+"</div>"
				+"<div class='product'>"
				+"<div class='triangle'>&nbsp;</div>"
				+"<div class='pDescription'></div>"
				+"</div>"
				+"<div class='product'>"
				+"<div class='triangle'>&nbsp;</div>"
				+"<div class='pDescription'></div>"
				+"	</div>"
				+"<div class='product'>"
				+"<div class='triangle'>&nbsp;</div>"
				+"<div class='pDescription'></div>"
				+"	</div>"
				+"<div class='product'>"
				+"<div class='triangle'>&nbsp;</div>"
				+"<div class='pDescription'></div>"
				+"	</div>"
				+"<div class='product'>"
				+"<div class='triangle'>&nbsp;</div>"
				+"<div class='pDescription'></div>"
				+"	</div>"
				+"</div>"
				+"</div>";
$(document).ready(function()  {
   
	var img = chrome.extension.getURL("/img/openFood.png"); 
	 $("<div id='snackbar'>"+myContent+"</div>").appendTo("body");
	$(".product-item__shortcuts").append("<img class='product-item__shortcutsButton  openfood' src='"+img+"'>");
	
		
	
	$(".detail").hide();
	$("#snackbar").hide();
	
	
	$(".box").on("mouseenter",function(){
		
			$(".detail").fadeIn("slow");
			
	});
	
	$(".box").on("mouseleave",function(){
	
			$(".detail").fadeOut("slow");
			var x = document.getElementById("snackbar");
		// Add the "show" class to DIV
		//x.className = x.className.replace("show", "");
		//setTimeout(function(){ x.className = x.className.replace("show", ""); }, 1000);
		$("#snackbar").fadeOut("slow");
		console.log("leave box");
	});
	
	
	
	
	$(".openfood").on("mouseenter",function(){
		console.log("Openfood details");
		var detail = $(this).closest("article").attr("data-name");
		 var x = document.getElementById("snackbar");
			//x.innerHTML=detail;
		
		var searchString = detail.replace(/x\d+/,"");
		searchString = searchString.replace(/\d+(l|g|cl)/,"");
		searchString = searchString.replace(/\-/,"");
		searchString = searchString.trim();
		var split = searchString.split(" ");
		searchString ="";
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
		searchString = encodeURIComponent(searchString);
		console.log("SearchString: "+searchString);
		var search = url+"&search_terms="+searchString;
		
		$.ajax({
			url: search,
		
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
	for(i=0;i<data_.products.length;i++){
		
		$("#productList").append("<div indice="+i+" class='product'>"
				+"<div class='triangle'>&nbsp;</div>"
				+"<div id='pimg_"+i+"' class='pDescription'></div>"
				+"	</div>");
		$("#pimg_"+i).css("background-image","url("+data_.products[i].image_url+")");
		
		
	}
	$(".product").on("mouseover",function(){
		$(this).find(".triangle").css("background-color","white");
		var indice = $(this).attr("indice");
		var name = data_.products[indice].product_name;
		$(".detail").find(".title").html(name);
		
	});

	$(".product").on("mouseout",function(){
		$(this).find(".triangle").css("background-color","rgb(211, 211, 211)");
		
	});
}
