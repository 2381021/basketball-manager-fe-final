import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

interface Game {
  id: number;
  opponent: string;
  date: string;
  locationstatus: string;
}

const fetchGames = async (token: string) => {
  return await axios.get<Game[]>("/api/games", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const AddComment = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: games } = useQuery({
    queryKey: ["gameList"],
    queryFn: () => fetchGames(token ?? "")
  });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      return await axios.post("/api/comments", data, {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      gameId: formData.get("gameId"),
      content: formData.get("content")
    };
    mutate(data);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Add Comment</h2>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="gameId" className="block text-sm font-medium text-gray-700">
                  Game
                </label>
                <div className="mt-1">
                  <select
                    id="gameId"
                    name="gameId"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a game</option>
                    {games?.data.map((game) => (
                      <option key={game.id} value={game.id}>
                        vs {game.opponent} - {new Date(game.date).toLocaleDateString()} ({game.locationstatus})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    name="content"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddComment; 