import ExcelJS from "exceljs";
import type { SheetInput } from "./normalize.ts";

function cellText(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "object") {
    if ("result" in v) return cellText(v.result as ExcelJS.CellValue); // formula
    if ("richText" in v) return v.richText.map((t) => t.text).join("");
    if ("text" in v) return String(v.text); // hyperlink
    if ("error" in v) return "";
  }
  return String(v);
}

/** Reads every worksheet of an .xlsx buffer into a matrix of strings. */
export async function readWorkbook(buffer: ArrayBuffer): Promise<SheetInput[]> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const sheets: SheetInput[] = [];
  wb.eachSheet((ws) => {
    const rows: string[][] = [];
    ws.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const cells: string[] = [];
      for (let c = 1; c <= ws.columnCount; c++) cells.push(cellText(row.getCell(c).value).trim());
      rows[rowNumber - 1] = cells;
    });
    sheets.push({ name: ws.name, rows: Array.from(rows, (r) => r ?? []) });
  });
  return sheets;
}
