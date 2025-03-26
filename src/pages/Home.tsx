import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    username: string;
  };
  category: {
    name: string;
  };
  _count?: {
    comments: number;
    votes: number;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(username),
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando publicaciones...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Link
                  to={`/post/${post.id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                >
                  {post.title}
                </Link>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {post.category?.name}
                  </span>
                  {' • '}
                  <span>
                    {format(new Date(post.created_at), "d 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </span>
                  {' • '}
                  <span>por {post.author?.username}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 line-clamp-3">{post.content}</p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <span>
                {post._count?.comments || 0} comentarios
              </span>
              <span>
                {post._count?.votes || 0} votos
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
