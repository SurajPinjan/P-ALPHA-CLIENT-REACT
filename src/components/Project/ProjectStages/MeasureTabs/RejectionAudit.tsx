import { LineChart } from "@mui/x-charts";

function RejectionAudit() {
  const monthNames = ["January", "February", "March", "April", "May", "June"];
  return (
    <>
      <LineChart
        xAxis={[{ scaleType: "band", data: monthNames }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        width={500}
        height={300}
      />
    </>
  );
}
export default RejectionAudit;
