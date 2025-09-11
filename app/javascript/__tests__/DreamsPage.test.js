import { render, screen } from "@testing-library/react";
import DreamsPage from "../components/DreamsPage";
import * as dreamsApi from "../api/dreamsApi";

jest.mock('../components/DreamInput', () => () => {
  const MockDreamInput = 'DreamInput';
  return <MockDreamInput data-testid='mock-dream-input'/>
});

describe('DreamsPage', () => {
  let dreamBody1 = 'First dream';
  let dreamBody2 = 'Second dream';

  const returnedDreams = [
    {
      id: 2,
      body: dreamBody2,
      ai_interpretation: null,
      lucid: null,
      created_at: 1734869884
    },
    {
      id: 1,
      body: dreamBody1,
      ai_interpretation: null,
      lucid: null,
      created_at: 1734869880
    }
  ];

  const mockSetError = jest.fn();

  function renderDreamsPage() {
    return render(
      <DreamsPage setError={mockSetError}/>
    )
  };

  beforeEach(async () => {
    jest.spyOn(dreamsApi, 'postDreamsFromDate').mockReturnValue(returnedDreams);
    jest.spyOn(dreamsApi, 'postDeleteDream').mockReturnValue(null);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('shows all dreams returned from api call', async () => {
    renderDreamsPage();
    expect(dreamsApi.postDreamsFromDate).toBeCalled();
    expect(await screen.findByText(dreamBody1)).toBeInTheDocument();
    expect(await screen.findByText(dreamBody2)).toBeInTheDocument();
  });

  it('shows a new dream input form', async () => {
    renderDreamsPage();
    expect(await screen.findByTestId('mock-dream-input')).toBeInTheDocument();
  });
});