import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DreamDeletor } from "../../components/DreamInput/DreamDeletor";
import * as dreamsApi from "../../api/dreamsApi";

describe('DreamDeletor', () => {
  const dreamId = 1;
  const removeDreamFromPage = jest.fn();
  const setShowSaveBtn = jest.fn();
  const setError = jest.fn();

  const renderDreamDeletor = () => {
    return render(
      <DreamDeletor
        dreamId={dreamId}
        removeDreamFromPage={removeDreamFromPage}
        setShowSaveBtn={setShowSaveBtn}
        setError={setError}/>
    )
  };

  beforeEach(async () => {
    jest.spyOn(dreamsApi, 'postDeleteDream').mockReturnValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows confirmation dialog when Delete is clicked', async () => {
    renderDreamDeletor();
    await userEvent.click(screen.getByRole('button', { name: 'Start dream deletion' }));
    expect(screen.getByText(/Confirm dream deletion/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel dream deletion' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm dream deletion' })).toBeInTheDocument();
  });

  it('cancels deletion when Cancel is clicked', async () => {
    renderDreamDeletor();
    await userEvent.click(screen.getByRole('button', { name: 'Start dream deletion' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel dream deletion' }));
    expect(screen.queryByText(/Confirm dream deletion/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start dream deletion' })).toBeInTheDocument();
  });

  it('calls removeDreamFromPage and postDeleteDream when confirmed', async () => {
    renderDreamDeletor();
    await userEvent.click(screen.getByRole('button', { name: 'Start dream deletion' }));
    const deleteButton = screen.getByRole('button', { name: 'Confirm dream deletion' });
    await userEvent.click(deleteButton);
    expect(dreamsApi.postDeleteDream).toHaveBeenCalledWith(1, setError);
    expect(removeDreamFromPage).toHaveBeenCalledWith(1);
  });
});