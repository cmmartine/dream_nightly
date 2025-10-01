import React from "react";
import { useState, useEffect } from "react";
import { postDeleteDream } from "../../api/dreamsApi";
import { addOutsideClickListener } from "../../util/elementUtils";

export const DreamDeletor = (props) => {
  const { dreamId, removeDreamFromPage, setShowSaveBtn, setError } = props;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const deleteConfirmContainer = document.getElementById('confirm-delete-container');
    let cleanupFunction;
    if(showConfirmDelete && deleteConfirmContainer) {
      cleanupFunction = addOutsideClickListener(deleteConfirmContainer, () => setShowConfirmDelete(false));
    };

    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, [showConfirmDelete]);

  function deleteDream() {
    postDeleteDream(dreamId, setError);
    removeDreamFromPage(dreamId);
  };

  return(
    <div>
      {
        !showConfirmDelete &&
          <button className='gen-btn' aria-label='Start dream deletion' onClick={(e) => {
            e.preventDefault();
            setShowConfirmDelete(true)
            setShowSaveBtn(false)
          }}>Delete</button>
      }
      {
        showConfirmDelete &&
        <div id='confirm-delete-container' className='confirm-delete-container'>
          <div>
            <button className='gen-btn confirm-delete-btn' aria-label='Cancel dream deletion' onClick={(e) => {
              e.preventDefault();
              setShowConfirmDelete(false)
              setShowSaveBtn(true)
            }}>Cancel</button>
            <button className='gen-btn confirm-delete-btn' aria-label='Confirm dream deletion' onClick={(e) => {
              e.preventDefault();
              deleteDream()
            }}>Delete</button>
          </div>
          <div className='dream-delete-confirm-msg'>Confirm dream deletion?</div>
        </div>
      }
    </div>
  );
};