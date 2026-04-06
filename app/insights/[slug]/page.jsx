import { notFound } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import InsightPostClient from './InsightPostClient';

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

async function getPost(slug) {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from('insights_posts')
    .select('*')
    .eq('slug', slug)
    .lte('published_at', new Date().toISOString())
    .not('published_at', 'is', null)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found — FCM Intelligence',
    };
  }

  return {
    title: `${post.title} — FCM Intelligence`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt,
      url: `https://fcmreport.com/insights/${post.slug}`,
    },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function InsightPostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <InsightPostClient post={post} />;
}
