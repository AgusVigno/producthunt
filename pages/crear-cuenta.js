import React, {useState} from 'react';
import Router from 'next/router';
import {css} from '@emotion/core';
import Layout from '../components/layout/Layout';
import firebase from '../firebase';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import useValidation from '../hooks/useValidation';
import validarCrearCuenta from '../validation/validarCrearCuenta';

const STATE_INITIAL = {
  nombre: '',
  password: '',
  email: ''
}

const CrearCuenta = () => {

  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidation(STATE_INITIAL, validarCrearCuenta, crearCuenta);
  const {nombre, email, password} = valores;
  const [error, setError] = useState(false);

  async function crearCuenta(){
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      setError(error.message);
    }
  }

  return ( 
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Crear Cuenta</h1>
          <Formulario
            onSubmit={handleSubmit}
          >
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Tu Nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}
            
            <Campo>
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                placeholder="Tu Correo"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            
            <Campo>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Tu Password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}

            <InputSubmit
              type="submit"
              value="Crear Cuenta"
            />
          </Formulario>
        </>
      </Layout>
    </div>
   );
}
 
export default CrearCuenta;