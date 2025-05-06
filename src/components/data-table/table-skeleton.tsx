type Column = {
  key: string;
  label: string;
  sortable?: boolean;
};

type TableSkeletonRowsProps = {
  bulkDeleteMode: boolean;
  columns: Column[];
};

export function TableSkeletonRows({
  bulkDeleteMode,
  columns,
}: TableSkeletonRowsProps) {
  return (
    <>
      {[...Array(5)].map((_, rowIndex) => (
        <tr key={rowIndex} className="h-12">
          {bulkDeleteMode && (
            <td className="px-6 py-3">
              <div className="bg-muted-foreground/10 h-4 w-4 rounded-md"></div>
            </td>
          )}
          {columns.map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-3">
              <div className="bg-muted-foreground/10 h-8 rounded-md"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
