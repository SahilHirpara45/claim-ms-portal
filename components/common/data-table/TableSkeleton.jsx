import {
    TableCell,
    TableRow
} from "@/components/ui/table";
import { Skeleton } from "../skeleton/skeleton";

const TableSkeleton = ({ columns }) => {
  const skeletonRows = Array.from({ length: 5 }, (_, index) => (
    <TableRow key={index}>
      {columns.map((column, colIndex) => (
        <TableCell key={colIndex}>
          <Skeleton className="w-full h-3 mb-2" />
        </TableCell>
      ))}
    </TableRow>
  ));

  return <>{skeletonRows}</>;
};

export default TableSkeleton;
