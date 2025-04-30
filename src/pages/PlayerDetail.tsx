import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

interface Player {
  id: number;
  name: string;
  position: string;
  speciality: string;
}

const fetchPlayerDetail = async (id: string | undefined, token: string) => {
  return await axios.get<Player>(`/api/players/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const deletePlayer = async (id: string | undefined, token: string) => {
  return await axios.delete(`/api/players/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const PlayerDetail = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const token = getToken();
  const { data: playerDetail, isFetching } = useQuery({
    queryKey: ["playerDetail", id],
    queryFn: () => fetchPlayerDetail(id, token ?? "")
  });
  const queryClient = useQueryClient();
  const { mutate: deletePlayerMutation, isPending } = useMutation({
    mutationFn: () => deletePlayer(id, token ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playerList"] });
    }
  });
  const navigate = useNavigate();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this player?")) {
      deletePlayerMutation();
      navigate("/players", { replace: true });
    }
  };

  return (
    <div className="container mx-auto px-4">
      {isFetching ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-2xl p-6 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{playerDetail?.data.name}</h2>
          <p className="text-gray-700 mb-2"><strong>Position:</strong> {playerDetail?.data.position}</p>
          <p className="text-gray-700 mb-4"><strong>Speciality:</strong> {playerDetail?.data.speciality}</p>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => navigate(`/players/${id}/edit`)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDetail; 