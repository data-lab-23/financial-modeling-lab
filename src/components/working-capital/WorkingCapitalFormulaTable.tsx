export type WorkingCapitalFormulaRow = {
  label: string;
  formula: string;
  excelFormula: string;
  result: number;
  unit?: "百万円" | "日";
};

const numberFormat = new Intl.NumberFormat("ja-JP", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function WorkingCapitalFormulaTable({ rows }: { rows: readonly WorkingCapitalFormulaRow[] }) {
  return (
    <div className="data-scroll mt-5">
      <table className="data-table min-w-[720px]">
        <thead>
          <tr>
            <th scope="col">計算項目</th>
            <th scope="col">計算式</th>
            <th scope="col">Excel数式例</th>
            <th scope="col">2027/3期予測</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.formula}</td>
              <td><code>{row.excelFormula}</code></td>
              <td className="text-right">{numberFormat.format(row.result)}{row.unit ?? "百万円"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
