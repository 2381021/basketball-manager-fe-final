import { useState } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface CommentFormProps {
  // Assuming the mutation expects an object like { content: string, gameId: string }
  // Adjust the 'any' type if you have a more specific type for the mutation variables
  mutation: UseMutateFunction<AxiosResponse<any, any>, Error, { content: string; gameId: string }, unknown>;
  // Add optional props for status feedback (loading, success, error) if needed
  isLoading?: boolean;
}

const CommentForm = ({ mutation, isLoading }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [gameId, setGameId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation example (optional)
    if (!content.trim() || !gameId.trim()) {
        alert("Please fill in both content and Game ID.");
        return;
    }
    mutation({ content, gameId });
    // Optional: Clear form after submission (depends on desired UX)
    // setContent("");
    // setGameId("");
  };

  return (
    // --- Form Container Enhancements ---
    <form
      onSubmit={handleSubmit}
      className="
        mt-8 p-6 bg-white dark:bg-gray-800
        rounded-xl shadow-lg
        border border-gray-200 dark:border-gray-700
        max-w-lg mx-auto  // Center the form and limit width
        transition-all duration-300 ease-in-out // Smooth transition for potential future changes
      "
    >
      <div className="space-y-6">
        {/* --- Content Textarea --- */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Comment
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <textarea
              id="content"
              name="content"
              rows={4} // Slightly larger text area
              className="
                block w-full px-4 py-3
                rounded-md border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-700
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400
                focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-800
                transition-all duration-200 ease-in-out // Smooth transitions for focus/hover
                hover:border-gray-400 dark:hover:border-gray-500 // Subtle hover border change
                sm:text-sm
              "
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading} // Disable while loading
            />
          </div>
        </div>

        {/* --- Game ID Input --- */}
        <div>
          <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Game ID
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="gameId"
              name="gameId"
              className="
                block w-full px-4 py-3
                rounded-md border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-700
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400
                focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-800
                transition-all duration-200 ease-in-out // Smooth transitions
                hover:border-gray-400 dark:hover:border-gray-500 // Subtle hover border change
                sm:text-sm
              "
              placeholder="e.g., 12345"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              disabled={isLoading} // Disable while loading
            />
          </div>
        </div>

        {/* --- Submit Button --- */}
        <div>
          <button
            type="submit"
            disabled={isLoading} // Disable button when mutation is in progress
            className={`
              flex w-full justify-center items-center rounded-md border border-transparent
              py-3 px-4  // Slightly larger padding
              text-sm font-semibold text-white // Bolder text
              shadow-md // Slightly stronger shadow
              transition-all duration-300 ease-in-out // Smooth transitions for hover/active/disabled
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
              ${
                isLoading
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' // Disabled state styles
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-[0.98] active:shadow-sm' // Active state styles with gradient
              }
            `}
          >
            {isLoading ? (
              // Simple spinner example (requires SVG or another element)
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Add Comment'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;