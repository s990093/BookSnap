import { TemplateImage } from "@/app/types";
import { motion } from "framer-motion";
import Image from "next/image";

interface TemplateSectionProps {
  templates: TemplateImage[];
  selectedTemplates: TemplateImage[];
  onTemplateToggle: (template: TemplateImage) => void;
}

export function TemplateSection({
  templates,
  selectedTemplates,
  onTemplateToggle,
}: TemplateSectionProps) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2 text-purple-400">Template Images:</h3>
      <div className="grid grid-cols-3 gap-4">
        {templates?.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.05 }}
            className={`relative h-32 border rounded cursor-pointer ${
              selectedTemplates.some((t) => t.id === template.id)
                ? "border-purple-500 border-2"
                : "border-gray-700"
            }`}
            onClick={() => onTemplateToggle(template)}
          >
            <Image
              src={template.image_url}
              alt={template.description}
              fill
              className="object-cover rounded"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-sm">
              {template.description}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
