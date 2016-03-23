$(document).ready(function(){
	
	var caja = $('#caja');
	
	$('#loginbutton').click(function(event){
		event.preventDefault();
		event.stopPropagation();
		
		if (caja.is(":visible")){
			caja.slideUp('slow');
		}else{
			caja.slideDown('slow');
		}});
});