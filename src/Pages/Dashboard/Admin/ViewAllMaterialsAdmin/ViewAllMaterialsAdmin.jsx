import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TrashIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  LinkIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loading from '../../../../Components/Loading';

const QUERY_KEYS = {
  ADMIN_ALL_MATERIALS: ['adminAllMaterials']
};

const API_ENDPOINTS = {
  ADMIN_MATERIALS: '/admin/materials',
  DELETE_MATERIAL: (id) => `/materials/${id}`
};

const RESOURCE_TYPES = {
  YOUTUBE: 'youtube',
  DOC: 'doc',
  DRIVE: 'drive',
  SPREADSHEET: 'spreadsheet',
  OTHER: 'other'
};

const MESSAGES = {
  DELETE_CONFIRMATION: {
    title: 'Are you sure?',
    text: 'You are about to delete this material permanently.',
    confirmText: 'Yes, delete it!',
    successTitle: 'Deleted!',
    successText: 'Material has been removed successfully.'
  },
  LOADING: 'Loading materials...',
  NO_MATERIALS: 'No materials have been uploaded yet.',
  PAGE_TITLE: 'Material Management',
  PAGE_SUBTITLE: 'All Uploaded Materials (Approved Sessions)'
};

const ViewAllMaterialsAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_ALL_MATERIALS,
    queryFn: async () => {
      const res = await axiosSecure.get(API_ENDPOINTS.ADMIN_MATERIALS);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(API_ENDPOINTS.DELETE_MATERIAL(id)),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.ADMIN_ALL_MATERIALS);
      Swal.fire({
        title: MESSAGES.DELETE_CONFIRMATION.successTitle,
        text: MESSAGES.DELETE_CONFIRMATION.successText,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    },
    onError: () => {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete material. Please try again.',
        icon: 'error'
      });
    }
  });

  const getResourceIcon = (type) => {
    const iconClass = "w-4 h-4";
    const iconMap = {
      [RESOURCE_TYPES.YOUTUBE]: <VideoCameraIcon className={iconClass} />,
      [RESOURCE_TYPES.DOC]: <DocumentTextIcon className={iconClass} />,
      [RESOURCE_TYPES.DRIVE]: <LinkIcon className={iconClass} />,
      [RESOURCE_TYPES.SPREADSHEET]: <TableCellsIcon className={iconClass} />,
      [RESOURCE_TYPES.OTHER]: <LinkIcon className={iconClass} />
    };
    return iconMap[type] || iconMap[RESOURCE_TYPES.OTHER];
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: MESSAGES.DELETE_CONFIRMATION.title,
      text: `${MESSAGES.DELETE_CONFIRMATION.text}\n\nMaterial: "${title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: MESSAGES.DELETE_CONFIRMATION.confirmText,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '', // DaisyUI btn-error will style automatically
      cancelButtonColor: '',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-300 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-base-100 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{MESSAGES.PAGE_TITLE}</h1>
              <p className="text-base-content/70">{MESSAGES.PAGE_SUBTITLE}</p>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Materials</div>
                <div className="stat-value">{materials.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-base-100 rounded-lg shadow overflow-hidden">
          {materials.length === 0 ? (
            <div className="text-center py-16">
              <DocumentTextIcon className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <p className="text-lg text-base-content/60">{MESSAGES.NO_MATERIALS}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-accent/5 text-base-content">
                    <th>SN</th>
                    <th>Material Title</th>
                    <th>Session</th>
                    <th>Tutor</th>
                    <th>Preview</th>
                    <th>Resources</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, index) => (
                    <tr key={material._id} className="hover">
                      <td>{index + 1}</td>
                      <td className="font-semibold">{material.title}</td>
                      <td className="text-sm">{material.sessionTitle}</td>
                      <td className="text-sm text-base-content/70">{material.tutorEmail}</td>
                      <td>
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-lg">
                            <img
                              src={material.imageUrl}
                              alt={`${material.title} preview`}
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="flex flex-col gap-1">
                        {material.resourceLinks?.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-xs justify-start gap-2 hover:btn-primary"
                          >
                            {getResourceIcon(link.type)}
                            <span className="text-xs">{link.type.charAt(0).toUpperCase() + link.type.slice(1)}</span>
                          </a>
                        )) || <span className="text-xs text-base-content/50">No resources</span>}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(material._id, material.title)}
                          className="btn btn-sm btn-error btn-outline gap-2"
                          disabled={deleteMutation.isLoading}
                        >
                          <TrashIcon className="w-4 h-4" />
                          {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllMaterialsAdmin;
