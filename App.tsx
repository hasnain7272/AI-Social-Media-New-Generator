
import React, { useState, useEffect, useCallback } from 'react';
import type { GeneratedContent } from './types';
import { fetchTrendingNews, generateCaption, generateHashtags, generateImageSearchKeywords } from './services/geminiService';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import GeneratedPost from './components/GeneratedPost';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing...');

  const loadingMessages = [
    'Fetching trending news headlines...',
    'Analyzing the latest stories...',
    'Crafting the perfect caption...',
    'Generating viral hashtags...',
    'Searching for stunning visuals...',
    'Assembling your social media post...',
  ];

  useEffect(() => {
    // Fix: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout.
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      let i = 0;
      setLoadingMessage(loadingMessages[i]);
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGeneratePost = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // 1. Fetch trending news
      const articles = await fetchTrendingNews(1);
      if (!articles || articles.length === 0) {
        throw new Error("Could not fetch any trending news articles. Please try again later.");
      }
      const article = articles[0];

      // 2. Run caption, hashtag, and image keyword generation in parallel
      const [caption, hashtags, imageKeywords] = await Promise.all([
        generateCaption(article.headline, article.fullText),
        generateHashtags(article.headline, article.fullText),
        generateImageSearchKeywords(article.headline)
      ]);

      // 3. Simulate image search using keywords
      const imageResults = imageKeywords.split(' ').map((keyword, index) => ({
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(keyword)}/${600 + index*10}/${400 + index*10}`,
        imageAltText: `An image related to ${imageKeywords}`,
      }));
      
      if(imageResults.length === 0) {
        imageResults.push({
            imageUrl: `https://picsum.photos/seed/news/600/400`,
            imageAltText: `A generic news-related image`,
        });
      }

      setGeneratedContent({
        headline: article.headline,
        caption,
        hashtags,
        images: imageResults,
      });

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate content. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl text-center">
          <p className="text-lg md:text-xl text-slate-400 mb-8">
            Click the button below to harness the power of AI. We'll fetch the latest news, write a captivating post, and find the perfect visuals for you.
          </p>
          <button
            onClick={handleGeneratePost}
            disabled={isLoading}
            className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold text-lg py-3 px-8 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-sky-400/50 transform hover:scale-105"
          >
            {isLoading ? 'Generating...' : '✨ Generate Social Media Post'}
          </button>
        </div>

        <div className="w-full max-w-4xl mt-12">
          {isLoading && <LoadingScreen message={loadingMessage} />}
          {error && <ErrorDisplay message={error} />}
          {generatedContent && !isLoading && <GeneratedPost content={generatedContent} />}
        </div>
      </main>
    </div>
  );
};

export default App;