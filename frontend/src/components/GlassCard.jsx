export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white/20 backdrop-blur-xl border border-white/30 
                  shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                  rounded-2xl p-6 transition-all 
                  hover:bg-white/30 hover:shadow-[0_8px_40px_rgb(0,0,0,0.18)]
                  ${className}`}
    >
      {children}
    </div>
  );
}
