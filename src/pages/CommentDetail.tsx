import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { useState, useEffect } from "react";
import AxiosInstance from "../utils/AxiosInstance";

interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
}

const fetchComment = async (id: string, token: string) => {
  try {
    console.log('Fetching comment with ID:', id, 'and token:', token ? 'Token present' : 'No token');
    const response = await AxiosInstance.get<Comment>(`/api/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('API Response:', response.data);
    return response;
  } catch (error) {
    console.error('Error fetching comment:', error);
    throw error;
  }
};

const CommentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const token = getToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Debug logging for initial values
  useEffect(() => {
    console.log('Component mounted with ID:', id);
    console.log('Token present:', !!token);
  }, [id, token]);

  // Redirect if no ID is provided
  useEffect(() => {
    if (!id) {
      navigate("/comments");
    }
  }, [id, navigate]);

  const { data, isFetching, error } = useQuery<AxiosResponse<Comment>>({
    queryKey: ["comment", id],
    queryFn: () => {
      console.log('Query function called with ID:', id, 'and token:', token ? 'Token present' : 'No token');
      return fetchComment(id ?? "", token ?? "");
    },
    enabled: !!id && !!token,
    retry: 1
  });

  // Debug logging for query state
  useEffect(() => {
    console.log('Query state:', {
      isFetching,
      hasData: !!data,
      hasError: !!error,
      id,
      tokenPresent: !!token
    });
  }, [isFetching, data, error, id, token]);

  useEffect(() => {
    if (data?.data?.content) {
      setEditContent(data.data.content);
    }
  }, [data]);

  const { mutate: updateComment } = useMutation({
    mutationFn: async (content: string) => {
      return await AxiosInstance.put(
        `/api/comments/${id}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment", id] });
      queryClient.invalidateQueries({ queryKey: ["commentList"] });
      setIsEditing(false);
    }
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async () => {
      return await AxiosInstance.delete(`/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commentList"] });
      navigate("/comments");
    }
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateComment(editContent);
  };

  const handleDelete = () => {
    deleteComment();
  };

  if (!id) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Invalid Comment ID!</strong>
          <span className="block sm:inline"> Redirecting to comments list...</span>
        </div>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Query error:', error);
    return (
      <div className="container mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load comment. Please try again later.</span>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    console.log('No data received:', data);
    return (
      <div className="container mx-auto px-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline"> The comment you're looking for doesn't exist.</span>
        </div>
      </div>
    );
  }

  const comment = data.data;
  console.log('Comment data:', comment);
  console.log('User data:', comment.user);

  if (!comment.user) {
    console.error('User data is missing from comment:', comment);
    return (
      <div className="container mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> User information is missing from this comment.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Comment Details</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/comments")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back to Comments
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Content</h3>
              {isEditing ? (
                <form onSubmit={handleUpdate} className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                    required
                  />
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-2 text-gray-700">{comment.content}</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Posted By</h3>
              <p className="mt-2 text-gray-700">{comment.user.username}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Posted On</h3>
              <p className="mt-2 text-gray-700">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentDetail; 