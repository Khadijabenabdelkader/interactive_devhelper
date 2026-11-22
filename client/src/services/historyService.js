
import axios from "axios";

const historyApi = axios.create({
  baseURL: "http://localhost:5000/api/ai"
});

historyApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getHistory = async () => {
  const response = await historyApi.get("/");
  return response.data.history;
};

export const getHistoryById = async (id) => {
  const response = await historyApi.get(`/${id}`);
  return response.data.history;
};

export const deleteHistory = async (id) => {
  const response = await historyApi.delete(`/${id}`);
  return response.data;
};

export const downloadHistoryFile = async (id, filename) => {
  const response = await historyApi.get(`/${id}/download`, {
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
