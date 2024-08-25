import HackerNewsPage from '@/components/HackerNewsPage';
import { render, screen, waitFor } from '@testing-library/react-native';

const clientMock = {
  fetchHackerNewsStories: jest.fn(() =>
    Promise.resolve([
      { objectID: '1', title: 'Story 1', url: 'https://example.com/1', author: 'Author 1' },
      { objectID: '2', title: 'Story 2', url: 'https://example.com/2', author: 'Author 2' },
    ])
  ),
};

describe('<HackerNewsPage />', () => {
  test('Stories render after being fetched', async () => {
    render(<HackerNewsPage numberOfStories={2} onDataFetched={() => {}} client={clientMock} />);
    await waitFor(() => {
      expect(screen.getByText('Story 1')).toBeTruthy();
      expect(screen.getByText('Story 2')).toBeTruthy();
    });
  });
});
