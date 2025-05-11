import Link from 'next/link';
import React from 'react';
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

interface LatestNewsProps {
  newsItems: NewsItem[];
}

// Changed to client component that receives data as props
export default function LatestNews({ newsItems }: LatestNewsProps) {
  
  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get a preview of the content (first 150 characters)
  const getContentPreview = (content: string) => {
    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center text-[#0f2862]">Latest News</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {newsItems.slice(0, 3).map((newsItem: NewsItem, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <div className="text-gray-600">{formatDate(newsItem.frontmatter.date)}</div>
                    <div className={`inline-block px-3 py-1 mt-2 text-xs font-medium ${categoryColors[newsItem.frontmatter.category]?.bg || 'bg-gray-100'} ${categoryColors[newsItem.frontmatter.category]?.text || 'text-gray-800'} rounded-full`}>
                      {newsItem.frontmatter.category}
                    </div>
                    {newsItem.frontmatter.thumbnail && (
                      <div className="mt-2">
                        <Image 
                          src={newsItem.frontmatter.thumbnail}
                          alt={newsItem.frontmatter.title}
                          width={120}
                          height={80}
                          className="rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:w-3/4 md:pl-6">
                    <h3 className="text-xl font-bold mb-2">{newsItem.frontmatter.title}</h3>
                    <p className="text-black mb-4">
                      {getContentPreview(newsItem.content)}
                    </p>
                    <Link href={`/news#${newsItem.slug}`} className="text-[#0f2862] hover:text-[#001440] hover:underline">
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/news" 
              className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              View All News
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
