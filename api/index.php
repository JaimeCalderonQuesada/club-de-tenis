<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Conecta a la base de datos  con usuario, contraseña y nombre de la BD
$servidor = "localhost"; $usuario = "root"; $contrasenia = ""; $nombreBaseDatos = "club";
$conexionBD = new mysqli($servidor, $usuario, $contrasenia, $nombreBaseDatos);

// Comprueba datos de usuario para hacer login
if(isset($_GET["login"])){
    $pas = sha1($_GET["contrasenia"]);
    $sql="SELECT * FROM usuarios WHERE email='".$_GET["login"]."'AND password='".$pas."'";
    if(mysqli_query($conexionBD,$sql)){
        $sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM usuarios WHERE email='".$_GET["login"]."'AND password='".$pas."'");
        if(mysqli_num_rows($sqlEmpleaados) > 0){
            $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
            echo json_encode($empleaados);
            exit();
        } else {echo json_encode(["success"=>0]);}
    }else{  echo json_encode("".mysqli_error($sql).",".mysqli_connect_error($conexionBD)); }
}

// Inserta un nuevo usuario
if(isset($_GET["insertar"])){
    $data = json_decode(file_get_contents("php://input"));
    $nombre=$data->name;
    $correo=$data->email;
    $contrasenia=$data->password;
    $pas = sha1($contrasenia);
    $sexo = $data->sexo;
    $movil = $data->movil;
    $dni = $data->dni;
    $fecha = $data->fecha;
    $tipo = $data->tipo;
    if(($correo!="")&&($nombre!="")){
        try{
            $sqlEmpleaados = mysqli_query($conexionBD,"INSERT INTO usuarios(name,password,sexo,movil,dni,fecha,email,tipo) VALUES('$nombre','$pas','$sexo','$movil','$dni','$fecha','$correo',$tipo) ");

        }catch(mysqli_sql_exception $e){
            echo json_encode($e->getCode());
            exit();
        }
    }
}

// Consulta los usuarios
if (isset($_GET["usuariosVer"])){
  $sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM usuarios");
  if(mysqli_num_rows($sqlEmpleaados) > 0){
      $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
      echo json_encode($empleaados);
      exit();
  }
  else{  echo json_encode(["success"=>0]); }
}

// Inserta un nuevo formulario de contacto
if(isset($_GET["contactos"])){
  $data = json_decode(file_get_contents("php://input"));
  $name=$data->name;
  $mensaje=$data->mensaje;
  $email=$data->email;
      if(($name!="")&&($mensaje!="")){

  $sqlEmpleaados = mysqli_query($conexionBD,"INSERT INTO contactos(name,email,mensaje) VALUES('$name','$email','$mensaje') ");
  echo json_encode(["success"=>1]);
      }
  exit();
}

// Consulta formularios de contactos
if (isset($_GET["contactosVer"])){
  $sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM contactos");
  if(mysqli_num_rows($sqlEmpleaados) > 0){
      $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
      echo json_encode($empleaados);
      exit();
  }
  else{  echo json_encode(["success"=>0]); }
}

// Borrar pero se le debe de enviar una clave ( para borrado )
if (isset($_GET["borrarContacto"])){
  $sqlEmpleaados = mysqli_query($conexionBD,"DELETE FROM contactos WHERE id=".$_GET["borrarContacto"]);
  if($sqlEmpleaados){
      echo json_encode(["success"=>1]);
      exit();
  }
  else{  echo json_encode(["success"=>0]); }
}

//Inserta un nuevo torneo
if(isset($_GET["torneo"])){
    $data = json_decode(file_get_contents("php://input"));
    $nombre=$data->name;
    $localidad=$data->localidad;
        if($nombre!=""){

        $sqlEmpleaados = mysqli_query($conexionBD,"INSERT INTO torneos(nombre,localidad) VALUES('$nombre','$localidad') ");
        if(mysqli_error($conexionBD)){

            echo json_encode(["success"=>0]);
        }else{
            echo json_encode(["success"=>1]);
            exit();
        }
        }
}

// Consulta torneos
if (isset($_GET["torneos"])){
    $sql="SELECT * FROM torneos";
    if(mysqli_query($conexionBD,$sql)){
    $sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM torneos");
    if(mysqli_num_rows($sqlEmpleaados) > 0){
        $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
        echo json_encode($empleaados);
        exit();
    }
    else{  echo json_encode(["success"=>0]); }
    }else{  echo json_encode("".mysqli_error($sql).",".mysqli_connect_error($conexionBD)); }
}

// Borrar torneos
if (isset($_GET["borrarTorneo"])){
    $sqlEmpleaados = mysqli_query($conexionBD,"DELETE FROM torneos WHERE id=".$_GET["borrarTorneo"]);
    if($sqlEmpleaados){
        echo json_encode(["success"=>1]);
        exit();
    }
    else{  echo json_encode(["success"=>0]); }
}

