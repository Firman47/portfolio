// src/aos.d.ts atau types/aos.d.ts
declare module "aos" {
  interface AOSOptions {
    duration?: number;
    delay?: number;
    easing?: string;
    once?: boolean;
    // Tambahkan properti lain yang didukung oleh AOS jika diperlukan
  }

  export function init(options?: AOSOptions): void;
  const AOS: { init: typeof init };
  export default AOS;
}
