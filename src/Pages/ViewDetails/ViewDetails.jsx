import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import {
  FaStar, FaCalendarAlt, FaUserGraduate, FaChalkboardTeacher,
  FaMoneyCheckAlt, FaClock, FaRegStar, FaStarHalfAlt
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router';

const ViewDetails = () => {
  const { state } = useLocation();
  const session = state?.session;
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  if (!session) return <p className="text-center text-red-500">Session not found.</p>;

  const now = dayjs();
  const isRegistrationOpen =
    now.isAfter(dayjs(session.registrationStartDate)) &&
    now.isBefore(dayjs(session.registrationEndDate));

  const disableBooking =
    !user || role === 'admin' || role === 'tutor' || !isRegistrationOpen;

  // Get all reviews for this session
  const { data: reviews = [] } = useQuery({
    queryKey: ['session-reviews', session._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?sessionId=${session._id}`);
      return res.data;
    },
  });

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 'No ratings yet';

  // Submit Review
  const reviewMutation = useMutation({
    mutationFn: async () => {
      const reviewData = {
        sessionId: session._id,
        studentEmail: user.email,
        studentName: user.displayName,
        rating,
        comment: reviewText,
        createdAt: new Date(),
      };
      const res = await axiosSecure.post('/reviews', reviewData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Review submitted!');
      setRating(0);
      setReviewText('');
      queryClient.invalidateQueries(['session-reviews', session._id]);
    },
    onError: () => {
      toast.error('Failed to submit review');
    },
  });

  return (
    <motion.div className="max-w-6xl mx-auto px-6 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Session Info */}
      <motion.div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
          <FaChalkboardTeacher /> {session.sessionTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{session.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p><strong>Tutor:</strong> {session.tutorName}</p>
            <p><strong>Email:</strong> {session.tutorEmail}</p>
            <p className="flex items-center gap-2">
              <FaStar className="text-yellow-400" /> <strong>Avg. Rating:</strong> {averageRating}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2">
              <FaCalendarAlt /> <strong>Registration:</strong> {session.registrationStartDate} → {session.registrationEndDate}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt /> <strong>Classes:</strong> {session.classStartDate} → {session.classEndDate}
            </p>
            <p className="flex items-center gap-2">
              <FaClock /> <strong>Duration:</strong> {session.sessionDuration} weeks
            </p>
            <p className="flex items-center gap-2">
              <FaMoneyCheckAlt /> <strong>Fee:</strong> {session.registrationFee === 0 ? 'Free' : `${session.registrationFee}৳`}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            disabled={disableBooking}
            className={`btn btn-primary w-full font-semibold ${disableBooking && 'btn-disabled'}`}
          >
            {isRegistrationOpen ? 'Book Now' : 'Registration Closed'}
          </button>
        </div>
      </motion.div>

      {/* Review Form */}
      {user && role === 'student' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-12">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">Leave a Review</h3>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white mb-4"
            placeholder="Write your review here..."
          />

          <div className="flex items-center gap-4 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <FaStar />
              </button>
            ))}
            <span className="text-sm text-gray-500">{rating} / 5</span>
          </div>

          <button
            onClick={() => reviewMutation.mutate()}
            disabled={!rating || !reviewText}
            className="btn btn-outline btn-success rounded-full"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Show All Reviews */}
      <div>
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">Student Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-slate-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {review.studentName}
                  </h4>
                  <span className="flex text-yellow-400 text-sm">
                    {[...Array(review.rating)].map((_, idx) => (
                      <FaStar key={idx} />
                    ))}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ViewDetails;
