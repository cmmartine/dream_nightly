import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DreamInput from "../components/DreamInput";
import * as dreamsApi from "../api/dreamsApi";

describe('DreamInput', () => {
  const editDreamBody = 'Test Body';
  const calendarYear = '2025';
  const calendarMonth = '10'
  const calendarDay = '10';
  const hours = 10;
  const minutes = 10;
  const dateForPost = new Date(calendarYear, calendarMonth - 1, calendarDay, hours, minutes);
  const dateInMsForPost = dateForPost.getTime();

  const convertDateTimeToMs = jest.fn();
  const setError = jest.fn();

  function renderNewDreamInput() {
    return render(
      <DreamInput refetchDreams={jest.fn()} calendarYear={calendarYear} calendarMonth={calendarMonth} calendarDay={calendarDay} convertDateTimeToMs={convertDateTimeToMs} setError={setError}/>
    )
  };

  function renderEditingDreamInput() {
    return render(
      <DreamInput dreamBody={editDreamBody} dreamId={1} updateDreamBody={jest.fn()} calendarYear={calendarYear} calendarMonth={calendarMonth} calendarDay={calendarDay} convertDateTimeToMs={convertDateTimeToMs} setError={setError}/>
    )
  };

  const returnValue = { status: 'created' }

  beforeEach(async () => {
    jest.spyOn(dreamsApi, 'postCreateDream').mockReturnValue(returnValue);
    jest.spyOn(dreamsApi, 'postUpdateDream');
    convertDateTimeToMs.mockReturnValue(dateInMsForPost);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  describe('When the props are for a new dream', () => {
    describe('And the save button is clicked when the textarea is NOT empty', () => {
      it('posts for dream creation', async () => {
        renderNewDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.type(textArea, 'Hello');
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).toHaveBeenCalledWith('Hello', dateInMsForPost, setError);
        expect(dreamsApi.postUpdateDream).not.toHaveBeenCalled();
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
      it('DOES NOT post for dream creation', async () => {
        renderNewDreamInput();
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).not.toHaveBeenCalled();
        expect(dreamsApi.postUpdateDream).not.toHaveBeenCalled();
      });
    });

    it('renders the time input with the current time', async () => {
      jest.useFakeTimers().setSystemTime(dateForPost);
      renderNewDreamInput();
      const timeInput = await screen.queryByLabelText('Dream time selector');
      expect(timeInput).toBeInTheDocument();
      expect(timeInput.value).toEqual(`${hours}:${minutes}`)
      jest.useRealTimers();
    });
  });

  describe('When the props are for editing a dream', () => {
    describe('And the save button is clicked when the textarea is NOT empty', () => {
      it('posts for dream updating', async () => {
        renderEditingDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.type(textArea, 'Hello');
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).not.toHaveBeenCalled();
        expect(dreamsApi.postUpdateDream).toHaveBeenCalled();
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
      it('DOES NOT post for dream updating', async () => {
        renderEditingDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.clear(textArea);
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).not.toHaveBeenCalled();
        expect(dreamsApi.postUpdateDream).not.toHaveBeenCalled();
      });
    });

    it('does not render the time input', async () => {
      renderEditingDreamInput();
      const timeInput = await screen.queryByLabelText('Dream time selector');
      expect(timeInput).not.toBeInTheDocument();
    });
  });
});