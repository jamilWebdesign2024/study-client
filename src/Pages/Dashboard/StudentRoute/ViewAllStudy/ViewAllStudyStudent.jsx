import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { FaDownload, FaLink, FaYoutube, FaArrowLeft } from "react-icons/fa";
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
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">
          My Study Materials
        </h2>

        {/* Step 1: Show Booked Sessions */}
        {!selectedSessionId && (
          <>
            {isBookingLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loading />
              </div>
            ) : bookedSessions.length === 0 ? (
              <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
                <div className="card-body">
                  <h3 className="text-2xl font-semibold text-center">
                    No Sessions Booked
                  </h3>
                  <p className="text-center text-base-content/70">
                    You haven't booked any tutoring sessions yet.
                  </p>
                  <div className="flex justify-center mt-4">
                    <button className="btn btn-primary">Browse Tutors</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookedSessions.map((session) => (
                  <motion.div
                    key={session._id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="card bg-base-100 shadow-xl cursor-pointer h-full hover:shadow-2xl transition-all duration-300"
                      onClick={() => setSelectedSessionId(session.sessionId)}
                    >
                      <figure className="px-6 pt-6">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-content text-2xl font-bold">
                          {session.sessionTitle.charAt(0)}
                        </div>
                      </figure>
                      <div className="card-body items-center text-center">
                        <h3 className="card-title text-lg">{session.sessionTitle}</h3>
                        <p className="text-base-content/70">
                          Tutor: {session.tutorName}
                        </p>
                        <div className="badge badge-primary badge-outline mt-2">
                          View Materials
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Step 2: Show Materials */}
        {selectedSessionId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="btn btn-ghost mb-6"
              onClick={() => setSelectedSessionId(null)}
            >
              <FaArrowLeft className="mr-2" /> Back to Sessions
            </button>

            {isMaterialsLoading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : materials.length === 0 ? (
              <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
                <div className="card-body text-center">
                  <h3 className="text-2xl font-semibold">
                    No Materials Available
                  </h3>
                  <p className="text-base-content/70">
                    Your tutor hasn't uploaded any materials for this session yet.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">
                  Session Materials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="card bg-base-100 shadow-xl overflow-hidden"
                    >
                      <figure className="h-48">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                      <div className="card-body">
                        <h3 className="card-title text-lg">{item.title}</h3>

                        {/* Resource Links */}
                        {item.resourceLinks && item.resourceLinks.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Resources:</h4>
                            <div className="flex flex-col gap-2">
                              {item.resourceLinks.map((res, idx) => (
                                <a
                                  key={idx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-outline btn-sm justify-start"
                                >
                                  {res.type === "drive" ? (
                                    <FaLink className="mr-2" />
                                  ) : (
                                    <FaYoutube className="mr-2" />
                                  )}
                                  {res.type === "drive" ? "Google Drive" : "YouTube"}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="card-actions justify-end mt-4">
                          <button
                            onClick={() => handleDownload(item.imageUrl, item.title)}
                            className="btn btn-primary btn-sm"
                          >
                            <FaDownload className="mr-2" /> Download
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewAllStudyStudent;
