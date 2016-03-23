<?php
/*
 * Valida un usuario y contraseña o presenta el formulario para hacer login
 */

if ($_SERVER['REQUEST_METHOD']=='POST') { // ¿Nos mandan datos por el formulario?
    include('php_lib/config.ini.php'); //incluimos configuración
    include('php_lib/login.class.php'); //incluimos las funciones
    $Login=new Login();
    //si hace falta cambiamos las propiedades tabla, campo_usuario, campo_contraseña, metodo_encriptacion

    //verificamos el usuario y contraseña mandados
    if ($Login->login($_POST['usuario'],$_POST['password'])) {

       //acciones a realizar cuando un usuario se identifica
       //EJ: almacenar en memoria sus datos completos, registrar un acceso en una tabla mysql
       //Estas acciones se veran en los siguientes tutorianes en http://www.emiliort.com

        //saltamos al inicio del área restringida
        header('Location: admin/index.php');
        die();
    } else {
        //acciones a realizar en un intento fallido
        //Ej: mostrar captcha para evitar ataques fuerza bruta, bloquear durante un rato esta ip, ....
        //Estas acciones se veran en los siguientes tutorianes en http://www.emiliort.com

        //preparamos un mensaje de error y continuamos para mostrar el formulario
        $mensaje='Usuario o contraseña incorrecto.';
    }
} //fin if post
?>

<!DOCTYPE HTML>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
        <script src="http://www.owurl7.com.ar/ejemplos/jquery/jquery-1.4.3.min.js" type="text/javascript"></script>
		<script src="js/scripts.js" type="text/javascript"></script>
		<meta name="viewport" content="width=device-width">
        <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
        <title>Bienvenidos</title>
        
        
    </head>
    <body>
    	<div id="cuerpo">
                <div id="mapa">
                	<a href="http://192.168.0.180:8080/Tesis/mapa/" id="mapa" class="boton">Mapa</a>
                </div>
                
                <div id="login">
                        <a href="#" id="loginbutton" class="boton">Administración</a>
                        <div id="caja">
                                <?php
                                    //si hay algún mensaje de error lo mostramos escapando los carácteres html
                                    if (!empty($mensaje)) echo('<h2>'.htmlspecialchars($mensaje).'</h2>');
                                ?>
                                <form action="index.php" enctype="multipart/form-data" method="post">
                                    <label>Usuario:
                                        <input name="usuario" type="text" />
                                    </label>
                                    <label>Contraseña:
                                        <input name="password" type="password" />
                                    </label>
                                    <input type="submit" value="Entrar" />
                                </form>
                        </div>
                </div>
        </div>    
    </body>
</html>

