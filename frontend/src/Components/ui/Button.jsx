export default function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition ${className}`}
    >
      {children}
    </button>
  );
}
