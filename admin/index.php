<?php
require('../php_lib/include-pagina-restringida.php'); //vericar que estoy logeado. Si falla salta a la página de login.php
?>
<!DOCTYPE HTML>
<html>

<head>
  <title>photo_style_two</title>
  <meta name="description" content="website description" />
  <meta name="keywords" content="website keywords, website keywords" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <link rel="stylesheet" type="text/css" href="css/style.css" />
  <!-- modernizr enables HTML5 elements and feature detects -->
  <script type="text/javascript" src="js/modernizr-1.5.min.js"></script>
</head>

<body>
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
		  <div id="content">
			<h1>Welcome to photo_style_two</h1>
			<p>This standards compliant, fixed width website template is releaseggggggggggggggggggggg g gggggggggggggggggggggggggggggggggggggggggggggggggg ggggggggggggg gggggggggggggggggg ggggggggggg  jjjjj kkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkk kkkkkkkkkk kkkkkkkkkkkkk kkkkkkkkkkkkk kkkkkkkkkkkkk kkkkkkkkkkkkk kkkkkkkkkkkkkk kkkkkkkkkkkkk kkkkkkkkkkkkkkkkkkkkkkkkk kkkkkkkkkkkkkkggggggggggggggggg ggggggggggggggggg gggggggg ggggggggg ggggggggggggggggd as an 'open source' design (under a <a href="http://creativecommons.org/licenses/by/3.0">Creative Commons Attribution 3.0 Licence</a>), which means that you are free to use it for anything you want (including modifying and amending it). All I ask is that you leave the 'design from css3templates.co.uk' link in the footer of the template. All of the photos were taken by me - use as you wish.</p>
			<h3>Browser Compatibility</h3>
			<p>This template has been tested in the following browsers:</p>
			<ul>
			  <li>Internet Explorer 8</li>
			  <li>Internet Explorer 7</li>
			  <li>FireFox 10</li>
			  <li>Google Chrome 17</li>
			</ul>
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
  <script type="text/javascript" src="js/image_fade.js"></script>
  <script type="text/javascript">
    $(document).ready(function() {
      $('ul.sf-menu').sooperfish();
    });
  </script>
</body>
</html>
