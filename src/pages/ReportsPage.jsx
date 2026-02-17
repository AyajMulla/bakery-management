import DateRangeFilter from "../components/DateRangeFilter";
import Report from "../components/Report";

export default function ReportsPage({
  sales,
  fromDate,
  toDate,
  setFromDate,
  setToDate
}) {
  return (
    <>
    <br></br>
      <DateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />
<br></br>
      <Report
        sales={sales}
        fromDate={fromDate}
        toDate={toDate}
      />
    </>
  );
}
