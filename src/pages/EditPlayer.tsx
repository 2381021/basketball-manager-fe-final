import { useMutation, useQuery } from "@tanstack/react-query";
import PlayerForm, { PlayerFormInput } from "../components/PlayerForm";
import axios from "../utils/AxiosInstance";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const fetchPlayerDetail = async (id: string | undefined, token: string) => {
  return await axios.get<PlayerFormInput>(`/api/players/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const updatePlayer = async (id: string | undefined, data: PlayerFormInput, token: string) => {
  return await axios.put(`/api/players/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const EditPlayer = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const token = getToken();
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: (data: PlayerFormInput) => updatePlayer(id, data, token ?? "")
  });
  const { data: playerDetail, isFetching } = useQuery({
    queryKey: ["playerDetail", id],
    queryFn: () => fetchPlayerDetail(id, token ?? "")
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/players", { replace: true });
    }
  }, [isSuccess]);

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center bg-white/90 px-6 py-3 rounded-lg shadow-lg">
            <span className="text-2xl mr-4 text-gray-800">Updating...</span>
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
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6 mt-10">Edit Player</h2>
      {(isFetching || playerDetail === undefined) ? (
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
        <PlayerForm isEdit={true} mutateFn={mutate} defaultInputData={playerDetail.data} />
      )}
    </div>
  );
};

export default EditPlayer; 