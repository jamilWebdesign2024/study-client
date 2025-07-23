
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth(); 
  const axiosSecure = useAxiosSecure(); 

  const { data: userInfo = {}, isLoading: userLoading, refetch } = useQuery({
    enabled: !authLoading && !!user?.email,
    queryKey: ['userInfo', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`); 
      return res.data; 
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
