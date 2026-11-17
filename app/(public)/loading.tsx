export default function PublicLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[400px] bg-[#faf7f0] px-4 py-12 text-center text-sm text-[#73817b]"
    >
      Loading...
    </div>
  );
}