//Insertar una nueva inscripcion a torneo
if(isset($_GET["inscribir"])){
    $data = json_decode(file_get_contents("php://input"));
    $torneo_id=$data->torneo_id;
    $usuario_id=$data->usuario_id;
        if($torneo_id){

        $sqlEmpleaados = mysqli_query($conexionBD,"INSERT INTO inscribir(torneo_id,usuario_id) VALUES($torneo_id,$usuario_id) ");
        if(mysqli_error($conexionBD)){

            echo json_encode(["success"=>0]);
        }else{
            echo json_encode(["success"=>1]);
            exit();
        }
        }
}

// Consulta inscripciones a torneos
if (isset($_GET["inscripciones"])){
    $sql="SELECT * FROM inscribir";
    if(mysqli_query($conexionBD,$sql)){
    $sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM inscribir");
    if(mysqli_num_rows($sqlEmpleaados) > 0){
        $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
        echo json_encode($empleaados);
        exit();
    }
    else{  echo json_encode(["success"=>0]); }
    }else{  echo json_encode("".mysqli_error($sql).",".mysqli_connect_error($conexionBD)); }
}

// // Actualizar valoracion
// if(isset($_GET["actualizarValoracion"])){

//     $data = json_decode(file_get_contents("php://input"));
//     $contenido=$data->contenido;

//     $sqlEmpleaados = mysqli_query($conexionBD,"UPDATE valoraciones SET contenido=".$contenido." WHERE id=".$_GET["actualizarValoracion"]);
//     echo json_encode(["success"=>1]);
//     exit();
// }


// Inserta una pista
if(isset($_GET["pista"])){
    $data = json_decode(file_get_contents("php://input"));
    $name=$data->name;
    $descripcion=$data->descripcion;
        if($name!=""){

    $sqlEmpleaados = mysqli_query($conexionBD,"INSERT INTO pistas(name,descripcion) VALUES('$name','$descripcion') ");
    echo json_encode(["success"=>1]);
        }
    exit();
}

// Consultar pistas
if (isset($_GET["pistas"])){
  $sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM pistas");
  if(mysqli_num_rows($sqlEmpleaados) > 0){
      $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
      echo json_encode($empleaados);
      exit();
  }
  else{  echo json_encode(["success"=>0]); }
}

// Borrar pista
if (isset($_GET["borrarPista"])){
    $sqlEmpleaados = mysqli_query($conexionBD,"DELETE FROM pistas WHERE id=".$_GET["borrarPista"]);
    if($sqlEmpleaados){
        echo json_encode(["success"=>1]);
        exit();
    }
    else{  echo json_encode(["success"=>0]); }
}

//Insertar una nueva reserva
if(isset($_GET["reserva"])){
  $data = json_decode(file_get_contents("php://input"));
  $fecha=$data->fecha;
  $pistaid=$data->pistaid;
  $usuarioid=$data->usuarioid;
      if($fecha!=""){

      $sqlEmpleaados = mysqli_query($conexionBD,"INSERT INTO reservas(fecha,pista_id,usuario_id) VALUES('$fecha',$pistaid,$usuarioid) ");
      if(mysqli_error($conexionBD)){

          echo json_encode(["success"=>0]);
      }else{
          echo json_encode(["success"=>1]);
          exit();
      }
      }
}

// Consultar reservas
if (isset($_GET["reservas"])){
  $sql="SELECT * FROM reservas";
  if(mysqli_query($conexionBD,$sql)){
  $sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM reservas");
  if(mysqli_num_rows($sqlEmpleaados) > 0){
      $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
      echo json_encode($empleaados);
      exit();
  }
  else{  echo json_encode(["success"=>0]); }
  }else{  echo json_encode("".mysqli_error($sql).",".mysqli_connect_error($conexionBD)); }
}

// // Consulta todos los posts de un usuario concreto
// if (isset($_GET["tusPosts"])){
//     $sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM posts WHERE usuario_id = ".$_GET["tusPosts"]);
//     if(mysqli_num_rows($sqlEmpleaados) > 0){
//         $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
//         echo json_encode($empleaados);
//         exit();
//     }
//     else{  echo json_encode(["success"=>0]); }
// }






// Consulta todos los registros de la tabla empleados
$sqlEmpleaados = mysqli_query($conexionBD,"SELECT * FROM usuarios");
if(mysqli_num_rows($sqlEmpleaados) > 0){
    $empleaados = mysqli_fetch_all($sqlEmpleaados,MYSQLI_ASSOC);
    echo json_encode($empleaados);
}
else{ echo json_encode([["success"=>0]]); }


?>
