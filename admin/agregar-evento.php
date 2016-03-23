<!DOCTYPE HTML>
<html>

<head>
  <title>Control de Trafico</title>
  <meta name="description" content="website description" />
  <meta name="keywords" content="website keywords, website keywords" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <link rel="stylesheet" type="text/css" href="css/style.css" />
  <!-- modernizr enables HTML5 elements and feature detects -->
  <script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
  <script type="text/javascript" src="http://maps.google.com/maps/api/js?key=AIzaSyCDL6q3JnBIQc8Hi8zemTD_gH2VHprKOgk&sensor=true"></script>
  <script type="text/javascript">
	  var geo_options = {
		  enableHighAccuracy: true, 
		  maximumAge        : 30000, 
		  timeout           : 27000
		};
      function initialize() {
        if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(obtener_centro, locError, geo_options);
		}
      }
	  function obtener_centro(position){	
		ubicacion_inicial = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		var myOptions = {
		  center: ubicacion_inicial,
		  zoom: 15,
		  mapTypeId: google.maps.MapTypeId.HYBRID
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		var marker = new google.maps.Marker({
		  map:map,
		  position: ubicacion_inicial,
		  title: 'Ubicacion de Evento',
		  draggable:true
		});
		google.maps.event.addListener(marker, "dragend", function(event) {
			var ubicacion = marker.getPosition();
			document.getElementById('latitud').value = ubicacion.lat();
			document.getElementById('longitud').value = ubicacion.lng();				
		});
	  }
	  function locError(error) {
		alert("Problemas para obtener ubicacion");
	  }
    </script>
</head>

<body onload="initialize()">
  <div id="main">
    <header>
      <div id="logo">
        <div id="logo_text">
          <h1><a href="index.php">Control<span class="logo_colour">_Trafico</span></a></h1>
          <h2>UTMC Proyecto de Tesis</h2>
        </div>
      </div>
      <nav>
        <ul class="sf-menu" id="nav">
          <li class="selected"><a href="index.php">Home</a></li>
		  <li><a href="#">Eventos</a>
			<ul>
				<li><a href="agregar-evento.php">Agregar</a></li>
				<li><a href="editar-evento.php">Editar</a></li>
				<li><a href="eliminar-evento.php">Eliminar</a></li>
			</ul>
		  </li>
          <li><a href="#">Usuarios</a>
			<ul>
				<li><a href="agregar-usuario.php">Agregar</a></li>
				<li><a href="editar-usuario.php">Editar</a></li>
				<li><a href="eliminar-usuario.php">Eliminar</a></li>
			</ul>
		  </li>
		  <li><a href="#">Dispositivos</a>
			<ul>
				<li><a href="agregar-dispositivo.php">Agregar</a></li>
				<li><a href="editar-dispositivo.php">Editar</a></li>
				<li><a href="eliminar-eliminar.php">Eliminar</a></li>
			</ul>
		  </li>
		  <li><a href="../logout.php" id="idlogout">Logout</a></li>
        </ul>
      </nav>
    </header>
    <div id="site_content">
		  <div id="mapa"><div id="map_canvas" style="width:100%; height:100%"></div></div>
		  <div id="content">
			<form enctype="multipart/form-data" action = "agregar-evento.php" method="POST">
					<label>Titulo:</label><br>
					<input type="text" name="titulo"><br>
					<label>Tipo</label><br>
					<select name="tipo">
					 <?php	
							$mysqli = new mysqli("localhost","root","realflight","blog");
							if($mysql === false){
								die("Error: No se pudo conectar a la base de datos");
								echo "problema conexion";
							}
							$sqltipo = "SELECT titulo FROM tipo_eventos";
							
							if($resultadotipo = $mysqli->query($sqltipo)){
								if($resultadotipo->num_rows > 0){
									while($rowtipo = $resultadotipo->fetch_object()){
										echo "<option value=\"".$rowtipo->id."\">".$rowtipo->titulo."</option>\n";
									}
									$resultadoperiodo->close;
								}else{
									echo 'No se encontraron resultados';
								}
							}
							$mysqli->close();
					?>
					</select><br>
					<label>Retardo:</label><br>
					<input type="text" name="retardo"><br>
					<label>Latitud:</label><br>
					<input type="text" name="latitud" id="latitud"><br>
					<label>Longitud:</label><br>
					<input type="text" name="longitud" id="longitud"><br>
					<label>Descripción:</label><br>
					<TEXTAREA NAME="descripcion" ROWS=6 COLS=17></TEXTAREA><br>				
					<label>Imagen:</label><br>
					<input type="file" name="archivo" id="archivo"/><br><br>
					<input type="submit" name="submit" value="enviar" />
				
			</form>
			<?php
			 	if (isset($_POST['submit'])){
				  $nombre = $_FILES['archivo']['name'];
				  $nombre_tmp = $_FILES['archivo']['tmp_name'];
				  $tipo = $_FILES['archivo']['type'];
				  $tamano = $_FILES['archivo']['size'];
				  $direccion = "http://192.168.0.180/Tesis/admin/images/upload-events/".$nombre;
				  $limite = 50000 * 1024;

				  if( $tamano <= $limite ){
					if( $_FILES['archivo']['error'] > 0 ){
					  echo 'Error: ' . $_FILES['archivo']['error'] . '<br/>';
					}else{
					  if( file_exists( 'images/upload-events/'.$nombre) ){
						echo '<br/>El archivo ya existe: ' . $nombre;
					  }else{
						@move_uploaded_file($nombre_tmp,
						  "images/upload-events/" . $nombre);
					  }
					}
				  }
				$mysqli = new mysqli("localhost","root","realflight","blog");
				if($mysqli === false){
					die("Error: No se pudo conectar a la base de datos");
				}
				$sql = "INSERT INTO eventos(retardo,imagen,icono,descripcion,latitud,longitud) VALUES ('$_POST[retardo]','$direccion','$direccion','$_POST[descripcion]','$_POST[latitud]','$_POST[longitud]')";
				if($result = $mysqli->query($sql)){
					echo 'Dato Insertado Correctamente';
				}else{
					
				}
				$mysqli->close();
			}
				
				
			
			?>
		  </div>
    </div>
    <footer>
      <p>Copyright &copy; Daniel Zarate | <a href="http://guayanaweb.ucab.edu.ve/">UCAB Guayana</a></p>
    </footer>
  </div>
  <p>&nbsp;</p>
  <!-- javascript at the bottom for fast page loading -->
  <script type="text/javascript" src="js/jquery.js"></script>
  <script type="text/javascript" src="js/jquery.easing-sooper.js"></script>
  <script type="text/javascript" src="js/jquery.sooperfish.js"></script>
  <script type="text/javascript">
    $(document).ready(function() {
      $('ul.sf-menu').sooperfish();
    });
  </script>
</body>
</html>