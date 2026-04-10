import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen bg-[#0a0f1c] font-sans overflow-hidden">
      {/* Background glowing meshes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-between p-12 sm:p-16 rounded-3xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] mx-4 my-8">
        
        <div className="flex flex-col items-center gap-8 text-center">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
            className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] invert"
          />
          
          <h1 className="max-w-2xl text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-sm">
            Welcome to the Glassmorphism Experience
          </h1>
          
          <p className="max-w-xl text-lg leading-relaxed text-white/70">
            Get started by editing{" "}
            <code className="bg-black/20 px-2 py-1 rounded-md font-mono text-cyan-300 border border-white/5">
              app/page.js
            </code>
            . Enjoy the premium, vibrant, and floating UI design.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-12 w-full sm:w-auto text-base font-medium">
          {/* Primary Button */}
          <a
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
              className="invert"
            />
            Deploy Now
          </a>
          
          {/* Secondary Button */}
          <a
            className="flex items-center justify-center rounded-xl backdrop-blur-md bg-white/5 border border-white/10 px-8 py-4 text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
