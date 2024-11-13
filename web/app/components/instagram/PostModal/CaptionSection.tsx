import toast from "react-hot-toast";

interface CaptionSectionProps {
  content: string;
}

export function CaptionSection({ content }: CaptionSectionProps) {
  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("已複製到剪貼板！");
  };

  return (
    <div className="mb-4 mt-4">
      <h3 className="font-semibold mb-2 text-purple-400">Caption:</h3>
      <div
        className="border border-gray-700 p-4 rounded bg-gray-900 hover:bg-gray-850 transition-colors cursor-pointer"
        onClick={() => handleCopyClick(content)}
      >
        {content}
      </div>
    </div>
  );
}
