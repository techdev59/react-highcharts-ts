import { useGetKlinesQuery } from "../../services/tradingServices";
import Highcharts from "highcharts/highstock";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import { useState, useRef, useEffect } from "react";

function TradingChart({
  currency,
  interval,
}: {
  currency: string;
  interval: string;
}) {
  const { isLoading, isError, data } = useGetKlinesQuery([currency, interval]);
  const chartRef = useRef<HighchartsReactRefObject>(null);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>();

  useEffect(() => {
    if (data) {
      setChartOptions({
        rangeSelector: {
          selected: 1,
        },

        title: {
          text: currency,
        },

        series: [
          {
            type: "candlestick",
            name: currency,
            data: data,
            turboThreshold: 5000,
            dataGrouping: {
              units: [
                [
                  "week", // unit name
                  [1], // allowed multiples
                ],
                ["month", [1, 2, 3, 4, 6]],
              ],
            },
          },
        ],
      });
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"stockChart"}
      options={chartOptions}
      ref={chartRef}
    />
  );
}

export default TradingChart;
