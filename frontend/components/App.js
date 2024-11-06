import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";

const ARTICLES_URL = "http://localhost:9000/api/articles";
const LOGIN_URL = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    redirectToLogin();
    localStorage.removeItem("token");
    setMessage("Goodbye!");
  };

  const startLoading = () => {
    setMessage("");
    setSpinnerOn(true);
  };

  const doFetch = ({
    url,
    method = "GET",
    headers = {},
    body = null,
    onSuccess,
    onError,
  }) => {
    startLoading();
    return fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res.json();
        } else if (res.status === 401) {
          localStorage.removeItem("token");
          redirectToLogin();
          throw new Error("Unauthorized access");
        } else {
          throw new Error("Operation failed");
        }
      })
      .then((data) => {
        setMessage(data.message || "");
        if (onSuccess) onSuccess(data);
      })
      .catch((err) => {
        if (onError) onError(err);
        console.log(err);
        setMessage(err.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const returnAuthHeaders = (integer) => {
    const contentType = { "Content-Type": "application/json" };
    const authToken = {
      Authorization: `${localStorage.getItem("token")}`,
    };
    const contentTypeAuthToken = { ...contentType, ...authToken };

    if (integer == 1) {
      return contentType;
    } else if (integer == 2) {
      return authToken;
    }

    return contentTypeAuthToken;
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    doFetch({
      url: LOGIN_URL,
      method: 'POST',
      headers: returnAuthHeaders(1),
      body: { username, password },
      onSuccess: data => {
        localStorage.setItem('token', data.token);
        setMessage(data.message);
        redirectToArticles();
      },
    });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    doFetch({
      url: ARTICLES_URL,
      headers: returnAuthHeaders(2),
      onSuccess: data => {
        setArticles(data.articles);
        setMessage(data.message);
      }
    });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    doFetch({
      url: ARTICLES_URL,
      method: 'POST',
      headers: returnAuthHeaders(),
      body: article,
      onSuccess: data => {
        setArticles(prevArticles => [...prevArticles, article]);
        setCurrentArticleId(null);
        setMessage(data.message);
      }
    });
  };

  const setArticleURL = (article_id) => {
    return `${ARTICLES_URL}/${article_id}`;
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    doFetch({
      url: setArticleURL(article_id),
      method: 'PUT',
      headers: returnAuthHeaders(),
      body: article,
      onSuccess: data => {
        const updatedArticles = articles.map(a =>
          a.article_id === article_id ? data.article : a
        );
        setArticles(updatedArticles);
        setCurrentArticleId(null);
        setMessage(data.message);
      }
    });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setCurrentArticleId(article_id);
    doFetch({
      url: setArticleURL(currentArticleId),
      method: 'DELETE',
      headers: returnAuthHeaders(2),
      onSuccess: data => {
        const updatedArticles = articles.filter(a => a.article_id !== article_id);
        setArticles(updatedArticles);
        setCurrentArticleId(null);
        setMessage(data.message);
      }
    });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message}/>
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm articles={articles} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} postArticle={postArticle} updateArticle={updateArticle} />
                <Articles currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  );
}
