import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DreamInput from "../components/DreamInput";
import * as dreamsApi from "../api/dreamsApi";
import * as MAX_COUNTS from "../constants/shared/MAX_COUNTS.json";

describe('DreamInput', () => {
  const editDreamBody = 'Test Body';
  const calendarYear = '2025';
  const calendarMonth = '09'
  const calendarDay = '09';
  const hours = 10;
  const minutes = 10;
  const dateForPost = new Date(calendarYear, calendarMonth - 1, calendarDay, hours, minutes);
  const dateInMsForPost = dateForPost.getTime();
  const timezone = 'America/New_York';

  const convertDateTimeToMs = jest.fn();
  const setError = jest.fn();
  const removeDreamFromPage = jest.fn();

  function renderNewDreamInput(disableCreation) {
    return render(
      <DreamInput refetchDreams={jest.fn()} calendarYear={calendarYear} calendarMonth={calendarMonth} calendarDay={calendarDay} convertDateTimeToMs={convertDateTimeToMs} disableCreation={disableCreation} setError={setError}/>
    )
  };

  function renderEditingDreamInput() {
    return render(
      <DreamInput dreamBody={editDreamBody} dreamId={1} updateDreamBody={jest.fn()} calendarYear={calendarYear} calendarMonth={calendarMonth} calendarDay={calendarDay} convertDateTimeToMs={convertDateTimeToMs} removeDreamFromPage={removeDreamFromPage} setError={setError}/>
    )
  };

  const returnValue = { status: 'created' }

  beforeEach(() => {
    jest.spyOn(dreamsApi, 'postCreateDream').mockReturnValue(returnValue);
    jest.spyOn(dreamsApi, 'postUpdateDream').mockReturnValue('');
    convertDateTimeToMs.mockReturnValue(dateInMsForPost);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  })

  describe('When the props are for a new dream', () => {
    describe('And the save button is clicked when the textarea is NOT empty', () => {
      it('posts for dream creation', async () => {
        renderNewDreamInput();
        const textArea = document.getElementById('dream-input-textarea');
        const saveBtn = document.getElementById('save-dream-btn');
        await userEvent.type(textArea, 'Hello');
        await userEvent.click(saveBtn);
        expect(dreamsApi.postCreateDream).toHaveBeenCalledWith('Hello', dateInMsForPost, timezone, setError);
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

    describe('Dream deletion', () => {

      beforeEach(async () => {
        jest.spyOn(dreamsApi, 'postDeleteDream').mockReturnValue(null);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('shows confirmation dialog when Delete is clicked', async () => {
        renderEditingDreamInput();
        await userEvent.click(screen.getByRole('button', { name: /Delete/i }));
        expect(screen.getByText(/Confirm dream deletion/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
      });

      it('cancels deletion when Cancel is clicked', async () => {
        renderEditingDreamInput();
        await userEvent.click(screen.getByRole('button', { name: /Delete/i }));
        await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        expect(screen.queryByText(/Confirm dream deletion/i)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
      });

      it('calls removeDreamFromPage and postDeleteDream when confirmed', async () => {
        renderEditingDreamInput();
        await userEvent.click(screen.getByRole('button', { name: /Delete/i }));
        const deleteButton = screen.getByRole('button', { name: /Delete/i });
        await userEvent.click(deleteButton);
        expect(dreamsApi.postDeleteDream).toHaveBeenCalledWith(1, setError);
        expect(removeDreamFromPage).toHaveBeenCalledWith(1);
      });
    });

    describe('character counting', () => {
      it('subtracts the dreams body text from the initial count', () => {
        renderEditingDreamInput();
        const newCount = MAX_COUNTS.DREAM_CHARS - editDreamBody.length
        const charCountBox = screen.getByText(`${newCount} characters left`);
        expect(charCountBox).toBeInTheDocument();
      });
    });
  });

  describe('character counting', () => {
    it('Shows the starting number of characters left', () => {
      renderNewDreamInput();
      const charCountBox = screen.getByText(`${MAX_COUNTS.DREAM_CHARS} characters left`);
      expect(charCountBox).toBeInTheDocument();
    });

    it('subtracts from characters when input is typed in', async () => {
      renderNewDreamInput();
      const textArea = document.getElementById('dream-input-textarea');
      const word = "Four";
      await userEvent.type(textArea, word);
      const newCount = MAX_COUNTS.DREAM_CHARS - word.length
      const charCountBox = screen.getByText(`${newCount} characters left`);
      expect(charCountBox).toBeInTheDocument();
    });

    it('adds to characters when input is deleted', async () => {
      renderNewDreamInput();
      const textArea = document.getElementById('dream-input-textarea');
      const word = "Four";
      await userEvent.type(textArea, word);
      await userEvent.keyboard('{backspace}');
      const newCount = MAX_COUNTS.DREAM_CHARS - word.length + 1;
      const charCountBox = screen.getByText(`${newCount} characters left`);
      expect(charCountBox).toBeInTheDocument();
    });
  });

  describe('when the dream limit per day has been reached', () => {
    it('shows only a message that dream limit per day has been reached', () => {
      renderNewDreamInput(true);

      expect(screen.getByText(`Only ${MAX_COUNTS.DREAMS_IN_A_DAY} dreams can be created per day`)).toBeInTheDocument();
    });
  });
});