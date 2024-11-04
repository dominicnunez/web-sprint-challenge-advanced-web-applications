import React from 'react'
import PT from 'prop-types'
import { useForm } from "../hooks/useForm";

const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm(props) {
  const [ values, onChange ] = useForm(initialFormValues)
  // ✨ where are my props? Destructure them here
  const { login } = props

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    const username = values.username.trim()
    const password = values.password.trim()
    login({username, password})
  }

  const isDisabled = () => {
    // ✨ implement
    // Trimmed username must be >= 3, and
    // trimmed password must be >= 8 for
    // the button to become enabled
    return (
      values.username.trim().length < 3 ||
      values.password.trim().length < 8
      ) ? true : false
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
