import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebaseConfig';
import toast from 'react-hot-toast';
import Button from '../../components/Button';



interface Review {
  id: string;
  name: string;
  work: string;
  place: string;
  review: string;
  avatarUrl: string;
}

const ManageReview = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentReviewId, setCurrentReviewId] = useState<string>('');
  
  // Form states
  const [name, setName] = useState<string>('');
  const [work, setWork] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsCollection = collection(db, 'reviews');
      const reviewSnapshot = await getDocs(reviewsCollection);
      const reviewsList = reviewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      
      setReviews(reviewsList);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName('');
    setWork('');
    setPlace('');
    setReviewText('');
    setAvatar(null);
    setAvatarPreview('');
    setIsEditing(false);
    setCurrentReviewId('');
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditReview = (review: Review) => {
    setName(review.name);
    setWork(review.work);
    setPlace(review.place);
    setReviewText(review.review);
    setAvatarPreview(review.avatarUrl);
    setIsEditing(true);
    setCurrentReviewId(review.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let avatarUrl = avatarPreview;
      
      // Upload new avatar if provided
      if (avatar) {
        const avatarRef = ref(storage, `reviews/${Date.now()}_${avatar.name}`);
        const uploadResult = await uploadBytes(avatarRef, avatar);
        avatarUrl = await getDownloadURL(uploadResult.ref);
      }
      
      const reviewData = {
        name,
        work,
        place,
        review: reviewText,
        avatarUrl,
        createdAt: new Date()
      };
      
      if (isEditing) {
        // Update existing review
        await updateDoc(doc(db, 'reviews', currentReviewId), reviewData);
        toast.success('Review updated successfully');
      } else {
        // Add new review
        await addDoc(collection(db, 'reviews'), reviewData);
        toast.success('Review added successfully');
      }
      
      handleCloseModal();
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id: string, avatarUrl: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setLoading(true);
        
        // Delete the document from Firestore
        await deleteDoc(doc(db, 'reviews', id));
        
        // Delete the avatar from Storage if it exists
        if (avatarUrl) {
          try {
            // Extract the path from the URL
            const avatarRef = ref(storage, avatarUrl);
            await deleteObject(avatarRef);
          } catch (storageError) {
            console.error('Error deleting avatar:', storageError);
            // Continue even if avatar deletion fails
          }
        }
        
        toast.success('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full mx-4">
      <div className="flex justify-between items-center mb-6">
      <h1 className="md:text-4xl text-3xl font-bold text-center md:text-start lancelot mb-4 md:mb-6 text-white">Manage Reviews</h1>
        <Button 
          onClick={handleOpenModal}
          variant='primary'
        >
          Add New Review
        </Button>
      </div>

      {loading && <div className="text-center py-4">Loading...</div>}

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Avatar</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Work</th>
              <th className="py-2 px-4 border-b text-left">Place</th>
              <th className="py-2 px-4 border-b text-left">Review</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">No reviews found</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <img 
                      src={review.avatarUrl || '/placeholder-avatar.png'} 
                      alt={`${review.name}'s avatar`} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{review.name}</td>
                  <td className="py-2 px-4 border-b">{review.work}</td>
                  <td className="py-2 px-4 border-b">{review.place}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="max-w-xs truncate">{review.review}</div>
                  </td>
                  <td className="py-2 px-4 flex border-b">
                    <button 
                      onClick={() => handleEditReview(review)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteReview(review.id, review.avatarUrl)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Review' : 'Add New Review'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Work</label>
                <input
                  type="text"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Place</label>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full p-2 border rounded"
                />
                {avatarPreview && (
                  <div className="mt-2">
                    <img 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      className="w-20 h-20 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant='secondary'
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant='success'
                  disabled={loading}
                >
                  {loading ? 'Saving...' : isEditing ? 'Update Review' : 'Add Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReview;
