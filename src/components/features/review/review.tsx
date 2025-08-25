import React, { useState } from "react";
import reviewsGetReviews, { Review } from "@/hooks/api/reviews/reviews-get-Reviews";
import { useUpdateReview } from "@/hooks/api/reviews/reviews-update-review";
import { useDeleteReview } from "@/hooks/api/reviews/reviews-delete-reviews";
import useAddReview from "@/hooks/api/reviews/reviews-add-review";
import reviewsGetByUserId from "@/hooks/api/reviews/reviews-getbyuserid";
import { mutate } from "swr";
import { Endpoints } from "@/lib/endpoints";
import { toast } from "sonner";

interface ReviewFormProps {
  bookId: string;
  onSubmit?: (review: { rating: number; comment: string }) => void;
}

export default function ReviewForm({ bookId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: userReviews } = reviewsGetByUserId(bookId);
  const { data: allReviews, isLoading: isLoadingAllReviews } = reviewsGetReviews(bookId);
  const { addReview, loading: adding } = useAddReview();
  const { updateReview, loading: updating } = useUpdateReview(editingReview?._id || "");
  const { deleteReview, loading: deleting } = useDeleteReview();
  const handleSubmit = async () => {
    try {
      if (!rating) {
        setError("Vui lòng chọn đánh giá");
        return;
      }
      if (!comment.trim()) {
        setError("Vui lòng nhập bình luận");
        return;
      }

      setError(null);
      await addReview({
        book_id: bookId,
        rating,
        comment: comment.trim()
      });
      
      setRating(0);
      setComment("");
      toast.success("Đánh giá đã được thêm thành công");
      
      if (onSubmit) {
        onSubmit({ rating, comment });
      }
      // Mutate both user reviews and all reviews
      mutate(Endpoints.Review.GET_BY_USER_BY_BOOK_ID(bookId));
      mutate(Endpoints.Review.GET_ALL(bookId));
    } catch (error: any) {
      console.error("Error adding review:", error);
    
      
      // Hiển thị message lỗi cụ thể từ backend nếu có
      let errorMessage = "Có lỗi xảy ra khi thêm đánh giá. Vui lòng thử lại sau.";
      
      // Debug: Log toàn bộ cấu trúc error để xem
      console.log("Error response data:", error?.response?.data?.message);
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.log("Using error.response.data.message:", errorMessage);
      } else {
        console.log("No specific error message found, using default");
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setError(null); // Clear error when starting to edit
  };

  const handleUpdate = async () => {
    try {
      if (editingReview) {
        await updateReview({ rating, comment });
        setEditingReview(null);
        setRating(0);
        setComment("");
        setError(null);
        toast.success("Đánh giá đã được cập nhật thành công");
      }
    } catch (error: any) {
      console.error("Error updating review:", error);
      
      let errorMessage = "Có lỗi xảy ra khi cập nhật đánh giá. Vui lòng thử lại sau.";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      setEditingReview(null);
      setError(null);
      toast.success("Đánh giá đã được xóa thành công");
    } catch (error: any) {
      console.error("Error deleting review:", error);
      
      let errorMessage = "Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau.";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const filteredReviews = allReviews?.filter(review => review.book_id === bookId) || [];

  const canEditReview = (review: Review) => {
    return userReviews?.some(userReview => userReview.user_id === review.user_id);
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start space-x-4">
              <img
                className="w-16 h-16 rounded-full shadow-md"
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
                alt="avatar"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">
                  Thêm đánh giá
                </h3>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl text-yellow-400 hover:text-yellow-500 focus:outline-none"
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Nhập bình luận của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setRating(0);
                      setComment("");
                      setError(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={adding}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {adding ? "Đang gửi..." : "Gửi"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        

        {editingReview && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start space-x-4">
              <img
                className="w-16 h-16 rounded-full shadow-md"
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
                alt="avatar"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3">
                  Edit your review
                </h3>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl text-yellow-400 hover:text-yellow-500 focus:outline-none"
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="What is your view?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingReview(null);
                      setRating(0);
                      setComment("");
                      setError(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {isLoadingAllReviews ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reviews...</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <img
                        className="w-10 h-10 rounded-full mr-3"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
                        alt="avatar"
                      />
                      <div>
                        <h4 className="font-semibold">User</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="text-yellow-400 text-lg"
                        >
                          {star <= review.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                  <div className="flex space-x-2">
                    {canEditReview(review) && (
                      <>
                        <button
                          onClick={() => handleEdit(review)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          disabled={deleting}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}