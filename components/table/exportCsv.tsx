import jsPDF from "jspdf";
import "jspdf-autotable";
// Extend jsPDF with autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export type ExportFormat = "csv" | "pdf";

export function downloadData(
  array: any[],
  columns: any,
  filename: string,
  format: ExportFormat = "csv"
) {
  if (format === "csv") {
    downloadCSV(array, columns, filename);
  } else if (format === "pdf") {
    downloadPDF(array, columns, filename);
  }
}

function downloadCSV(array: any[], columns: any, filename: string) {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array, columns);
  if (csv == null) return;

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", `${filename}.csv`);
  link.click();
}

function downloadPDF(array: any[], columns: any, filename: string) {
  const doc = new jsPDF();

  // Extract column headers and their selectors
  const headers = columns.map((column: any) => column.name);

  // Extract data for each row
  const data = array.map((item) => {
    return columns.map((column: any) => {
      if (column.selector) {
        return column.selector(item);
      }
      return "";
    });
  });

  // Generate the PDF with auto-table
  doc.autoTable({
    head: [headers],
    body: data,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { top: 20 },
  });

  doc.save(`${filename}.pdf`);
}

function convertArrayOfObjectsToCSV(array: any[], columns: any) {
  let result: any;

  const columnDelimiter = ",";
  const lineDelimiter = "\n";

  result = "";

  // Extract column names from the columns array
  const keys = columns.map((column: any) => column.name);

  // Write column names as the first row
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  // Iterate over each item in the array and write corresponding values
  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key: any) => {
      if (ctr > 0) result += columnDelimiter;

      // Find the corresponding selector function for the key and apply it to get the value
      const column = columns.find((column: any) => column.name === key);
      if (column && column.selector) {
        result += column.selector(item);
      }

      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

interface ExportProps {
  onExport: (format: ExportFormat) => void;
}

const Export = ({ onExport }: ExportProps) => (
  <div className="flex gap-2 items-center p-2">
    <div className="flex gap-1">
      <button
        className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        onClick={() => onExport("csv")}
        title="Export as CSV"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="2.1em"
          height="2.1em"
        >
          <path
            fill="#20744a"
            fillRule="evenodd"
            d="M28.781 4.405h-10.13V2.018L2 4.588v22.527l16.651 2.868v-3.538h10.13A1.16 1.16 0 0 0 30 25.349V5.5a1.16 1.16 0 0 0-1.219-1.095m.16 21.126H18.617l-.017-1.889h2.487v-2.2h-2.506l-.012-1.3h2.518v-2.2H18.55l-.012-1.3h2.549v-2.2H18.53v-1.3h2.557v-2.2H18.53v-1.3h2.557v-2.2H18.53v-2h10.411Z"
          ></path>
          <path
            fill="#20744a"
            d="M22.487 7.439h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323zm0 3.501h4.323v2.2h-4.323z"
          ></path>
          <path
            fill="#fff"
            fillRule="evenodd"
            d="m6.347 10.673l2.146-.123l1.349 3.709l1.594-3.862l2.146-.123l-2.606 5.266l2.606 5.279l-2.269-.153l-1.532-4.024l-1.533 3.871l-2.085-.184l2.422-4.663z"
          ></path>
        </svg>
      </button>
     
    </div>
  </div>
);

export default Export;
