'use client';
import { useEffect } from 'react';

// Admin page that loads the Netlify CMS
export default function AdminPage() {
  useEffect(() => {
    // Import Netlify CMS dynamically on the client side only
    (async () => {
      const CMS = (await import('netlify-cms-app')).default;
      
      // Initialize the CMS
      CMS.init({
        config: {
          backend: {
            name: 'git-gateway',
            branch: 'main', // Branch to update
          },
          media_folder: 'public/images/news',
          public_folder: '/images/news',
          collections: [
            {
              name: 'news',
              label: 'News',
              folder: 'src/content/news',
              create: true,
              slug: '{{year}}-{{month}}-{{day}}-{{slug}}',
              fields: [
                { label: 'Title', name: 'title', widget: 'string' },
                { label: 'Publish Date', name: 'date', widget: 'datetime' },
                {
                  label: 'Category',
                  name: 'category',
                  widget: 'select',
                  options: [
                    'Announcement',
                    'Publication',
                    'Award',
                    'Research Update',
                    'Event'
                  ]
                },
                {
                  label: 'Featured Image',
                  name: 'thumbnail',
                  widget: 'image',
                  required: false
                },
                { label: 'Body', name: 'body', widget: 'markdown' }
              ],
            },
          ],
        },
      });
    })();
  }, []);

  return (
    <div>
      <style jsx global>{`
        /* Hide the default Next.js layout for admin */
        header, footer {
          display: none !important;
        }
        body {
          margin: 0;
          padding: 0;
        }
        #nc-root {
          height: 100vh;
        }
      `}</style>
    </div>
  );
}
