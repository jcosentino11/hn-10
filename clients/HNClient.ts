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
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${numberOfStories}`,
        {timeout: this.responseTimeout}
      );
      const data = await response.json();
      return data.hits;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
