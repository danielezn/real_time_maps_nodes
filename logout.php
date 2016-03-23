<?php
/* 
 * Cierra la sesión como usuario validado
 */

include('php_lib/login.class.php'); //incluimos las funciones
Login::logout(); //vacia la session del usuario actual
header('Location: index.php'); //saltamos a login.php

?>
