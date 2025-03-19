// ...existing code...
          <div className="mb-8">
            <label htmlFor="pdfFile" className="block mb-2 font-medium">
              Paper PDF *
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
              <input
                type="file"
                id="pdfFile"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="pdfFile"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {pdfFile ? (
                  <span className="text-blue-600 dark:text-blue-400">
                    {pdfFile.name}
                  </span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-300">
                    Click to upload PDF or drag and drop
                  </span>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Max file size: 10MB
                </span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Paper"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
