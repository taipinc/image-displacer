import React, { useState, useCallback, useEffect } from 'react';
import ImageUploader from './ImageUploader'; // Assuming it's in the same directory
import SurfaceViewer from './SurfaceViewer'; // Assuming it's in the same directory
import './App.css'; // Import basic CSS

// Defaults
const DEFAULT_DISPLACEMENT_SCALE = 15;
const DEFAULT_FRAME_THICKNESS_ABS = 1.0; // Default frame thickness: 1 world unit
const DEFAULT_FRAME_COLOR = '#ffffff'; // Default frame color: white

function App() {
  // State for image URLs
  const [textureUrl, setTextureUrl] = useState(null);
  const [depthMapUrl, setDepthMapUrl] = useState(null);

  // State for displacement intensity
  const [displacementScale, setDisplacementScale] = useState(DEFAULT_DISPLACEMENT_SCALE);

  // State for Frame
  const [addFrame, setAddFrame] = useState(false);
  const [frameThicknessAbs, setFrameThicknessAbs] = useState(DEFAULT_FRAME_THICKNESS_ABS);
  const [frameColor, setFrameColor] = useState(DEFAULT_FRAME_COLOR);

  // State for GLTF Export Trigger
  const [exportTrigger, setExportTrigger] = useState(0);

  // --- Cleanup Logic ---
  const [urlsToRevoke, setUrlsToRevoke] = useState([]);
  const updateUrl = (setter, newUrl) => {
    setter(prevUrl => {
      if (prevUrl && prevUrl.startsWith('blob:')) {
        setUrlsToRevoke(prev => [...prev, prevUrl]);
      }
      return newUrl;
    });
  };
  useEffect(() => {
    if (urlsToRevoke.length > 0) {
      const urls = [...urlsToRevoke];
      setUrlsToRevoke([]);
      urls.forEach(url => {
        console.log("App: Revoking old Object URL:", url);
        URL.revokeObjectURL(url);
      });
    }
  }, [urlsToRevoke]);

  // --- Handlers ---
  const handleTextureChange = useCallback((url) => updateUrl(setTextureUrl, url), []);
  const handleDepthMapChange = useCallback((url) => updateUrl(setDepthMapUrl, url), []);
  const handleScaleChange = (event) => setDisplacementScale(parseFloat(event.target.value));
  const handleAddFrameChange = (event) => setAddFrame(event.target.checked);
  const handleFrameThicknessAbsChange = (event) => setFrameThicknessAbs(parseFloat(event.target.value));
  const handleFrameColorChange = (event) => setFrameColor(event.target.value);

  const handleReset = useCallback(() => {
     if (textureUrl && textureUrl.startsWith('blob:')) setUrlsToRevoke(prev => [...prev, textureUrl]);
     if (depthMapUrl && depthMapUrl.startsWith('blob:')) setUrlsToRevoke(prev => [...prev, depthMapUrl]);
    setTextureUrl(null);
    setDepthMapUrl(null);
    setDisplacementScale(DEFAULT_DISPLACEMENT_SCALE);
    setAddFrame(false);
    setFrameThicknessAbs(DEFAULT_FRAME_THICKNESS_ABS);
    setFrameColor(DEFAULT_FRAME_COLOR);
  }, [textureUrl, depthMapUrl]);

  // GLTF Export Handler
  const handleExport = () => {
    if (textureUrl && depthMapUrl) {
      console.log("App: Triggering GLTF Export...");
      setExportTrigger(c => c + 1);
    } else {
        console.warn("App: Cannot export, missing texture or depth map.");
    }
  };


  return (
    <div className="app-container">
      {/* Left Panel: Controls */}
      <div className="control-panel">
        <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          3D Displacement Map Viewer
        </h1>

        {/* --- NEW: Instructions Section --- */}
        <div className="mb-6 p-3 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-600 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            <h2 className="font-semibold mb-1">Generate Depth Maps:</h2>
            <p>
                You can generate 8-bit grayscale depth maps from your images using AI tools like Depth Anything V2.
            </p>
            <p className="mt-1">
                Visit the Hugging Face Space:
                <a
                    href="https://huggingface.co/spaces/depth-anything/Depth-Anything-V2"
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                    className="ml-1 font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Depth Anything V2
                </a>
            </p>
             <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                (Ensure you download the 8-bit grayscale version for use here).
            </p>
        </div>
        {/* --- End Instructions Section --- */}


        {/* Image Upload Component */}
        <ImageUploader
          onTextureChange={handleTextureChange}
          onDepthMapChange={handleDepthMapChange}
          onReset={handleReset}
        />

        {/* Settings Section */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                Settings
            </h2>
            {/* ... (Displacement Scale Slider) ... */}
             <div>
                <label htmlFor="displacementScale" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Displacement Scale: {displacementScale.toFixed(1)}
                </label>
                <input id="displacementScale" type="range" min="0" max="100" step="0.5" value={displacementScale} onChange={handleScaleChange} className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:accent-blue-400" disabled={!depthMapUrl} />
            </div>

            {/* Frame Controls Group */}
            <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-3 space-y-3">
                 <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Frame Options</legend>
                 {/* ... (Frame Checkbox) ... */}
                 <div className="flex items-center">
                    <input id="addFrame" type="checkbox" checked={addFrame} onChange={handleAddFrameChange} className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700" disabled={!depthMapUrl || !textureUrl} />
                    <label htmlFor="addFrame" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"> Add Outer Frame </label>
                </div>
                 {/* ... (Frame Thickness Slider) ... */}
                 {addFrame && ( <div> <label htmlFor="frameThicknessAbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Frame Width (World Units): {frameThicknessAbs.toFixed(1)} </label> <input id="frameThicknessAbs" type="range" min="0.1" max="5" step="0.1" value={frameThicknessAbs} onChange={handleFrameThicknessAbsChange} className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:accent-blue-400" disabled={!depthMapUrl || !textureUrl} /> </div> )}
                 {/* ... (Frame Color Picker) ... */}
                 {addFrame && ( <div> <label htmlFor="frameColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> Frame Color: </label> <input id="frameColor" type="color" value={frameColor} onChange={handleFrameColorChange} className="w-full h-8 p-0 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer" disabled={!depthMapUrl || !textureUrl} /> </div> )}
            </fieldset>
        </div>

         {/* Export Button */}
         <div className="mt-6">
            <button
                onClick={handleExport}
                disabled={!textureUrl || !depthMapUrl}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Export as GLB Model
            </button>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                Exports the current mesh with texture as a .glb file.
            </p>
         </div>


         {/* How to Use Instructions Box */}
         <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 shadow">
             <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">How to Use This Tool:</h3>
            <ol className="list-decimal list-inside space-y-1">
                <li>Upload a color texture image.</li>
                <li>Upload an 8-bit grayscale depth map (white=high, black=low).</li>
                <li>Adjust the 'Displacement Scale' slider.</li>
                <li>Optionally, add an outer frame, adjust its width and color.</li>
                <li>Click the 'Export as GLB Model' button to download.</li>
                <li>Click & drag in the right panel to rotate.</li>
                <li>Scroll or pinch to zoom.</li>
                 <li>Right-click & drag (or two-finger drag) to pan.</li>
            </ol>
             <p className="mt-3 text-red-600 dark:text-red-400 font-medium">
                Note: 16-bit depth maps require pre-conversion to 8-bit grayscale for browser use.
             </p>
        </div>
      </div>

      {/* Right Panel: 3D Viewer */}
      <div className="viewer-panel">
        <SurfaceViewer
          textureUrl={textureUrl}
          depthMapUrl={depthMapUrl}
          displacementScale={displacementScale}
          addFrame={addFrame}
          frameThicknessAbs={frameThicknessAbs}
          frameColor={frameColor}
          exportTrigger={exportTrigger}
        />
      </div>
    </div>
  );
}

export default App;
