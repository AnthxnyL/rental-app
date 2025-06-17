function LongButton({ text, onClick, disabled = false }) {
  return (
    <>
      <button
        className="bg-black text-red-500 font-bold py-2 px-4 rounded w-full hover:bg-blue-700 transition duration-300 ease-in-out"
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
      <div className="bg-secondary text-white mt-4">Test</div>
    </>
  );
}

export default LongButton;