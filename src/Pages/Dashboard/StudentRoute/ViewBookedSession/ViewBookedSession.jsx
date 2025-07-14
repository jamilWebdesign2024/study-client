import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaStar, FaRegStar, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const ViewBookedSession = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: ''
  });

  // Fetch booked sessions for the current student
  const { data: bookedSessions = [], refetch } = useQuery({
    queryKey: ['booked-sessions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/bookings/my-sessions');
      return res.data;
    }
  });

  // Fetch reviews for a specific session
  const { data: sessionReviews = [] } = useQuery({
    queryKey: ['session-reviews', selectedSession?.sessionId],
    queryFn: async () => {
      if (!selectedSession) return [];
      const res = await axiosSecure.get(`/reviews/${selectedSession.sessionId}`);
      return res.data;
    },
    enabled: !!selectedSession
  });

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        sessionId: selectedSession.sessionId,
        studentEmail: selectedSession.studentEmail,
        studentName: "Current User", // You might want to get this from auth context
        rating: review.rating,
        comment: review.comment
      };

      const res = await axiosSecure.post('/reviews', reviewData);
      if (res.data.insertedId) {
        toast.success('Review submitted successfully!');
        setReview({ rating: 0, comment: '' });
        refetch();
      }
    } catch (err) {
      toast.error('Failed to submit review');
      console.error(err);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-yellow-400" />
    ));
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">My Booked Study Sessions</h1>
      
      {bookedSessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">You haven't booked any study sessions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedSessions.map((session) => (
            <motion.div
              key={session._id}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{session.sessionTitle}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    session.status === 'booked' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  {new Date(session.classStartDate).toLocaleDateString()} - {new Date(session.classEndDate).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Tutor:</p>
                    <p className="font-medium">{session.tutorName}</p>
                  </div>
                  <p className="text-lg font-bold text-purple-600">{session.registrationFee}৳</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => handleViewDetails(session)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <FaInfoCircle className="mr-2" />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Session Details Modal */}
      <Dialog open={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-xl">
            {selectedSession && (
              <div className="divide-y divide-gray-200">
                {/* Session Details */}
                <div className="p-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedSession.sessionTitle}
                  </Dialog.Title>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Tutor</p>
                      <p className="font-medium">{selectedSession.tutorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tutor Email</p>
                      <p className="font-medium">{selectedSession.tutorEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Fee</p>
                      <p className="font-medium">{selectedSession.registrationFee}৳</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{selectedSession.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Class Dates</p>
                      <p className="font-medium">
                        {new Date(selectedSession.classStartDate).toLocaleDateString()} - {' '}
                        {new Date(selectedSession.classEndDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booked On</p>
                      <p className="font-medium">
                        {new Date(selectedSession.bookedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                  
                  {sessionReviews.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {sessionReviews.map((rev) => (
                        <div key={rev._id} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{rev.studentName}</p>
                              <div className="flex items-center mb-2">
                                {renderStars(rev.rating)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-gray-700">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-6">No reviews yet for this session.</p>
                  )}

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit}>
                    <h4 className="text-md font-semibold mb-3">Add Your Review</h4>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReview({...review, rating: star})}
                            className="text-2xl focus:outline-none"
                          >
                            {star <= review.rating ? (
                              <FaStar className="text-yellow-400" />
                            ) : (
                              <FaRegStar className="text-yellow-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={review.comment}
                        onChange={(e) => setReview({...review, comment: e.target.value})}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsDetailModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
};

export default ViewBookedSession;