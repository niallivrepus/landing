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
            <tr className="border-b border-white/[0.12]">
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={
                    i === 0
                      ? "pb-3 pr-4 text-left font-medium text-white/90"
                      : i === 1
                        ? "pb-3 px-2 text-center font-semibold text-white"
                        : i === 2
                          ? "pb-3 px-2 text-center font-medium text-white/78"
                          : "pb-3 pl-2 text-center font-medium text-white/55"
                  }
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-white/[0.08]">
                <td className="py-3.5 pr-4 text-left text-white/75">{row.label}</td>
                <td className="py-3.5 px-2 text-center font-medium tabular-nums text-white">{row.values[0]}</td>
                <td className="py-3.5 px-2 text-center tabular-nums text-white/80">{row.values[1]}</td>
                <td className="py-3.5 pl-2 text-center tabular-nums text-white/55">{row.values[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="news-detail-reading mt-5 text-xs leading-relaxed text-white/45">{footnote}</p>
    </div>
  );
}
