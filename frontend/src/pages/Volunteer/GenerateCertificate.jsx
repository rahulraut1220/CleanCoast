import React, { useEffect, useState } from "react";
import axios from "axios";

const GenerateCertificate = ({ userId }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`/api/certificates/user/${userId}`);
        setCertificates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [userId]);

  const handleDownload = (downloadLink) => {
    window.open(downloadLink, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-600 text-lg">Loading certificates...</p>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-red-500 text-lg font-medium">
          No certificates available yet. Please ensure you're marked present at
          events.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
        Your Certificates
      </h2>
      <div className="space-y-4">
        {certificates.map((cert, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {cert.title}
              </h3>
              <p className="text-sm text-gray-500">
                Issued on: {cert.issuedAt}
              </p>
            </div>
            <button
              onClick={() => handleDownload(cert.downloadLink)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
            >
              Download Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateCertificate;
