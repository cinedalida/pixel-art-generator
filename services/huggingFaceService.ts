// This service handles all interactions with the Hugging Face Inference API.

const HUGGING_FACE_API_URL =
  "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

/**
 * Generates pixel art from a user prompt using a Hugging Face Inference API.
 * @param userPrompt The text prompt from the user.
 * @returns A data URL string (base64) of the generated image.
 */
export const generatePixelArt = async (userPrompt: string): Promise<string> => {
  const huggingFaceToken = import.meta.env.VITE_HUGGING_FACE_TOKEN;

  if (
    !huggingFaceToken ||
    huggingFaceToken === "YOUR_HUGGING_FACE_TOKEN_HERE" ||
    huggingFaceToken.includes("hf_") === false
  ) {
    throw new Error(
      "Hugging Face token not set. Please open index.html, replace the placeholder with your token, and refresh the page."
    );
  }

  try {
    const fullPrompt = `pixel art of '${userPrompt}', 16-bit retro style, detailed, vibrant`;

    const response = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${huggingFaceToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
      }),
    });

    if (!response.ok) {
      // Try to parse the error message from Hugging Face for a better user experience.
      const errorBody = await response.json().catch(() => ({
        error: `Request failed with status ${response.status}`,
      }));

      // Handle the "model loading" case specifically.
      if (
        response.status === 503 &&
        errorBody.error?.includes("is currently loading")
      ) {
        throw new Error(
          "The model is warming up. Please wait a minute and try again."
        );
      }

      // Handle other errors, including invalid credentials.
      throw new Error(errorBody.error || `An unknown error occurred.`);
    }

    // Process the successful response from Hugging Face.
    const imageBlob = await response.blob();

    // Convert the image blob to a base64 data URL to display it in an <img> tag.
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
  } catch (error) {
    console.error("Error generating image with Hugging Face API:", error);
    if (error instanceof Error) {
      throw new Error(error.message); // Re-throw the specific error message.
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};
