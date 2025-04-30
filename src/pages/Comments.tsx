import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { motion } from "framer-motion";

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

const fetchComments = async (token: string) => {
  return await axios.get<Comment[]>("/api/comments", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const Comments = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const navigate = useNavigate();

  const { data, isFetching, error } = useQuery({
    queryKey: ["commentList"],
    queryFn: () => fetchComments(token ?? "")
  });

  if (isFetching) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/4"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded">
          <p>Error loading comments. Please try again later.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 min-h-screen"
    >
      <div className="bg-black min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <h2 className="text-2xl font-bold tracking-tight text-white">Comments</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/comments/add")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Add Comment
            </motion.button>
          </motion.div>
          <div className="mt-6 space-y-6">
            {data?.data.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 shadow rounded-lg p-6 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => navigate(`/comments/${comment.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>Posted by: {comment.user.username}</p>
                    <p>Posted on: {new Date(comment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Comments; 