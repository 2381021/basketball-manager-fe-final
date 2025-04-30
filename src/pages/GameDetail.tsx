import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { useState } from "react";

interface Game {
  id: number;
  opponent: string;
  date: string;
  locationstatus: string;
}

const fetchGame = async (id: string, token: string) => {
  return await axios.get<Game>(`/api/games/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const GameDetail = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const token = getToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchGame(id ?? "", token ?? "")
  });

  const { mutate: deleteGame } = useMutation({
    mutationFn: async () => {
      return await axios.delete(`/api/games/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameList"] });
      navigate("/games");
    }
  });

  const handleDelete = () => {
    deleteGame();
  };

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

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">vs {data?.data.opponent}</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/games/${id}/edit`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
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
              <h3 className="text-lg font-medium text-gray-900">Date</h3>
              <p className="mt-2 text-gray-700">
                {new Date(data?.data.date ?? "").toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Location Status</h3>
              <p className="mt-2 text-gray-700">{data?.data.locationstatus}</p>
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
              Are you sure you want to delete this game? This action cannot be undone.
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

export default GameDetail; 