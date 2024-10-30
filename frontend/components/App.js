import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    redirectToLogin()
  }

  const isLoading = () => {
    setMessage('')
    setSpinnerOn(true)
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    isLoading()
    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        } else {
          throw new Error('Login failed')
        }
      })
      .then(data => {
        localStorage.setItem('token', data.token)
        setMessage(data.message)
        redirectToArticles()
      })
      .catch(err => {
        throw new Error(err.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    isLoading()
    fetch(articlesUrl, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        } else if (res.status === 401) {
          localStorage.removeItem('token')
          redirectToLogin()
        } else {
          throw new Error('Failed to fetch articles')
        }
      })
      .then(data => {
        setArticles(data)
        setMessage(data.message)
      })
      .catch(err => {
        throw new Error(err.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    fetch(articlesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(article)
    })
      .then(res => {
        if (res.status === 201) {
          return res.json()
        } else if (res.status === 401) {
          localStorage.removeItem('token')
          redirectToLogin()
        } else {
          throw new Error('Failed to post article')
        }
      })
      .then(data => {
        setArticles([...articles, data])
        setMessage(data.message)
      })
      .catch(err => {
        throw new Error(err.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const articleURL = (article_id) => {
    return `${articlesUrl}/${article_id}`
  }

  const updateArticle = ({ article_id, article }) => {
    const updateURL = articleURL(article_id)
    // ✨ implement
    // You got this!
    fetch(updateURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(article)
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        } else if (res.status === 401) {
          localStorage.removeItem('token')
          redirectToLogin()
        } else {
          throw new Error('Failed to update article')
        }
      })
      .then(data => {
        const updatedArticles = articles.map(a => {
          if (a.article_id === article_id) {
            return data
          }
          return a
        })
        setArticles(updatedArticles)
        setMessage(data.message)
      })
      .catch(err => {
        throw new Error(err.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    const deleteURL = articleURL(article_id)
    fetch(deleteURL, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        } else if (res.status === 401) {
          localStorage.removeItem('token')
          redirectToLogin()
        } else {
          throw new Error('Failed to delete article')
        }
      })
      .then(data => {
        const updatedArticles = articles.filter(a => a.article_id !== article_id)
        setArticles(updatedArticles)
        setMessage(data.message)
      })
      .catch(err => {
        throw new Error(err.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner />
      <Message />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="articles" element={
            <>
              <ArticleForm />
              <Articles />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
