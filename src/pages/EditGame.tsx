import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

interface Game {
  id: number;
  opponent: string;
  date: string;
  locationstatus: string;
  createdAt: string;
  updatedAt: string;
}

const fetchGame = async (id: string, token: string) => {
  return await axios.get<Game>(`/api/games/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const EditGame = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const token = getToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchGame(id ?? "", token ?? "")
  });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      return await axios.put(`/api/games/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", id] });
      queryClient.invalidateQueries({ queryKey: ["gameList"] });
      navigate(`/games/${id}`);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      opponent: formData.get("opponent"),
      date: formData.get("date"),
      locationstatus: formData.get("locationstatus")
    };
    mutate(data);
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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Edit Game</h2>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="opponent" className="block text-sm font-medium text-gray-700">
                  Opponent
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="opponent"
                    name="opponent"
                    defaultValue={data?.data.opponent}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={data?.data.date.split("T")[0]}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="locationstatus" className="block text-sm font-medium text-gray-700">
                  Location Status
                </label>
                <div className="mt-1">
                  <select
                    id="locationstatus"
                    name="locationstatus"
                    defaultValue={data?.data.locationstatus}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Away">Away</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGame; 