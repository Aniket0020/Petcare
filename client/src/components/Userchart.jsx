import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserStatsChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/stats/users")
      .then((res) => {
        const data = res.data;
        setChartData({
          labels: data.map((item) => item.month),
          datasets: [
            {
              label: "Users Registered",
              data: data.map((item) => item.users),
              backgroundColor: "#6366F1",
            },
          ],
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "User Growth by Month" },
    },
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="text-center text-gray-500">Loading chart...</p>
      )}
    </div>
  );
}
