const columns = ["CarPal", "Going solo", "Dealership sales team", "Paid car broker"];

const rows = [
  { label: "Whose side they are on", cells: ["Yours alone, with no dealer commissions", "Yours, but you are outmatched", "The store's, and its targets", "Depends on how the broker is paid"] },
  { label: "How the price is settled", cells: ["A written total with every fee included", "Whatever you manage to push for", "The store sets it, extras come later", "Bargained for you, in varying detail"] },
  { label: "What you learn about the car", cells: ["Market range and history before any visit", "Only what you dig up yourself", "A report the seller chose to share", "Different with every broker"] },
  { label: "Add-on and admin fees", cells: ["Flagged, challenged and cut where possible", "Caught only if you know to look", "Usually fixed, seldom reduced", "Different with every broker"] },
  { label: "Hours you spend", cells: ["Review the deal, then collect the car", "Long visits and repeat trips", "Faster talks, the same forms", "Fewer than doing it alone"] },
  { label: "Price to you", cells: ["$499 per car", "Your weekends", "Folded into the sticker", "A broker fee on top"] },
];

export function CompareTable() {
  return (
    <>
      <div className="hidden border border-border bg-surface md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr>
              <th className="w-[22%] p-4" scope="col"><span className="sr-only">Option</span></th>
              {columns.map((column, i) => (
                <th key={column} scope="col" className={"p-4 text-sm font-semibold uppercase tracking-wider " + (i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border align-top">
                <th scope="row" className="p-4 font-semibold">{row.label}</th>
                {row.cells.map((cell, i) => (
                  <td key={i} className={"p-4 " + (i === 0 ? "bg-secondary font-semibold" : "text-muted-foreground")}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-6 md:hidden">
        {rows.map((row) => (
          <div key={row.label} className="border border-border bg-surface">
            <h3 className="border-b border-border p-4 font-display text-xl">{row.label}</h3>
            <dl>
              {row.cells.map((cell, i) => (
                <div key={columns[i]} className={"border-b border-border p-4 last:border-b-0 " + (i === 0 ? "bg-secondary" : "")}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{columns[i]}</dt>
                  <dd className={"mt-1 " + (i === 0 ? "font-semibold" : "")}>{cell}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
