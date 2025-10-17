import React, { useState } from "react";
import { registerPatient } from "../services/api";
import HealthCardPreview from "../components/HealthCardPreview";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "", dob: "", nic: "", gender: "",
    email: "", phone: "", address: "", emergencyContact: "",
    medicalInfo: { bloodType: "", allergies: [], chronicConditions: [] },
  });
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    try {
      const res = await registerPatient(formData);
      setResponse(res.data);
      setStep(5);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {step === 1 && <Step1Personal formData={formData} setFormData={setFormData} setStep={setStep} />}
      {step === 2 && <Step2Contact formData={formData} setFormData={setFormData} setStep={setStep} />}
      {step === 3 && <Step3Medical formData={formData} setFormData={setFormData} setStep={setStep} />}
      {step === 4 && (
        <Step4Review formData={formData} setStep={setStep} onSubmit={handleSubmit} />
      )}
      {step === 5 && <HealthCardPreview data={response} />}
    </div>
  );
}
