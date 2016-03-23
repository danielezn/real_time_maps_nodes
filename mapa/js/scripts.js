	var markers_storage = new Array();
	var current_events = new Array();
	var marker;
	var	eventos_marcador;
	var auxiliar_router = false;
	var currentMarker;
	var directionDisplay;
	var matriz_eventos = new Array();
	var rutas_disponibles = new Array();
	var ubicacion_inicial;
	var ubicacion_actual;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var track;
	var request;
	var objeto_evento;
	var router_status = false;
	var alert_status = false;
	var add_status = false;
	var gps_status = false;
	var event_status = false;
	var destino_status = false;
	var alerts_count = 0;
	var message_status = false;
	var geo_options = {
	  enableHighAccuracy: true, 
	  maximumAge        : 30000, 
	  timeout           : 27000
	};
	var currentMarker = new google.maps.Marker({
		  title: 'Ubicacion Actual',
		  icon: 'http://192.168.0.180/Tesis/mapa/img/car.png'
	});
	function initialize() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(obtener_centro, locError, geo_options);
			var socket = io.connect('http://192.168.0.180:8080');
			socket.on('notification', function (data) {
				matriz_eventos.length = 0;
				$.each(data.users,function(index,user){
					objeto_evento = {id: user.id, latitud:user.latitud, longitud:user.longitud, descripcion:user.descripcion, retardo:user.retardo, imagen:user.imagen, icono:user.icono};
					objeto_evento = JSON.stringify(objeto_evento);
					matriz_eventos.push(objeto_evento);				
				});
				if(event_status == true){
					delete_olds_events();
					add_news_events();
				}
				if(alert_status == true){
					show_alerts();
				}
				current_events = matriz_eventos.slice();
			});
		} else {
			alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Alerta de Navegador","Su navegador no soporta esta aplicación",true,5000);
		}
	}	  
	function obtener_centro(position){	
		ubicacion_inicial = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var myOptions = {
		  center: ubicacion_inicial,
		  zoom: 14,
		  disableDefaultUI: true,
		  mapTypeId: google.maps.MapTypeId.HYBRID
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	  }
	function gps(slider){
		if(slider == true){
			if( $(window).width() <= 480){
				$('nav ul').slideToggle();
			}
		}
		if(gps_status == false){
			
			if(navigator.geolocation) {
				track = navigator.geolocation.watchPosition(obtener_ubicacion, locError, geo_options);
			} else {
					alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Alerta de Navegador","Su navegador no soporta esta aplicación",true,5000);
			}
		}else{
			document.getElementById("gps").style['background']='#455868';
			currentMarker.setMap(null);
			navigator.geolocation.clearWatch(track);
			gps_status = false;
		}
	}
	function obtener_ubicacion(position){
		ubicacion_actual = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		currentMarker.setPosition(ubicacion_actual);
		currentMarker.setMap(map);
		document.getElementById("gps").style['background']='#006600';
		gps_status = true;
	}
	function router(seleccion_destino,coordenadas_destino,slider){
		if(slider == true){
			if( $(window).width() <= 480){
				$('nav ul').slideToggle();
			}
		}
		if(router_status == false){
			if(gps_status == true){
				if(destino_status == true){ver_destinos(false);}
				if(add_status == true){add_event(false);}
				document.getElementById("indicaciones").style['background']='#006600';
				if(seleccion_destino == true){
					marker = new google.maps.Marker({
					  position: ubicacion_actual,
					  map: map,
					  draggable:true,
					  title:"Escoge el destino"
					});
					
					router_status = true;
					google.maps.event.addListener(marker, "dragend", function(event) {
						auxiliar_router = true;
						router_status = true;
						var end = marker.getPosition();
						end = JSON.stringify(end);
						guardar_destino(end);
						marker.setMap(null);
						calcRoute(end);
				   });
				}else{
					auxiliar_router = true;
					router_status = true;
					coordenadas_destino = JSON.stringify(coordenadas_destino);
					calcRoute(coordenadas_destino);
				}		
			}else{
				alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Alerta de GPS","Debe activar el GPS para obtener su ubicacion",true,5000);
			}
		}else{
				if(marker != undefined){
					marker.setMap(null);
				}
				if(auxiliar_router == true){
					directionDisplay.setMap(null);
					auxiliar_router = false;
				}
				document.getElementById("indicaciones").style['background']='#455868';
				router_status = false;
		}
	}    
    function calcRoute(end) {
		end = JSON.parse(end);
		end = new google.maps.LatLng(end.k,end.A);
		request = {
			origin:ubicacion_actual,
			destination:end,
			provideRouteAlternatives: true,
			travelMode: google.maps.DirectionsTravelMode.DRIVING,
		};
		
		directionsService.route(request, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {				
				select_route(response);
			}else{
				alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Alerta de GPS","Estamos teniendo inconvenientes, por favor espere",true,5000);
			}
		}
		);
	}
	function select_route(response){
		
			var rutas_disponibles = new Array();
			var ruta_seleccionada;
			var tiempo_rutas = new Array();
			
			for(f = 0 ; f < response.routes.length;f++){
				var rutas = new Array();
				var h = 0;
				var auxiliar = 0;
				var path = response.routes[f].overview_path;
				var legs = response.routes[f].legs;
				for (i=0;i<legs.length;i++) {
				   var steps = legs[i].steps;
				   auxiliar += legs[i].duration.value;
				   tiempo_rutas[f] = auxiliar;
				   for (j=0;j<steps.length;j++) {
					 var nextSegment = steps[j].path;
					  for (k=0;k<nextSegment.length;k++) {
						rutas[h++]=nextSegment[k];
					  }
				   }
				}
				rutas_disponibles[f] = rutas;
			}
			
			for(i = 0; i < rutas_disponibles.length; i++){                                                             //Rutas Disponibles
				for(j = 0; j < rutas_disponibles[i].length; j++){                                                      //Pasos en cada Ruta disponible
					for(k = 0 ; k < matriz_eventos.length ; k++){                                                      //Matriz de eventos
						var coordenadas_eventos = new google.maps.LatLng(JSON.parse(matriz_eventos[k]).latitud,JSON.parse(matriz_eventos[k]).longitud);
						if (calculo_distancia(rutas_disponibles[i][j],coordenadas_eventos) < 50){
							tiempo_rutas[i] += JSON.parse(matriz_eventos[k]).retardo;
						}
					}
				}
			}
			var menor_aux = tiempo_rutas[0];
			for(var n = 0 ; n < tiempo_rutas.length;n++){
				if(tiempo_rutas[n] <= menor_aux){
					menor_aux = tiempo_rutas[n];
					ruta_seleccionada = n;
				}
			}
			dibujar_ruta_optima(response,ruta_seleccionada);
	}
	function dibujar_ruta_optima(response,ruta_seleccionada){
			directionDisplay = new google.maps.DirectionsRenderer({
							map: map,
							directions: response,
							routeIndex: ruta_seleccionada,
							preserveViewport: true,
			});
	  }
	function eventos(slider){
		if(slider == true){
			if( $(window).width() <= 480){
				$('nav ul').slideToggle();
			}
		}
		if(event_status == false){
			document.getElementById("eventos").style['background']='#006600';
			event_status = true;
		}else{
			event_status = false;
			document.getElementById("eventos").style['background']='#455868';
			delete_all_events();
		}
	}
	function add_news_events(){
		var ubicacion_evento;
		var evento_individual;
		var eventos_nuevos = new Array();
		var infowindow =  new google.maps.InfoWindow({
            content: ""
        });
		eventos_nuevos = comparar_matrices_eventos_news();	
		if(eventos_nuevos.length == 0 && markers_storage == 0){
			eventos_nuevos = matriz_eventos;
		}
		for(var i = 0 ; i < eventos_nuevos.length ; i++){
			evento_individual = JSON.parse(eventos_nuevos[i]);
			ubicacion_evento = new google.maps.LatLng(evento_individual.latitud,evento_individual.longitud);
			var contenido_marcador = "Coordenadas: "+ubicacion_evento+"<br>Descripcion: "+evento_individual.descripcion+"<br>Retraso: "+evento_individual.retardo+"<br><img src=\""+evento_individual.imagen+"\">" ;
			eventos_marcador = new google.maps.Marker({
				  position: ubicacion_evento,
				  map: map,
				  title: contenido_marcador, 
			});
			markers_storage[evento_individual.id]= eventos_marcador;
			google.maps.event.addListener(eventos_marcador, 'click', function() {
				infowindow.setContent(this.title);
				infowindow.open(map, this);
			});
		}
	}
	function delete_olds_events(){
		var eventos_viejos = new Array();
		eventos_viejos = comparar_matrices_eventos_olds();
		for(var i = 0 ; i < eventos_viejos.length ; i++){
			markers_storage[JSON.parse(eventos_viejos[i]).id].setMap(null);
			markers_storage.splice(JSON.parse(eventos_viejos[i]).id,1);
		}
	}
	function delete_all_events(){
		for(var i = 0 ; i < markers_storage.length ; i++){
			if(markers_storage[i] != undefined){
				markers_storage[i].setMap(null);
			}	
		}
		markers_storage.length = 0;
	}
	function guardar_destino(end){
		var objeto;
		var destinos_recientes = new Array ("0","1","2","3","4");
		var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
		end = JSON.parse(end);
		
		if(localStorage.length == 5){
			localStorage.removeItem("0");
			for(var k = 1 ; k < 5 ; k++){
				localStorage.setItem((k-1).toString(),localStorage.getItem(k.toString()));
			}
			localStorage.removeItem("4");
		}
		
		for(var i = 0 ; i < 5 ; i++){
			if(!localStorage.getItem(destinos_recientes[i])){
				var f=new Date();
				var fecha = f.getHours()+":"+f.getMinutes()+" del "+f.getDate() + " de " + meses[f.getMonth()];
				objeto = {latitud:end.k, longitud:end.A, fecha:fecha};
				objeto = JSON.stringify(objeto);
				localStorage.setItem(destinos_recientes[i],objeto);
				break;
			}
		}
	}
	function ver_destinos(slider){
		if(slider == true){
			if( $(window).width() <= 480){
				$('nav ul').slideToggle();
			}
		}
		if(destino_status == false){
			if( localStorage.length > 0 ){
				if(gps_status == true){
						if(add_status == true){add_event(false);}
						if(router_status == true){router(true,null,false);}
						if(alert_status == true){notificaciones(false);}
						
						document.getElementById("destinos").style['background']='#006600';
						destino_status = true;
						var enlace = "<ul>";
						for(var i = 0 ; i < localStorage.length  ; i++){
							var resultado = localStorage.getItem(i.toString());
							var objeto = JSON.parse(resultado);
							enlace += '<li><a href="#" onclick="ir_destino_anterior('+i+')">'+objeto.fecha+'</a></li>';
						}
						enlace += "</ul>";
						alerts("http://192.168.0.180/Tesis/mapa/img/pin.png","Destinos",enlace,false,0);
						
				}else{
					alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Destinos","Debe encender la opcion GPS",true,5000);
				}
			
			}else{
				alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Destinos","No hay destinos visitados recientemente",true,5000);
			}
		}else{
			destino_status = false;	
			if(router_status == true){router(true,null,false);}
			if(message_status == true){alert_box();}
			document.getElementById("destinos").style['background']='#455868';
		}
		
	}
	function ir_destino_anterior(id_destino){
		if(message_status == true){alert_box();}
		var resultado = localStorage.getItem(id_destino.toString());
		destino_status = false;
		document.getElementById("destinos").style['background']='#455868';
		var objeto = JSON.parse(resultado);
		var ubicacion_auxiliar = new google.maps.LatLng(objeto.latitud,objeto.longitud);
		router(false,ubicacion_auxiliar,false);
	}
	function toRad(x) {
		return x * Math.PI / 180;
	  }
	function calculo_distancia(a,b){
		var lat1 = a.lat();
		var lat2 = b.lat();
		var lon1 = a.lng();
		var lon2 = b.lng();
		var R = 6371; // km
		var dLat = toRad(lat2-lat1);
		var dLon = toRad(lon2-lon1);
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
				Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;   
		return(d*1000);		
	  }
    function locError(error) {
		alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Alerta de GPS","No se pudo obtener ubicacion, problemas con el gps",false,0);
     }
	function notificaciones(slider){
		if(slider == true){
			if( $(window).width() <= 480){
				$('nav ul').slideToggle();
			}
		}
		if(alert_status == false){
			if(destino_status == false){
				if(gps_status == true){
					document.getElementById("notificaciones").style['background']='#006600';
					alert_status = true;
				}else{
					alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Alerta de GPS","Debe iniciar el GPS para activar el ruteador",true,5000);
				}
			}else{
				alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Alerta de Notificaciones","Debe desactivar la opcion Destinos",true,5000);
			}
		}else{
			alerts_count = 0;
			document.getElementById("notificaciones").style['background']='#455868';
			alert_status = false;
		}
	}
	function show_alerts(){
		var eventos_nuevos = new Array();
			eventos_nuevos = comparar_matrices_eventos_news();
			if(eventos_nuevos.length == 0 && alerts_count == 0){
				eventos_nuevos = matriz_eventos;
			}
			for(var i = 0 ; i < eventos_nuevos.length ; i++){
				var new_event = new google.maps.LatLng(JSON.parse(eventos_nuevos[i]).latitud,JSON.parse(eventos_nuevos[i]).longitud);
				var distancia = calculo_distancia(new_event,ubicacion_actual);
				if( distancia < 200){
					var mensaje_evento = JSON.parse(eventos_nuevos[i]).descripcion + " a: "+distancia+" metros<br><img src=\""+JSON.parse(eventos_nuevos[i]).imagen+"\">";
					alerts(JSON.parse(eventos_nuevos[i]).descripcion,"Evento: "+JSON.parse(eventos_nuevos[i]).id,mensaje_evento,true,8000);
				}
				alerts_count++;
			}
	}
	function comparar_matrices_eventos_news(){
		var eventos_nuevos = new Array();
		var id_viejos = new Array();
		for(var i = 0 ; i < current_events.length ; i++){
			id_viejos.push(JSON.parse(current_events[i]).id);
		}
		for(var j = 0 ; j < matriz_eventos.length ; j++){
			if(id_viejos.indexOf(JSON.parse(matriz_eventos[j]).id) == -1){
				eventos_nuevos.push(matriz_eventos[j]);
			}
		}
		return eventos_nuevos;
	}
	function comparar_matrices_eventos_olds(){
		var eventos_viejos = new Array();
		var id_nuevos = new Array();
		for(var i = 0 ; i < matriz_eventos.length ; i++){
			id_nuevos.push(JSON.parse(matriz_eventos[i]).id);
		}
		for(var j = 0 ; j < current_events.length ; j++){
			if(id_nuevos.indexOf(JSON.parse(current_events[j]).id) == -1){
				eventos_viejos.push(current_events[j]);
			}
		}
		return eventos_viejos;
	}
	function alerts(imagen,titulo,mensaje,status_tiempo,tiempo){
		if(message_status == false){
			alert_box();
			document.getElementById('alerts_header').innerHTML = "<div id=\"imagen\"><img src=\""+imagen+ "\"></div><div id=\"titulo\"><h2>"+titulo+"</h2></div>";
			document.getElementById('alerts_body').innerHTML =	mensaje;
			if(status_tiempo == true){	
				setTimeout(alert_box(), tiempo);
			}
		}
	}
	function alert_box(){
		message_status ^= true;
		$('#alertas').toggle('fade',2000);
	}
	function add_event(slider){
		if(slider == true){
			if( $(window).width() <= 480){
				$('nav ul').slideToggle();
			}
		}
		if(add_status == false){
			if(gps_status == true){
				if(router_status == true){router(true,null,false);}
				if(alert_status == true){notificaciones(false);}
				if(destino_status == true){ver_destinos(false);}
				document.getElementById("compartir").style['background']='#006600';
				marker = new google.maps.Marker({
								  position: ubicacion_actual,
								  map: map,
								  draggable:true,
								  title:"Ubica el evento a compartir"
				});
				google.maps.event.addListener(marker, "dragend", function(event) {
					var end = marker.getPosition();
					marker.setMap(null);
					var enlace_mapa = "http://maps.google.es/?q="+end.lat()+"%20"+end.lng();
					tweet = "https://twitter.com/intent/tweet?text="+encodeURI("Evento en:")+"&url="+encodeURI(enlace_mapa);
					tweet = "<a target=\"_blank\" href=\""+tweet+"\"><img src=\"http://192.168.0.180/Tesis/mapa/img/tw.jpg\"></a>";
					
					facebook = "http://www.facebook.com/sharer.php?u="+encodeURI(enlace_mapa)+"&t=Evento";
					facebook = "<a target=\"_blank\" href=\""+facebook+"\"><img src=\"http://192.168.0.180/Tesis/mapa/img/fb.jpg\"></a>";
					
					var tweet = "<div id=\"twitter\">"+tweet+"</div>";
					var facebook = "<div id=\"facebook\">"+facebook+"</div>";
					
					alerts("http://192.168.0.180/Tesis/mapa/img/compartir.png","Compartir",tweet+facebook,false,0);
				});
				add_status = true;
			}else{
				alerts("http://192.168.0.180/Tesis/mapa/img/warning.png","Alerta de GPS","Debe iniciar el GPS para activar el ruteador",true,5000);
			}
		}else{
			if(message_status == true){alert_box();}
			document.getElementById("compartir").style['background']='#455868';
			marker.setMap(null);
			add_status = false
		}
	}