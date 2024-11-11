"use client";

import { Suspense } from "react";
import { Loading } from "@/app/components/common/Loading";
import { ErrorMessage } from "@/app/components/common/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { getTemplate } from "@/app/lib/api";
import DesignTemplateForm from "@/app/components/forms/DesignTemplateForm";
import { Image } from "@/app/components/common/Image";

export default function EditDesignTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  const {
    data: template,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["template", params.id],
    queryFn: () => getTemplate(parseInt(params.id)),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Design Template</h1>
      <div className="flex gap-6">
        <div className="w-4/5">
          <Suspense fallback={<Loading />}>
            <DesignTemplateForm initialData={template} />
          </Suspense>
        </div>
        <div className="w-1/5">
          <Suspense fallback={<Loading />}>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Template Preview</h2>
              {template?.image_url && (
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={template.image_url}
                    alt={template.description}
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-gray-400 text-sm mt-4">
                Created:{" "}
                {template?.created_at
                  ? new Date(template.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-gray-400 text-sm">
                Last updated:{" "}
                {template?.updated_at
                  ? new Date(template.updated_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
