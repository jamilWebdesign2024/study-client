import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTrash, FaYoutube, FaFileAlt, FaLink } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loading from '../../../../Components/Loading';


const ViewAllMaterialsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['adminAllMaterials'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/materials'); // ✅ Updated route
      return res.data;
    }
  });
  

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/materials/${id}`); // ✅ delete route same
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminAllMaterials']);
      Swal.fire('Deleted!', 'Material has been removed.', 'success');
    }
  });

  if(isLoading){
    return <Loading></Loading>
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this material.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div className="text-center py-10">Loading materials...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Uploaded Materials (Approved Sessions)</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Session Title</th>
              <th>Tutor Email</th>
              <th>Image</th>
              <th>Resources</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat, index) => (
              <tr key={mat._id}>
                <td>{index + 1}</td>
                <td>{mat.title}</td>
                <td>{mat.sessionTitle}</td>
                <td>{mat.tutorEmail}</td>
                <td>
                  <img src={mat.imageUrl} alt="Material" className="w-12 h-12 rounded" />
                </td>
                <td className="space-y-1">
                  {mat.resourceLinks.map((link, i) => (
                    <div key={i}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        {link.type === 'youtube' && <FaYoutube className="text-red-500" />}
                        {link.type === 'doc' && <FaFileAlt className="text-blue-500" />}
                        {link.type === 'drive' && <FaLink className="text-yellow-500" />}
                        {link.type === 'spreadsheet' && <FaFileAlt className="text-green-500" />}
                        {link.type === 'other' && <FaLink className="text-gray-500" />}
                        <span>View</span>
                      </a>
                    </div>
                  ))}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(mat._id)}
                    className="btn btn-sm btn-error"
                  >
                    <FaTrash /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {materials.length === 0 && (
          <p className="text-center text-gray-500 mt-5">No materials uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllMaterialsAdmin;
