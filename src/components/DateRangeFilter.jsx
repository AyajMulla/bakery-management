export default function DateRangeFilter({ fromDate, toDate, setFromDate, setToDate }) {
  return (
    <div className="card">
      <h3>Date Range Filter</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <div>
          <label>From:</label><br />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>To:</label><br />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
