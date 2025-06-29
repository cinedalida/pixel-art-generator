/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HUGGING_FACE_TOKEN: string;
  // add more custom env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
