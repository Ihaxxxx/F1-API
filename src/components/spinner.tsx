export default function Spinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center space-y-2 bg-black">
      <div className="h-10 w-10 border-4 border-t-red-500 border-white rounded-full animate-spin" />
      <p className="text-white text-sm">{text}</p>
    </div>
  );
}
