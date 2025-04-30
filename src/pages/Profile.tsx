import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useAuth } from "../utils/AuthProvider";

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const fetchUserProfile = async (token: string) => {
  return await axios.get<User>("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const Profile = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const { data, isFetching } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(token ?? "")
  });

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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Username</h3>
              <p className="mt-2 text-gray-700">{data?.data.username}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Email</h3>
              <p className="mt-2 text-gray-700">{data?.data.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Member Since</h3>
              <p className="mt-2 text-gray-700">
                {new Date(data?.data.createdAt ?? "").toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 