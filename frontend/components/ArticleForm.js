import React, { useEffect } from "react";
import PT from "prop-types";
import { useForm } from "../hooks/useForm";

const initialFormValues = { title: "", text: "", topic: "" };

export default function ArticleForm(props) {
  const [ values, setValues, onChange ] = useForm(initialFormValues);
  // ✨ where are my props? Destructure them here
  const { articles, postArticle, updateArticle, currentArticleId } = props;

  useEffect(() => {
    // ✨ implement
    // Every time the `currentArticleId` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    if (currentArticleId) {
      // find article by article id and set values
      const currentArticle = articles.find(article => article.article_id === currentArticleId);
      setValues({
        title: currentArticle.title,
        text: currentArticle.text,
        topic: currentArticle.topic
      });
    } else {
      setValues(initialFormValues);
    }
  }, [currentArticleId, setValues]);
  
  const onSubmit = (evt) => {
    evt.preventDefault();
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    // If it's truthy, we should call `updateArticle` with the `currentArticle.article_id`
    // and the form values as arguments.
    // If it's not, we should call `postArticle` with the form values as an argument.
    if (currentArticleId) {
      updateArticle(currentArticleId, values);
    } else {
      postArticle(values);
    }
    // Finally, we should reset the form values and the `currentArticle` prop.
    setValues(initialFormValues);
  };

  const isDisabled = () => {
    // ✨ implement
    // The submit button should be disabled if the title, text, or topic are empty.
    // Otherwise, it should be enabled.
    return !values.title || !values.text || !values.topic;
  };

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        {!currentArticleId && <button disabled={isDisabled()} id="submitArticle">
          Submit
        </button>}
        {currentArticleId && <button onClick={Function.prototype}>Cancel edit</button>}
      </div>
    </form>
  );
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  // setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({
    // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  }),
};
