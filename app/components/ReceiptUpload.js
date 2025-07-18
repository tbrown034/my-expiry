'use client';

import { useState } from 'react';

export default function ReceiptUpload({ onReceiptAnalyzed, onClose, showToast }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze receipt: ${response.status}`);
      }

      const data = await response.json();
      
      if (onReceiptAnalyzed) {
        onReceiptAnalyzed(data);
      }
    } catch (error) {
      console.error('Error:', error);
      if (showToast) {
        showToast(`Failed to analyze receipt: ${error.message}`, 'error');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-green-800">PDF Support Added!</h4>
            <p className="text-xs text-green-700 mt-1">
              You can now upload PDF receipts directly. We&apos;ll extract the text automatically and identify all grocery items.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Receipt (Image, PDF, Text, or CSV)
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*,.pdf,.txt,.csv"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {file && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-gray-700">
            <strong>Selected:</strong> {file.name}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {file.type === "application/pdf" && "PDF files are supported! Text will be extracted automatically."}
            {file.type.startsWith("image/") && "Image files will be analyzed using AI vision."}
            {(file.type === "text/csv" || file.name.endsWith(".csv")) && "CSV files will be parsed for grocery items."}
            {file.type.startsWith("text/") && "Text files will be analyzed for grocery items."}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!file || isProcessing}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m12 2 0 4 m0 12 0 4 m10-10-4 0 m-12 0-4 0 m15.07-15.07-2.83 2.83 m-10.24 10.24-2.83 2.83 m0-10.24 2.83-2.83 m10.24 10.24 2.83 2.83"></path>
              </svg>
              <span>Analyzing Receipt...</span>
            </span>
          ) : (
            file?.type === 'application/pdf' ? 'Analyze PDF Receipt' : 'Upload & Analyze Receipt'
          )}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}