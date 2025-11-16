import axios from "axios";

export async function fetchImportLogs(page: number, limit: number) {
  const res = await axios(`http://localhost:8070/api/logs?page=${page}&limit=${limit}`);
  return res.data;
}
