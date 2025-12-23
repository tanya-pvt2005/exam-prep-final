export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-5 py-2.5 rounded-xl font-medium cursor-pointer
        bg-gradient-to-r from-blue-500/60 to-purple-500/60
        hover:from-blue-500 hover:to-purple-500
        text-white backdrop-blur-xl
        border border-white/20
        shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        hover:shadow-[0_6px_30px_rgba(0,0,0,0.20)]
        transition-all duration-300
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
}
