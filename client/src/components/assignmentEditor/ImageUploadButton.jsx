import React, { useState } from 'react';

// Simple pluggable component. Replace `uploadToServer` with your real uploader
export default function ImageUploadButton({ onUploadedUrl }) {
  const [loading, setLoading] = useState(false);

  async function uploadToServer(file) {
    // stub: upload file to backend or cloud and return URL
    // For now convert to base64 as quick fallback
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.readAsDataURL(file);
    });
  }

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const url = await uploadToServer(file);
    onUploadedUrl(url);
    setLoading(false);
  };

  return (
    <label className="px-3 py-1 rounded hover:bg-gray-100 cursor-pointer">
      {loading ? 'Uploading...' : '📷 Image'}
      <input type="file" accept="image/*" onChange={handle} className="hidden" />
    </label>
  );
}