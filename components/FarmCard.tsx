
import React, { useState } from 'react';
import { Farm, User, Review } from '../types';
import { LocationIcon, StarIcon, ExternalLinkIcon, MailIcon } from './Icons';
import StarRating from './StarRating';

interface FarmCardProps {
    farm: Farm;
    currentUser: User | null;
    onAddReview: (farmId: string, reviewData: { rating: number; text: string }) => void;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, currentUser, onAddReview }) => {
    const [showReviews, setShowReviews] = useState(false);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(0);

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReviewRating > 0 && newReviewText.trim() !== '') {
            onAddReview(farm.id, { rating: newReviewRating, text: newReviewText });
            setNewReviewText('');
            setNewReviewRating(0);
        }
    };

    return (
        <div className="bg-background-card rounded-lg border border-border-gray shadow-sm overflow-hidden mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-1 p-4">
                    <img src={farm.images[0]} alt={farm.name} className="w-full h-40 object-cover rounded-lg" />
                    <img src={farm.images[1]} alt={farm.name} className="w-full h-40 object-cover rounded-lg" />
                </div>
                <div className="md:col-span-2 p-4 flex flex-col">
                    <h3 className="text-2xl font-bold text-primary">{farm.name}</h3>
                    <div className="flex items-center text-text-gray mt-1">
                        <LocationIcon className="w-5 h-5 mr-2" />
                        <span>{farm.location}, {farm.region}</span>
                    </div>
                    <div className="flex items-center my-2">
                        <StarRating rating={farm.rating} />
                        <span className="ml-2 text-text-gray text-sm">({farm.reviews.length} reviews)</span>
                    </div>
                    <p className="text-text-gray flex-grow">{farm.description}</p>
                    <div className="flex flex-wrap gap-2 my-4">
                        {farm.tags.map(tag => (
                            <span key={tag} className="bg-tag-bg text-gray-700 px-3 py-1 text-sm rounded-full">{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4 text-sm mt-auto pt-4 border-t border-border-gray">
                        <a href={`mailto:${farm.contact}`} className="flex items-center text-primary hover:underline">
                            <MailIcon className="w-4 h-4 mr-1" /> Contact
                        </a>
                        <a href={farm.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                            <ExternalLinkIcon className="w-4 h-4 mr-1" /> Website
                        </a>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-border-gray">
                <button onClick={() => setShowReviews(!showReviews)} className="text-primary font-semibold">
                    {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                </button>
                {showReviews && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-2">Reviews</h4>
                        {farm.reviews.length > 0 ? (
                            farm.reviews.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(review => (
                                <div key={review.id} className="border-b border-border-gray py-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{review.userName}</p>
                                            <p className="text-xs text-text-gray">{new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="mt-1 text-gray-800">{review.text}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-gray">No reviews yet.</p>
                        )}
                        {currentUser && (
                             <form onSubmit={handleReviewSubmit} className="mt-4 border-t border-border-gray pt-4">
                                <h5 className="font-semibold mb-2">Add Your Review</h5>
                                <div className="mb-2">
                                    <StarRating rating={newReviewRating} onRatingChange={setNewReviewRating} interactive={true} />
                                </div>
                                <textarea
                                    value={newReviewText}
                                    onChange={(e) => setNewReviewText(e.target.value)}
                                    className="w-full p-2 border border-border-gray rounded-md"
                                    placeholder="Share your experience..."
                                    rows={3}
                                    required
                                ></textarea>
                                <button type="submit" className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition">
                                    Submit Review
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmCard;
