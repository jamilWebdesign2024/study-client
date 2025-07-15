import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { 
  FaDownload, 
  FaLink, 
  FaYoutube, 
  FaFileAlt, 
  FaTable, 
  FaArrowLeft,
  FaSpinner
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ViewStudyMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedSession, setSelectedSession] = useState(null);

  // Fetch all booked sessions for the student
  const { data: bookedSessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['booked-sessions', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?studentEmail=${user.email}`);
      return res.data;
    },
  });

  // Fetch materials for selected session
  const { data: sessionMaterials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ['session-materials', selectedSession?._id],
    enabled: !!selectedSession,
    queryFn: async () => {
      const res = await axiosSecure.get(`/materials?sessionId=${selectedSession._id}`);
      return res.data;
    },
  });

  // Get icon based on link type
  const getLinkIcon = (type) => {
    switch(type) {
      case 'youtube': return <FaYoutube className="text-red-500" />;
      case 'doc': return <FaFileAlt className="text-blue-500" />;
      case 'spreadsheet': return <FaTable className="text-green-500" />;
      case 'drive': return <FaLink className="text-yellow-500" />;
      default: return <FaLink className="text-gray-500" />;
    }
  };

  // Handle image download
  const handleDownload = (imageUrl, title) => {
    saveAs(imageUrl, `${title}-study-material.jpg`);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Study Materials
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Access learning resources for your booked sessions
        </p>
      </div>

      {/* Back button when session is selected */}
      {selectedSession && (
        <button
          onClick={() => setSelectedSession(null)}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-6 hover:underline"
        >
          <FaArrowLeft /> Back to all sessions
        </button>
      )}

      {/* Loading State */}
      {(sessionsLoading || materialsLoading) && (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      )}

      {/* Show booked sessions if none selected */}
      {!selectedSession && !sessionsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedSessions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <FaFileAlt className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                No booked sessions found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Book sessions to access study materials
              </p>
            </div>
          ) : (
            bookedSessions.map((session) => (
              <motion.div
                key={session._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => setSelectedSession(session)}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {session.sessionTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                      {session.sessionId.slice(-6)}
                    </span>
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {session.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Booked on {formatDate(session.createdAt)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Tutor: {session.tutorEmail}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Show materials when session is selected */}
      {selectedSession && !materialsLoading && (
        <div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
              {selectedSession.sessionTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Study materials provided by your tutor
            </p>
          </div>

          {sessionMaterials.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <FaFileAlt className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                No materials available yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                The tutor hasn't uploaded any materials for this session
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessionMaterials.map((material) => (
                <motion.div
                  key={material._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Material Image with Download Button */}
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={material.imageUrl}
                      alt={material.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDownload(material.imageUrl, material.title)}
                      className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 text-indigo-600 dark:text-indigo-400 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
                      title="Download image"
                    >
                      <FaDownload />
                    </button>
                  </div>

                  {/* Material Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Uploaded on {formatDate(material.uploadedAt)}
                    </p>

                    {/* Resource Links */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Learning Resources:
                      </h4>
                      <div className="space-y-2">
                        {material.resourceLinks.map((link, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {getLinkIcon(link.type)}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                            >
                              {link.type === 'drive' ? 'Google Drive Resource' : 
                               link.type === 'youtube' ? 'YouTube Video' : 
                               link.type === 'doc' ? 'Google Doc' : 
                               link.type === 'spreadsheet' ? 'Google Sheet' : 
                               'Resource Link'}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ViewStudyMaterials;