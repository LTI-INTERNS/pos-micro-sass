export function useCSVExport<T>() {
  return function exportToCSV(data: T[], filename: string) {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0] as any);

    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => `"${(row as any)[h]}"`).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };
}
