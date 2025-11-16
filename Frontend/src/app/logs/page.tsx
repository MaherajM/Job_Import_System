"use client";

import { Box, Button, CircularProgress, Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LogTable from "../../components/UI/LogsTable";
import { fetchImportLogs } from "../../services/logs.service";

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, error, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["importLogs", page],
    queryFn: () => fetchImportLogs(page, limit),
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <p>Loading logs...</p>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "red" }}>
        Failed to load logs.
      </Box>
    );

  const logs = data?.logs ?? [];

  return (
    <div style={{ padding: 20 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Import Logs</h1>

        <Button
          variant="contained"
          size="small"
          sx={{ fontSize: 10 }}
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          {isRefetching ? "Refreshing..." : "Refresh Logs"}
        </Button>
      </Box>

      <LogTable logs={logs} />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={data?.totalPages ?? 1}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>
    </div>
  );
}
