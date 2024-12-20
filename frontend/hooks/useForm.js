// useForm.js
import { useState, useCallback } from 'react';

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const onChange = useCallback((evt) => {
    const { id, value } = evt.target;
    setValues((prevValues) => ({ ...prevValues, [id]: value }));
  }, []);

  // console.log('useForm', values);
  return [ values, setValues, onChange ];
}
