export interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
}

export default class HNClient {
  async fetchHackerNewsStories(numberOfStories: number): Promise<Story[]> {
    try {
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${numberOfStories}`
      );
      const data = await response.json();
      return data.hits;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
