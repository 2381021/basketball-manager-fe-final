import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { motion } from "framer-motion";

interface Player {
  id: number;
  name: string;
  position: string;
  speciality: string;
}

const fetchPlayerList = async (token: string) => {
  return await axios.get<Player[]>("/api/players", {
    headers: {
        Authorization :`Bearer ${token}`
    }
  });
};

const PlayerSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <div className="aspect-square w-full rounded-md bg-gray-800 animate-pulse lg:aspect-auto lg:h-80"></div>
      <div className="mt-4 flex justify-between">
        <div>
          <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4"></div>
          <div className="mt-1 h-3 bg-gray-800 rounded animate-pulse w-2/3"></div>
        </div>
        <div className="h-4 bg-gray-800 rounded animate-pulse w-1/4"></div>
      </div>
    </motion.div>
  );
};

const Player = () => {
  const {getToken} = useAuth();
  const token = getToken();
  const { data, isFetching } = useQuery({ queryKey: ["playerList"], queryFn: () => fetchPlayerList(token ?? "") });
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-black"
    >
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
        onClick={() => navigate("/players/add")}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </motion.button>
      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold tracking-tight text-white"
        >
          List of Players
        </motion.h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {isFetching ? (Array.from({ length: 4 }).map((_, index) => (
            <PlayerSkeleton key={index} />
          ))) : (
            data?.data.map((player) => (
              <motion.div 
                key={player.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group relative cursor-pointer bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                onClick={() => navigate(`/players/${player.id}`)}
              >
                <div className="aspect-square w-full rounded-md bg-gray-800 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 transition-opacity"></div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-300">
                      <a>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {player.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">{player.position}</p>
                  </div>
                  <p className="text-sm font-medium text-red-500">{player.speciality}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Player; 