export default function validarCrearCuenta(valores){
  let errores = {};

  if(!valores.nombre){
    errores.nombre = "El nombre es obligatorio";
  }
  if(!valores.email){
    errores.email = "El correo es obligatorio";
  }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
    errores.email = "El correo no es válido";
  }
  if(!valores.password){
    errores.password = "La password es obligatoria";
  }else if(valores.password.length < 6){
    errores.password = "El password debe tener al menos 6 caracteres";
  }
  return errores;
}

