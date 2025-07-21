
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth(); // Firebase থেকে current user
  const axiosSecure = useAxiosSecure(); // secure axios instance

  const { data: userInfo = {}, isLoading: userLoading, refetch } = useQuery({
    enabled: !authLoading && !!user?.email,
    queryKey: ['userInfo', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`); // MongoDB থেকে data আনবে
      return res.data; // { name, email, photo, role, ... }
    }
  });

  return {
    userInfo,
    role: userInfo.role,
    roleLoading: authLoading || userLoading,
    refetch
  };
};

export default useUserRole;
