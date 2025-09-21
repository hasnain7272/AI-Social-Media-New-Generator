
import React from 'react';
import type { GeneratedContent, ImageResult } from '../types';

interface GeneratedPostProps {
  content: GeneratedContent;
}

const Hashtag: React.FC<{ tag: string }> = ({ tag }) => (
  <span className="inline-block bg-sky-800/50 text-sky-300 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 transition-colors hover:bg-sky-700/50">
    {tag}
  </span>
);

const ImageGallery: React.FC<{ images: ImageResult[] }> = ({ images }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
    {images.map((image, index) => (
      <img
        key={index}
        src={image.imageUrl}
        alt={image.imageAltText}
        className="w-full h-auto object-cover rounded-lg shadow-lg"
      />
    ))}
  </div>
);

const GeneratedPost: React.FC<GeneratedPostProps> = ({ content }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl p-6 md:p-8 border border-slate-700 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">{content.headline}</h2>
      
      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
        {content.caption}
      </p>
      
      <ImageGallery images={content.images} />
      
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex flex-wrap">
          {content.hashtags.map((tag, index) => (
            <Hashtag key={index} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Add fade-in animation to tailwind config (in a real project) or as a style tag (for this context)
// This is a little trick to inject CSS since we can't use a CSS file.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);


export default GeneratedPost;
