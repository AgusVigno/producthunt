import React, {useEffect, useState, useContext} from 'react';
import {useRouter} from 'next/router';
import {FirebaseContext} from '../../firebase';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {es} from 'date-fns/locale';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';


const ContenedorProducto = styled.div`
  @media (min-width: 768px){
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
`;

const CreadorProducto = styled.p`
  padding: 1.5rem;
  background-color: var(--naranja);
  font-weight: bold;
  color: #fff;
  text-align: center;
  text-transform:uppercase;
  display: inline-block;
`;

const Producto = () => {
  const router = useRouter();
  const { query: {id} } = router;
  const { firebase, usuario } = useContext(FirebaseContext);
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarBD, setConsultarDB] = useState(true);
  
  useEffect(() => {
    if(id && consultarBD){
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection('productos').doc(id);
        const producto = await productoQuery.get();
        producto.exists ? setProducto(producto.data()) : setError(true);
        setConsultarDB(false);
      }
      obtenerProducto();
    }
  }, [id]);

  if(Object.keys(producto).length === 0 && !error) return 'Cargando...';
  
  const {nombre, empresa, creado, url, urlImagen, descripcion, votos, comentarios, creador, haVotado} = producto;

  const agregarVoto = () => {
    if(!usuario) return router.push('/login');

    const nuevoVotos = votos + 1;

    if(haVotado.includes(usuario.uid)) return

    const nuevoHaVotado = [ ...haVotado, usuario.uid ];

    firebase.db.collection('productos').doc(id).update({
      votos: nuevoVotos,
      haVotado: nuevoHaVotado
    });

    setProducto({...producto, votos: nuevoVotos});
    setConsultarDB(false);
  }

  const comentarioChange = e => {
    setComentario({
      ...comentario,
      [e.target.name] : e.target.value
    })
  }

  const agregarComentario = e => {
    e.preventDefault();

    if(!usuario) return router.push('/login');
    if(!comentario.mensaje) return

    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    const nuevosComentarios = [...comentarios, comentario];

    firebase.db.collection('productos').doc(id).update({
      comentarios: nuevosComentarios
    });
    setProducto({
      ...producto,
      comentarios: nuevosComentarios
    });
    setConsultarDB(true);
  }

  const esCreador = id => {
    return creador.id == id;
  }

  const eliminarProducto = () => {
    if(!usuario) return router.push('/login');
    if(usuario.uid != creador.id) return router.push('/');

    try {
      firebase.db.collection('productos').doc(id).delete();
      router.push('/');
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  return ( 
    <Layout>
      <>
        {error ? 
          <Error404 msg="No existe el producto"/>
        : (
        <div className="contenedor">
          <h1 css={css`
            margin-top: 5rem;
            text-align: center;
          `}
          >{nombre}</h1>
          <ContenedorProducto>
            <div>
              <p>Publicado hace: { formatDistanceToNow(new Date(creado), {locale: es}) }</p>
              <p>Por: {creador.nombre} de {empresa}</p>

              <img src={urlImagen} />
              <p>{descripcion}</p>

              {usuario && (
                <>
                <h2>Agrega tu comentario</h2>
                <form
                  onSubmit={agregarComentario}
                >
                  <Campo>
                    <input 
                      type="text"
                      name="mensaje"
                      onChange={comentarioChange}
                    />
                  </Campo>
                  <InputSubmit
                    type="submit"
                    value="Agregar Comentario"
                  />
                </form>
                </>
              )}

              <h2 css={css`
                margin: 2rem;
              `}
              >Comentarios</h2>
              {comentarios.length === 0 ? 
                  "Aun no hay comentarios"
                : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>Escrito por: 
                          <span css={css`
                            font-weight: bold;
                          `}>
                            {' '} {comentario.usuarioNombre}
                          </span>
                        </p>
                        { esCreador(comentario.usuarioId) &&
                          <CreadorProducto>
                            Es Creador
                          </CreadorProducto>
                        }
                      </li>
                    ))}
                  </ul>
                )
              }
            </div>
            <aside>
              <Boton
                target="_blank"
                bgColor="true"
                href={url}
              >Visitar URL</Boton>
              <div css={css`
                margin-top: 5rem;
              `}>
                <p css={css`
                  text-align: center;
                `}>{votos} Votos</p>
                {usuario && (
                  <Boton
                    onClick={agregarVoto}
                  >
                    Votar
                  </Boton>
                )}
              </div>
            </aside>
          </ContenedorProducto>
          {usuario && esCreador(usuario.uid) && (
            <Boton
              onClick={eliminarProducto}
            >
              Eliminar Producto
            </Boton>
          )}
        </div>
        )}
      </>
    </Layout>
  );
}
 
export default Producto;