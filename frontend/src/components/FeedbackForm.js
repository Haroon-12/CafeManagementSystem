import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { toast } from "./ui/use-toast"
import { StarIcon } from 'lucide-react'

export default function FeedbackForm({ orderId, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [rating, setRating] = React.useState(0);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit({
        ...data,
        rating,
        order: orderId
      });
      toast({
        title: "Success",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setRating(star)}
              className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
            >
              <StarIcon className="h-6 w-6" />
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          {...register("comment", { required: "Please provide your feedback" })}
        />
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
        )}
      </div>
      <Button type="submit" disabled={rating === 0}>
        Submit Feedback
      </Button>
    </form>
  );
}
