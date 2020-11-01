import React, {useState, useContext} from 'react';
import Router, {useRouter} from 'next/router';
import {css} from '@emotion/core';
import {FirebaseContext} from '../firebase';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import FileUploader from 'react-firebase-file-uploader';
import useValidation from '../hooks/useValidation';
import validarCrearProducto from '../validation/validarCrearProducto';
import Error404 from '../components/layout/404';

const STATE_INITIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidation(STATE_INITIAL, validarCrearProducto, crearProducto);
  const {nombre, empresa, imagen, url, descripcion} = valores;
  const {usuario, firebase} = useContext(FirebaseContext);
  const [error, setError] = useState(false);
  const router = useRouter();

  const [nombreImagen, setNombreImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImagen, setUrlImagen] = useState('');

  function crearProducto(){
    if(!usuario){
      return router.push('/login');
    }

    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }

    firebase.db.collection('productos').add(producto);

    return router.push('/');
  }

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  }

  const handleProgress = (progreso) => {
    setProgreso(progreso);
  }

  const handleUploadError = (error) => {
    setSubiendo(error);
    console.log(error);
  }

  const handleUploadSuccess = (nombre) => {
    setProgreso(100);
    setSubiendo(false);
    setNombreImagen(nombre);
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url => setUrlImagen(url));
  }
  
  return ( 
    <div>
      <Layout>
        {!usuario ? 
          <Error404 msg="No esta autorizado para ver esta página" /> 
        : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo Producto</h1>
            <Formulario
              onSubmit={handleSubmit}
            >
              <fieldset>
                <legend>Información general</legend>
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Nombre del producto"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.nombre && <Error>{errores.nombre}</Error>}
                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Nombre de la empresa"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}
                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>
                {errores.imagen && <Error>{errores.imagen}</Error>}
                <Campo>
                  <label htmlFor="url">Url</label>
                  <input
                    type="url"
                    id="url"
                    placeholder="Url del producto"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>
              <fieldset>
                <legend>Sobre tu Producto</legend>
                <Campo>
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>
              
              {error && <Error>{error}</Error>}

              <InputSubmit
                type="submit"
                value="Crear Producto"
              />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
   );
}
 
export default NuevoProducto;