import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const newsDirectory = path.join(process.cwd(), 'src/content/news');

// Get all news files
export function getNewsFiles() {
  try {
    return fs.readdirSync(newsDirectory);
  } catch (error) {
    console.error('Error reading news directory:', error);
    return [];
  }
}

// Parse news file
export function getNewsItemBySlug(slug: string) {
  try {
    const fullPath = path.join(newsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      frontmatter: data,
      content
    };
  } catch (error) {
    console.error(`Error reading news file ${slug}:`, error);
    return null;
  }
}

// Get all news items
export function getAllNewsItems() {
  try {
    const files = getNewsFiles();
    const allNews = files.map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const newsItem = getNewsItemBySlug(slug);
      return newsItem;
    }).filter(item => item !== null);
    
    // Sort by date (newest first)
    return allNews.sort((a, b) => {
      if (!a || !b) return 0;
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error getting all news items:', error);
    return [];
  }
}
