function LongButton({ text, onClick, disabled = false }) {
  return (
    <button
      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default LongButton;