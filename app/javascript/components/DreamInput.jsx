import React from "react";
import { useState } from "react";
import { postCreateDream, postUpdateDream } from "../api/dreamsApi";

export default function DreamInput(props) {
  const { dreamBody, dreamId, updateDreamBody, refetchDreams, setError } = props;
  const [formText, setFormText] = useState(checkDreamBody());

  function checkDreamBody() {
    return dreamBody ? dreamBody : '';
  };

  function saveDream() {
    if (dreamBody) {
      updateDreamBody(formText);
      postUpdateDream(dreamId, formText, setError);
    } else {
      postCreateDream(formText, setError);
      refetchDreams();
    }
  };

  return(
    <form id='dream-input-form'>
      <textarea id='dream-input-textarea' aria-label='enter-dream' spellCheck='true' value={formText} onChange={(e) => {
        setFormText(e.target.value);
      }}/>
      <button id='save-dream-btn' type='submit' onClick={(e) => {
        e.preventDefault();
        if (formText != '') {
          saveDream();
        }
      }}>Save</button>
    </form>
  )
}