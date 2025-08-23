import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DreamInput from "../components/DreamInput";
import * as dreamsApi from "../api/dreamsApi";

describe('DreamInput', () => {
  const editDreamBody = 'Test Body';

  function renderNewDreamInput() {
    return render(
      <DreamInput refetchDreams={jest.fn()} setError={jest.fn()}/>
    )
  };

  function renderEditingDreamInput() {
    return render(
      <DreamInput dreamBody={editDreamBody} dreamId={1} updateDreamBody={jest.fn()} setError={jest.fn()}/>
    )
  };

  const returnValue = { status: 'created' }

  beforeEach(async () => {
    jest.spyOn(dreamsApi, 'postCreateDream').mockReturnValue(returnValue);
    jest.spyOn(dreamsApi, 'postUpdateDream');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  describe('When the props are for a new dream', () => {
    describe('And the save button is clicked when the textarea is NOT empty', () => {
      it('calls postCreateDream', async () => {
        renderNewDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.type(textArea, 'Hello');
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).toBeCalled();
        expect(dreamsApi.postUpdateDream).not.toBeCalled();
      });

      it('resets the textarea', async () => {
        renderNewDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.type(textArea, 'Hello');
        await userEvent.click(saveBtn);
        expect(textArea.value).toBe('');
      });
    });

    describe('And the save button is clicked when the textarea IS empty', () => {
      it('DOES NOT call postCreateDream', async () => {
        renderNewDreamInput();
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).not.toBeCalled();
        expect(dreamsApi.postUpdateDream).not.toBeCalled();
      });
    });
  });

  describe('When the props are for editing a dream', () => {
    describe('And the save button is clicked when the textarea is NOT empty', () => {
      it('calls postUpdateDream', async () => {
        renderEditingDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.type(textArea, 'Hello');
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).not.toBeCalled();
        expect(dreamsApi.postUpdateDream).toBeCalled();
      });

      it('does not reset the textArea', async () => {
        renderEditingDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.type(textArea, ' added text');
        await userEvent.click(saveBtn);
        expect(textArea.value).toBe(editDreamBody + ' added text');
      });
    });

    describe('And the save button is clicked when the textarea IS empty', () => {
      it('DOES NOT call postUpdateDream', async () => {
        renderEditingDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.clear(textArea);
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).not.toBeCalled();
        expect(dreamsApi.postUpdateDream).not.toBeCalled();
      });
    });
  });
});