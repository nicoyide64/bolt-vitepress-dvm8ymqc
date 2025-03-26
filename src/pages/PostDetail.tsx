import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    username: string;
  };
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
  };
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  async function fetchPostDetails() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(username),
          comments(
            *,
            author:profiles(username)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setPost(data);
    } catch (error) {
      console.error('Error fetching post details:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando publicación...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800">Publicación no encontrada</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Volver
      </button>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-4">
          <span>por {post.author.username}</span>
          {' • '}
          <span>{new Date(post.created_at).toLocaleDateString('es-ES')}</span>
        </div>
        <p className="text-gray-600">{post.content}</p>
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Comentarios</h2>
        {post.comments.length === 0 ? (
          <p className="text-gray-600">No hay comentarios aún.</p>
        ) : (
          post.comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-500 mb-2">
                <span>por {comment.author.username}</span>
                {' • '}
                <span>{new Date(comment.created_at).toLocaleDateString('es-ES')}</span>
              </div>
              <p className="text-gray-600">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
