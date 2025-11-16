"use client";

import { Box, Button, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: 400,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Job Importer System
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, opacity: 0.7 }}>
          MERN Stack Assignment
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push("/jobs")}
          >
            View Jobs
          </Button>

          <Button
            variant="outlined"
            onClick={() => router.push("/logs")}
          >
            View Import Logs
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
