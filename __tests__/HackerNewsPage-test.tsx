import HackerNewsPage from '@/components/HackerNewsPage';
import { render, screen, waitFor } from '@testing-library/react-native';

const generateStories = (numStories: number) => 
    Array.from({ length: numStories }, (_, index) => ({
      objectID: (index + 1).toString(),
      title: `Story ${index + 1}`,
      url: `https://example.com/${index + 1}`,
      author: `Author ${index + 1}`
    }));

const createClientMock = (numResults: number) => {
  return {
    fetchHackerNewsStories: jest.fn(() =>
      Promise.resolve(generateStories(numResults))
    ),
  };
};

describe('<HackerNewsPage />', () => {
  test('Stories render after being fetched', async () => {
    const numStories = 10;
    render(<HackerNewsPage numberOfStories={numStories} onDataFetched={() => {}} client={createClientMock(numStories)} />);
    await waitFor(() => {
      for (let i = 1; i <= numStories; i++) {
        expect(screen.getByText(`Story ${i}`)).toBeTruthy();
      }
    });
  });
  test('Offline status shown when no stories fetched on first time', async () => {
    render(<HackerNewsPage numberOfStories={10} onDataFetched={() => {}} client={createClientMock(0)} />);
    await waitFor(() => {
      expect(screen.getByText("Loading Failed")).toBeTruthy();
    });
  });
});
