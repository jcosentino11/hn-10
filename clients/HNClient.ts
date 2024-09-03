import { fetch } from "@/utils/Fetch";

export interface Story {
  objectID: string;
  title: string;
  url: string;
  author: string;
}

export interface HNClient {
  fetchHackerNewsStories(numberOfStories: number): Promise<Story[]>;
}

export class DefaultHNClient {
  constructor(private responseTimeout: number = 5000) {}

  async fetchHackerNewsStories(numberOfStories: number): Promise<Story[]> {
    try {
      // TODO filter out Ask HN, etc
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${numberOfStories * 2}`,
        {timeout: this.responseTimeout}
      );
      const data = await response.json();
      return data.hits.filter((hit: any) => !hit._tags.includes('ask_hn')).slice(0, numberOfStories);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
