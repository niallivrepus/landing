import type { BenchmarkRow } from "../../data/news-detail";

type Props = {
  columns: [string, string, string, string];
  rows: BenchmarkRow[];
  footnote: string;
};

export function BenchmarkTable({ columns, rows, footnote }: Props) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-light-space/[0.12]">
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={
                    i === 0
                      ? "pb-3 pr-4 text-left font-medium text-light-space/90"
                      : i === 1
                        ? "pb-3 px-2 text-center font-semibold text-light-space"
                        : i === 2
                          ? "pb-3 px-2 text-center font-medium text-light-space/78"
                          : "pb-3 pl-2 text-center font-medium text-light-space/55"
                  }
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-light-space/[0.08]">
                <td className="py-3.5 pr-4 text-left text-light-space/75">{row.label}</td>
                <td className="py-3.5 px-2 text-center font-medium tabular-nums text-light-space">{row.values[0]}</td>
                <td className="py-3.5 px-2 text-center tabular-nums text-light-space/80">{row.values[1]}</td>
                <td className="py-3.5 pl-2 text-center tabular-nums text-light-space/55">{row.values[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="news-detail-reading mt-5 text-xs leading-relaxed text-light-space/45">{footnote}</p>
    </div>
  );
}
