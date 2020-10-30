import React, {useState, useEffect} from 'react';

const useValidation = (stateInitial, validate, fn) => {

  const [valores, setValores] = useState(stateInitial);
  const [errores, setErrores] = useState({});
  const [submitForm, setSubmitForm] = useState(false);

  useEffect(() => {
    if(submitForm){
      const noErrores = Object.keys(errores).length === 0;
      if(noErrores){
        fn();
      }
      setSubmitForm(false);
    }
  }, [errores]);

  const handleChange = e => {
    setValores({
      ...valores,
      [e.target.name] : e.target.value
    });
  }

  const handleBlur = e => {
    const erroresValidacion = validate(valores);
    setErrores(erroresValidacion);
  }

  const handleSubmit = e => {
    e.preventDefault();
    const erroresValidacion = validate(valores);
    setErrores(erroresValidacion);
    setSubmitForm(true);
  }

  return {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  }
}
 
export default useValidation;