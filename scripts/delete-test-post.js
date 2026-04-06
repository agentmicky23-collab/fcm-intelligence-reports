const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteTestPost() {
  console.log('Deleting test post...');
  
  const { data, error } = await supabase
    .from('insights_posts')
    .delete()
    .eq('slug', 'test-post')
    .select();

  if (error) {
    console.error('Error deleting test post:', error);
    process.exit(1);
  }

  console.log('✅ Test post deleted successfully:', data);
}

deleteTestPost();
