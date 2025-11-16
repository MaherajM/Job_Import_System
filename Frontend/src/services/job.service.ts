import axios from "axios";

export async function fetchJobs(page = 1, limit = 10) {
  const res = await axios(`http://localhost:8070/api/jobs?page=${page}&limit=${limit}`);
  return res.data;
}