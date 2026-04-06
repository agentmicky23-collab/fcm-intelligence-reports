const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTestPost() {
  console.log('Inserting test post...');
  
  const { data, error } = await supabase
    .from('insights_posts')
    .insert([
      {
        slug: 'test-post',
        title: 'Test Post — Delete Me Before Launch',
        excerpt: 'This is a placeholder post used to verify the /insights rendering pipeline.',
        body_markdown: `## Section one

This is a paragraph of test content.

- Bullet one
- Bullet two
- Bullet three

## Section two

Another paragraph with **bold text** and *italic text* and a [link](https://fcmreport.com).

> A blockquote to test quote styling.

## Section three

Final section.`,
        category: 'remuneration',
        published_at: new Date().toISOString(),
        meta_description: 'Test post for development.',
        reading_time_minutes: 2,
      }
    ])
    .select();

  if (error) {
    console.error('Error inserting test post:', error);
    process.exit(1);
  }

  console.log('✅ Test post inserted successfully:', data);
  console.log('View at: https://fcmreport.com/insights/test-post');
}

insertTestPost();
