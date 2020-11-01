import React from 'react';
import {css} from '@emotion/core';

const Error404 = (props) => {
  return ( 
    <h1
      css={css`
        margin-top: 5rem;
        text-align: center;
      `}
    >{props.msg}</h1>
   );
}
 
export default Error404;