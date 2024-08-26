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
    render(<HackerNewsPage numberOfStories={2} onDataFetched={() => {}} client={createClientMock(numStories)} />);
    await waitFor(() => {
      for (let i = 1; i <= numStories; i++) {
        expect(screen.getByText(`Story ${i}`)).toBeTruthy();
      }
    });
  });
});
