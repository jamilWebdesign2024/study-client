import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { FaDownload, FaLink, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../Components/Loading";

const ViewAllStudyStudent = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Get booked sessions by student email
  const {
    data: bookedSessions = [],
    isLoading: isBookingLoading,
  } = useQuery({
    queryKey: ["student-booked-sessions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookedSession/user?email=${user?.email}`
      );
      return res.data;
    },
  });

  // Get materials of selected session
  const {
    data: materials = [],
    isLoading: isMaterialsLoading,
  } = useQuery({
    queryKey: ["materials-by-session", selectedSessionId],
    enabled: !!selectedSessionId,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/student/materials?sessionId=${selectedSessionId}`
      );
      return res.data;
    },
  });

  
  const handleDownload = async (url, title) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, `${title}.jpg`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-5">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">
        My Study Materials
      </h2>

      {/* Step 1: Show Booked Sessions */}
      {!selectedSessionId && (
        <>
          {isBookingLoading ? (
            <Loading></Loading>
          ) : bookedSessions.length === 0 ? (
            <p className="text-center text-gray-600">
              You haven’t booked any sessions yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookedSessions.map((session) => (
                <motion.div
                  key={session._id}
                  className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl cursor-pointer hover:scale-[1.02] transition-all"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSessionId(session.sessionId)}
                >
                  <h3 className="text-xl font-semibold text-blue-700">
                    {session.sessionTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tutor: {session.tutorName}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Click to view materials
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Step 2: Show Materials */}
      {selectedSessionId && (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setSelectedSessionId(null)}
          >
            ← Back to Sessions
          </button>

          {isMaterialsLoading ? (
            <p className="text-blue-600 text-lg">Loading materials...</p>
          ) : materials.length === 0 ? (
            <p className="text-gray-600">
              No materials found for this session.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((item) => (
                <motion.div
                  key={item._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden p-4 hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="mt-3 text-lg font-bold text-blue-800">
                    {item.title}
                  </h3>

                  {/* Resource Links */}
                  <div className="mt-2 flex flex-col gap-2">
                    {item.resourceLinks?.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline flex items-center gap-1"
                      >
                        {res.type === "drive" ? <FaLink /> : <FaYoutube />}
                        {res.type === "drive" ? "Google Drive" : "YouTube"}
                      </a>
                    ))}
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(item.imageUrl, item.title)}
                    className="mt-3 flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    <FaDownload /> Download Image
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAllStudyStudent;
