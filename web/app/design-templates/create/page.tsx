"use client";

import { Suspense, useEffect, useState } from "react";
import { Loading } from "@/app/components/common/Loading";
import DesignTemplateForm from "@/app/components/forms/DesignTemplateForm";
import { getTemplates, deleteTemplate } from "@/app/lib/api";
import { TemplateImage } from "@/app/types";
import { LazyLoadImage } from "@/app/components/common/LazyLoadImage";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { FaImage } from "react-icons/fa";

export default function CreateTemplatePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateImage[]>([]);

  useEffect(() => {
    // 獲取前五個模板
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates({ limit: 20 });
        console.log(data);
        setTemplates(data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("確定要刪除這個模板嗎？")) {
      try {
        await deleteTemplate(parseInt(id));
        setTemplates(
          templates.filter((template) => template.id !== parseInt(id))
        );
      } catch (error) {
        console.error("Failed to delete template:", error);
      }
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Design Template</h1>
      <div className="flex gap-6">
        <div className="w-4/5">
          <Suspense fallback={<Loading />}>
            <DesignTemplateForm />
          </Suspense>
        </div>
        <div className="w-1/5">
          <h2 className="text-lg font-semibold mb-4">Recent Templates</h2>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="relative group cursor-pointer hover:opacity-90 transition-all"
              >
                <div className="absolute left-1 top-1 z-10 bg-black bg-opacity-50 p-1 rounded-lg">
                  <FaImage className="w-4 h-4 text-white" />
                </div>
                <div
                  onClick={() =>
                    router.push(`/design-templates/${template.id}`)
                  }
                >
                  <LazyLoadImage
                    src={template.image_url}
                    alt={template.description}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                    wrapperClassName="w-full h-32"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {template.description}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(template.id.toString());
                  }}
                  className="absolute right-1 top-1 z-10 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  <FaTrash className="w-3 h-3" />
                  刪除
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
