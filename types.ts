
export interface NewsArticle {
  headline: string;
  fullText: string;
}

export interface ImageResult {
  imageUrl: string;
  imageAltText: string;
}

export interface GeneratedContent {
  headline: string;
  caption: string;
  hashtags: string[];
  images: ImageResult[];
}
