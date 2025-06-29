import React, { useState, useCallback } from "react";
import { generatePixelArt } from "./services/huggingFaceService";
import { Spinner } from "./components/Spinner";
import { MagicWandIcon, ImageIcon } from "./components/Icons";

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!prompt.trim() || isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);
      setImageUrl(null);

      try {
        const generatedImageUrl = await generatePixelArt(prompt);
        setImageUrl(generatedImageUrl);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "An unexpected error occurred.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, isLoading]
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-press-start text-purple-400 mb-2">
            Pixel Art Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Bring your ideas to life in glorious pixel art using AI.
          </p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          {/* Control Panel */}
          <div className="w-full lg:w-1/3">
            <form
              onSubmit={handleSubmit}
              className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700"
            >
              <label
                htmlFor="prompt"
                className="block text-xl font-bold mb-3 text-gray-200"
              >
                Enter your prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A flying dog"
                className="w-full h-32 p-3 bg-gray-900 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    Generating...
                  </>
                ) : (
                  <>
                    <MagicWandIcon />
                    Generate
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Image Display */}
          <div className="w-full lg:w-2/3">
            <div className="aspect-square bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center p-4">
              {isLoading && <Spinner size="lg" />}
              {error && (
                <div className="text-center text-red-400 animate-fade-in">
                  <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && imageUrl && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 animate-fade-in">
                  <img
                    src={imageUrl}
                    alt={prompt}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                  <a
                    href={imageUrl}
                    download={`pixel-art-${prompt
                      .substring(0, 20)
                      .replace(/\s/g, "_")}.jpeg`}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Download Image
                  </a>
                </div>
              )}
              {!isLoading && !error && !imageUrl && (
                <div className="text-center text-gray-500 animate-fade-in">
                  <ImageIcon />
                  <p className="mt-4 text-lg">
                    Your generated pixel art will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
