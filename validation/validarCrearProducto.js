export default function validarCrearProducto(valores){
  let errores = {};

  if(!valores.nombre){
    errores.nombre = "El nombre es obligatorio";
  }
  if(!valores.empresa){
    errores.empresa = "Nombre de la empresa es obligatorio";
  }
  if(!valores.url){
    errores.url = "La url es obligatoria";
  }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
    errores.url = "Url no válida";
  }
  if(!valores.descripcion){
    errores.descripcion = "La descripcion es obligatoria";
  }
  
  return errores;
}

