import { useRef } from "react";
import { Eye, RefreshCcw, Trash2 } from "lucide-react";

export default function FileList({ files, setFiles }) {
  // Helper for size formatting
  const formatSize = (size) => {
    if (size > 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + " MB";
    return (size / 1024).toFixed(2) + " KB";
  };

  const uploadRefs = useRef({});

  const handleView = (file) => {
    const url = file.url || URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handleDelete = (category, idx) => {
    setFiles((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, index) => index !== idx),
    }));
  };

  const handleReupload = (category, idx) => {
    uploadRefs.current[`${category}-${idx}`].click();
  };

  const handleFileChange = (category, idx, e) => {
    const newFile = e.target.files[0];
    setFiles((prev) => ({
      ...prev,
      [category]: prev[category].map((file, i) => (i === idx ? newFile : file)),
    }));
  };

  // Filter categories with at least one file
  const categoriesWithFiles = Object.keys(files).filter(
    (category) => files[category].length > 0
  );

  return (
    <div className="space-y-6 border border-(--muted) rounded-2xl p-5">
    <h4>Uploaded Files</h4>
      {categoriesWithFiles.length === 0 && (
        <div className="text-gray-500">No files to display</div>
      )}
      {categoriesWithFiles.map((category) => (
        <div key={category}>
          <h4 className="mb-2 capitalize">
            {category.replace(/_/g, " ")}
          </h4>
          <div className="space-y-2">
            {files[category].map((file, idx) => (
              <div
                key={file.name + idx}
                className="flex items-center border border-(--muted) rounded-md px-3 py-2 bg-white shadow-sm overflow-x-auto"
              >
                <div className="mr-3">
                  <span className="inline-block w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xl">📄</span>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-sm">{file.name}</span>
                    <span className="border px-1 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                      {file.type?.split("/").pop() || "file"}
                    </span>
                    {file.projectTitle && (
                      <span className="ml-2 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {file.projectTitle}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center mt-1 text-xs text-gray-500">
                    <span>{formatSize(file.size ?? file.fileSize ?? 0)}</span>
                    {file.uploadDate && <span>• {file.uploadDate}</span>}
                    {file.status && (
                      <span className="ml-2 px-1 py-0.5 text-green-600 bg-green-50 border border-green-200 rounded text-xs">
                        {file.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center ml-4 gap-2">
                  <button
                    title="View"
                    className="hover:bg-gray-50 p-1 rounded"
                    onClick={() => handleView(file)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    title="Re-upload"
                    className="hover:bg-gray-50 p-1 rounded"
                    onClick={() => handleReupload(category, idx)}
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    ref={(el) => (uploadRefs.current[`${category}-${idx}`] = el)}
                    onChange={(e) => handleFileChange(category, idx, e)}
                  />
                  <button
                    title="Delete"
                    className="hover:bg-gray-50 p-1 rounded"
                    onClick={() => handleDelete(category, idx)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
