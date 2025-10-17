import React from "react";

export default function HealthCardPreview({ data }) {
  if (!data) return null;
  const { patient, healthCard } = data;

  return (
    <div className="border rounded-xl p-6 shadow-md bg-white text-center">
      <h2 className="text-xl font-bold mb-4">Digital Health Card</h2>
      <img src={healthCard.qrCodeUrl} alt="QR Code" className="mx-auto w-48" />
      <p className="mt-4 font-semibold">{patient.fullName}</p>
      <p>ID: {healthCard.cardId}</p>
      <p>Status: {healthCard.status}</p>
      <p>Valid Until: {new Date(healthCard.validUntil).toLocaleDateString()}</p>
    </div>
  );
}
