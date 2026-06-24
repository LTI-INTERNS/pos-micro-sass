import type { HookData } from "jspdf-autotable";

export type ExportColumn = {
  key: string;
  label: string;
};

export type PDFOptions = {
  title?: string;
  subtitle?: string;
  orientation?: "portrait" | "landscape";
  accentColor?: [number, number, number];
  footer?: string;
};

export type RowData = Record<string, unknown>;

export type PDFSection =
  | {
      kind: "text";
      title?: string;
      lines: string[];
    }
  | {
      kind: "image";
      title?: string;
      dataUrl: string; // PNG/JPEG data URL
    };


export function useCSVExport<T extends RowData>() {
  return function exportToCSV(
    data: T[],
    filename: string,
    columns?: ExportColumn[]
  ) {
    if (!data || !data.length) return;

    const keys = columns
      ? columns.map((c) => c.key)
      : (Object.keys(data[0]) as string[]);

    const headers = columns ? columns.map((c) => c.label) : keys;

    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        keys.map((k) => `"${row[k] ?? ""}"`).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    triggerDownload(blob, ensureExt(filename, ".csv"));
  };
}


export function usePDFExport<T extends RowData>() {
  return async function exportToPDF(
    data: T[],
    filename: string,
    columns?: ExportColumn[],
    options: PDFOptions = {},
    sections: PDFSection[] = [],
    includeTable: boolean = true
  ) {
    if ((!data || !data.length) && includeTable) return;

    const [jsPDFModule, autoTableModule] = await Promise.all([
      import("jspdf").catch(() => {
        console.error(
          '[exportUtils] "jspdf" package not found. Run: npm install jspdf jspdf-autotable'
        );
        return null;
      }),
      import("jspdf-autotable").catch(() => {
        console.error(
          '[exportUtils] "jspdf-autotable" package not found. Run: npm install jspdf jspdf-autotable'
        );
        return null;
      }),
    ]);

    if (!jsPDFModule || !autoTableModule) return;

    const { jsPDF } = jsPDFModule;
    const autoTable = autoTableModule.default;
    const accent = options.accentColor ?? [255, 92, 0];

    const doc = new jsPDF({
      orientation: options.orientation ?? "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth  = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.rect(0, 0, pageWidth, 60, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(options.title ?? "Report", margin, 36);

    if (options.subtitle) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(options.subtitle, margin, 52);
    }

    const now = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(`Generated: ${now}`, pageWidth - margin, 36, { align: "right" });

    let cursorY = 76;

    // Optional sections (summary, charts, etc.)
    if (sections.length) {
      doc.setTextColor(53, 53, 53);
      for (const section of sections) {
        // Add a little spacing between sections
        cursorY += 10;
        if (cursorY > pageHeight - 80) {
          doc.addPage();
          cursorY = margin;
        }

        if (section.title) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(section.title, margin, cursorY);
          cursorY += 16;
        }

        if (section.kind === "text") {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          for (const line of section.lines) {
            const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2);
            for (const w of wrapped) {
              if (cursorY > pageHeight - 60) {
                doc.addPage();
                cursorY = margin;
              }
              doc.text(String(w), margin, cursorY);
              cursorY += 14;
            }
          }
        } else if (section.kind === "image") {
          try {
            const docWithImage = doc as { getImageProperties?: (url: string) => { width: number; height: number } };
            const props = docWithImage.getImageProperties
              ? docWithImage.getImageProperties(section.dataUrl)
              : null;
            const maxW = pageWidth - margin * 2;
            const imgW = maxW;
            const imgH = props?.height && props?.width
              ? (props.height * imgW) / props.width
              : 200;

            if (cursorY + imgH > pageHeight - 40) {
              doc.addPage();
              cursorY = margin;
            }

            doc.addImage(section.dataUrl, "PNG", margin, cursorY, imgW, imgH);
            cursorY += imgH + 6;
          } catch (e) {
            console.error("[exportUtils] Failed to add image section", e);
          }
        }
      }
    }

    if (includeTable) {
      if (!data || !data.length) return;

      const keys = columns
        ? columns.map((c) => c.key)
        : (Object.keys(data[0]) as string[]);

      const headers = columns ? columns.map((c) => c.label) : keys;

      const rows = data.map((row) =>
        keys.map((k) => String(row[k] ?? ""))
      );

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: Math.max(cursorY + 6, 76),
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 6,
          font: "helvetica",
          textColor: [53, 53, 53],
        },
        headStyles: {
          fillColor: accent,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [255, 247, 241],
        },
        columnStyles: {},
        didDrawPage: (hookData: HookData) => {
          const footerY = pageHeight - 20;
          doc.setFontSize(8);
          doc.setTextColor(179, 179, 179);

          const footerText = options.footer ?? "Generated by Reports System";
          doc.text(footerText, margin, footerY);

          doc.text(
            `Page ${hookData.pageNumber}`,
            pageWidth - margin,
            footerY,
            { align: "right" }
          );

          doc.setDrawColor(228, 228, 228);
          doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
        },
      });
    }

    doc.save(ensureExt(filename, ".pdf"));
  };
}


function ensureExt(filename: string, ext: string) {
  return filename.endsWith(ext) ? filename : `${filename}${ext}`;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}