"use client";

import { Box, Button, CircularProgress, Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import JobTable from "../../components/UI/JobTable";
import { fetchJobs } from "../../services/job.service";

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, error, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["jobs", page],
    queryFn: () => fetchJobs(page, limit),
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <p>Loading jobs...</p>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "red" }}>
        Failed to load jobs.
      </Box>
    );

  return (
    <div style={{ padding: 20 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Imported Jobs</h1>

        <Button
          variant="contained"
          size="small"
          sx={{ fontSize: 10 }}
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          {isRefetching ? "Refreshing..." : "Refresh Data"}
        </Button>
      </Box>

      <JobTable jobs={data?.jobs ?? []} />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={data?.totalPages ?? 1}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </div>
  );
}
