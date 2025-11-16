import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

export interface ILogItem {
  _id: string;
  feedURL: string;
  createdAt: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedCount: number;
}

interface LogTableProps {
  logs: ILogItem[];
}

export default function LogTable({ logs }: LogTableProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>File Name</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>Total Fetched</TableCell>
            <TableCell>Total Imported</TableCell>
            <TableCell>New</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell>Failed</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No logs available
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.feedURL}</TableCell>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{log.totalFetched}</TableCell>
                <TableCell>{log.totalImported}</TableCell>
                <TableCell>{log.newJobs}</TableCell>
                <TableCell>{log.updatedJobs}</TableCell>
                <TableCell>{log.failedCount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
