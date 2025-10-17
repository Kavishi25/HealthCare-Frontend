import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const registerPatient = (data) => 
    API.post("/patients/register", data);