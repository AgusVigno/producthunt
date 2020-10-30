import React, {useState} from 'react';
import Router from 'next/router';
import {css} from '@emotion/core';
import Layout from '../components/layout/Layout';
import firebase from '../firebase';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import useValidation from '../hooks/useValidation';
import validarIniciarSesion from '../validation/validarIniciarSesion';

const STATE_INITIAL = {
  password: '',
  email: ''
}

const Login = () => {

  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidation(STATE_INITIAL, validarIniciarSesion, iniciarSesion);
  const {email, password} = valores;
  const [error, setError] = useState(false);

  async function iniciarSesion(){
    try {
      await firebase.login(email, password);
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
          >Iniciar Sesión</h1>
          <Formulario
            onSubmit={handleSubmit}
          >           
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
              value="Iniciar Sesión"
            />
          </Formulario>
        </>
      </Layout>
    </div>
   );
}
 
export default Login;