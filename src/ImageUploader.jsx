import React, { useRef } from 'react';

/**
 * Component for handling file inputs for texture and depth map images.
 * @param {object} props - Component props.
 * @param {function} props.onTextureChange - Callback function when texture file changes. Receives object URL or null.
 * @param {function} props.onDepthMapChange - Callback function when depth map file changes. Receives object URL or null.
 * @param {function} props.onReset - Callback function to reset both inputs.
 */
function ImageUploader({ onTextureChange, onDepthMapChange, onReset }) {
  // Refs to access the input elements directly if needed (e.g., to clear them)
  const textureInputRef = useRef(null);
  const depthInputRef = useRef(null);

  /**
   * Handles the change event for a file input.
   * Creates an object URL for the selected file and calls the appropriate callback.
   * @param {Event} event - The file input change event.
   * @param {function} callback - The callback function (onTextureChange or onDepthMapChange).
   */
  const handleFileChange = (event, callback) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a temporary URL representing the selected file
      const objectUrl = URL.createObjectURL(file);
      callback(objectUrl); // Pass the URL to the parent component
    } else {
      callback(null); // No file selected or selection cancelled
    }
  };

  /**
   * Handles the reset button click.
   * Clears the file inputs and calls the onReset callback.
   */
  const handleResetClick = () => {
     // Clear the file input visually
    if (textureInputRef.current) {
        textureInputRef.current.value = '';
    }
    if (depthInputRef.current) {
        depthInputRef.current.value = '';
    }
    // Call the parent's reset handler to clear the URLs in state
    onReset();
  }

  return (
    // Using Tailwind classes for basic styling (ensure Tailwind is set up)
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
        Upload Images
      </h2>

      {/* Texture Input */}
      <div>
        <label htmlFor="textureInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          1. Color Texture:
        </label>
        <input
          ref={textureInputRef}
          id="textureInput"
          type="file"
          accept="image/png, image/jpeg, image/webp, image/avif" // Common image formats
          onChange={(e) => handleFileChange(e, onTextureChange)}
          className="block w-full text-sm text-gray-500 dark:text-gray-400 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer
                     file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0
                     file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300
                     hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
        />
      </div>

      {/* Depth Map Input */}
      <div>
        <label htmlFor="depthMapInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          2. Depth Map (8-bit Grayscale):
        </label>
        <input
          ref={depthInputRef}
          id="depthMapInput"
          type="file"
          accept="image/png, image/jpeg" // Grayscale often saved as PNG/JPG
          onChange={(e) => handleFileChange(e, onDepthMapChange)}
           className="block w-full text-sm text-gray-500 dark:text-gray-400 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer
                     file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0
                     file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300
                     hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
        />
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use an 8-bit grayscale image (PNG/JPG). White = high, Black = low.
         </p>
      </div>

       {/* Reset Button */}
      <button
        onClick={handleResetClick}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition duration-150 ease-in-out"
      >
        Reset Images
      </button>
    </div>
  );
}

export default ImageUploader;
