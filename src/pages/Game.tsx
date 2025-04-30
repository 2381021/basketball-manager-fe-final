import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

interface Game {
  id: number;
  opponent: string;
  date: string;
  locationstatus: string;
  createdAt: string;
  updatedAt: string;
}

const fetchGameList = async (token: string) => {
  return await axios.get<Game[]>("/api/games", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const GameSkeleton = () => {
  return (
    <div className="group relative">
      <div className="aspect-square w-full rounded-md bg-gray-200 animate-pulse lg:aspect-auto lg:h-80"></div>
      <div className="mt-4 flex justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="mt-1 h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
      </div>
    </div>
  );
};

const Game = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const { data, isFetching } = useQuery({
    queryKey: ["gameList"],
    queryFn: () => fetchGameList(token ?? "")
  });
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => navigate("/games/add")}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
      </button>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Games</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {isFetching ? (
              Array.from({ length: 4 }).map((_, index) => (
                <GameSkeleton key={index} />
              ))
            ) : (
              data?.data.map((game) => (
                <div
                  key={game.id}
                  className="group relative"
                  onClick={() => navigate(`/games/${game.id}`)}
                >
                  <div className="bg-white shadow-md rounded-2xl p-4 mb-6 max-w-xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900">vs {game.opponent}</h3>
                    <div className="text-sm text-gray-500">
                      <p>Date: {new Date(game.date).toLocaleDateString()}</p>
                      <p>Location: {game.locationstatus}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game; 