import { getHistoryAction } from "@/action/employeeAction/jobcard-action";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "activity",
    label: "Activity",
  },
  {
    key: "action",
    label: "Action",
  },
  {
    key: "createdAt",
    label: "Created At",
  },
];

const HistoryView = () => {
  const params = useParams();
  const jobCardId = params?.view_jobcard[0];

  const {
    data: getHistoryActionData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getHistoryAction", jobCardId],
    queryFn: () => {
      return getHistoryAction({
        jobCardId: jobCardId,
      });
    },
  });

  const users = getHistoryActionData?.data?.activityList;

  function formatDateTime(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center font-bold w-full">
        <div className="flex items-center w-full justify-between">
          <div>History Details</div>
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={`simple-table-${column.key}`}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Error fetching data
              </TableCell>
            </TableRow>
          ) : users && users.length > 0 ? (
            users.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.userDetails?.name || "-"}</TableCell>
                <TableCell>{item?.activity}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    color={
                      (item?.action === "add" && "default") ||
                      (item?.action === "edit" && "info") ||
                      (item?.action === "delete" && "warning") ||
                      (item?.action === "view" && "info") ||
                      (item?.action === "assign" && "success")
                    }
                    className="capitalize"
                  >
                    {item?.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-right min-w-[7rem]">
                  {formatDateTime(item?.createdAt)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No History now
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default HistoryView;
