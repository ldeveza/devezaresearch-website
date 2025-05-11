import React from 'react';
import { getAllNewsItems } from '@/utils/newsUtils';
import Image from 'next/image';

// Define types for TypeScript
type NewsItem = {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    category: string;
    thumbnail?: string;
  };
  content: string;
};

export default function NewsPage() {
  const allNews = getAllNewsItems() as NewsItem[];
  
  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Define category colors
  const categoryColors: {[key: string]: {bg: string, text: string}} = {
    'Announcement': {bg: 'bg-blue-100', text: 'text-blue-800'},
    'Publication': {bg: 'bg-green-100', text: 'text-green-800'},
    'Award': {bg: 'bg-yellow-100', text: 'text-yellow-800'},
    'Research Update': {bg: 'bg-purple-100', text: 'text-purple-800'},
    'Event': {bg: 'bg-red-100', text: 'text-red-800'},
  };
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#0f2862]">News & Updates</h1>
      <div className="space-y-8">
        {allNews.map((newsItem, index) => {
          // Split the content into paragraphs
          const paragraphs = newsItem.content.split('\n\n').filter(p => p.trim() !== '');
          
          return (
            <div key={index} id={newsItem.slug} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-black">{formatDate(newsItem.frontmatter.date)}</div>
                <div className={`px-3 py-1 text-xs font-medium ${categoryColors[newsItem.frontmatter.category]?.bg || 'bg-gray-100'} ${categoryColors[newsItem.frontmatter.category]?.text || 'text-gray-800'} rounded-full`}>
                  {newsItem.frontmatter.category}
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4 text-[#0f2862]">{newsItem.frontmatter.title}</h2>
              
              {newsItem.frontmatter.thumbnail && (
                <div className="mb-4">
                  <Image 
                    src={newsItem.frontmatter.thumbnail}
                    alt={newsItem.frontmatter.title}
                    width={600}
                    height={300}
                    className="rounded-md w-full object-cover"
                  />
                </div>
              )}
              
              <div className="prose max-w-none">
                {paragraphs.map((paragraph, pIndex) => {
                  // Handle bullet points
                  if (paragraph.trim().startsWith('- ')) {
                    const items = paragraph.split('\n').filter(item => item.trim() !== '');
                    return (
                      <ul key={pIndex} className="list-disc pl-5 mb-4 space-y-1">
                        {items.map((item, iIndex) => (
                          <li key={iIndex}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  } else {
                    return <p key={pIndex} className="mb-4 text-black">{paragraph}</p>;
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
