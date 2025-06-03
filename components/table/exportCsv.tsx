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
      <button
        className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        onClick={() => onExport("pdf")}
        title="Export as PDF"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="2.1em"
          height="2.1em"
        >
          <path
            fill="#909090"
            d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"
          ></path>
          <path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"></path>
          <path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"></path>
          <path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"></path>
          <path
            fill="#464648"
            d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"
          ></path>
          <path
            fill="#dd2025"
            d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"
          ></path>
          <path fill="#909090" d="M23.954 2.077V7.95h5.633z"></path>
          <path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"></path>
          <path
            fill="#fff"
            d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"
          ></path>
        </svg>
      </button>
    </div>
  </div>
);

export default Export;
