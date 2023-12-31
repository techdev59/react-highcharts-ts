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
  const [chartOptions, setChartOptions] = useState<any>();

  useEffect(() => {
    const socket = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@kline_1s"
    );

    socket.onmessage = (event) => {
      const incomingData = JSON.parse(event.data);
      const newDataPoint = [
        parseFloat(incomingData.k.t),
        parseFloat(incomingData.k.o),
        parseFloat(incomingData.k.h),
        parseFloat(incomingData.k.l),
        parseFloat(incomingData.k.c),
      ];
      setChartOptions((prevOptions: any) => {
        const newOptions = JSON.parse(JSON.stringify(prevOptions)); // Deep copy
        newOptions.series[0].data.push(newDataPoint);
        if (newOptions.series[0].data.length > 500) {
          // Remove the first point when the data array exceeds a certain length to keep the chart clean
          newOptions.series[0].data.shift();
        }

        return newOptions;
      });
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    if (data) {
      setChartOptions({
        title: {
          text: currency,
        },
        accessibility: {
          enabled: false,
        },
        series: [
          {
            type: "candlestick",
            name: currency,
            data: data,
            turboThreshold: 5000,
            boostThreshold: 5000,
            upColor: "#4eca3e",
            color: "#ec5656",
            dataGrouping: {
              units: [
                [
                  "millisecond", // unit name
                  [1, 2, 5, 10, 20, 25, 50, 100, 200, 500], // allowed multiples
                ],
                ["second", [1, 2, 5, 10, 15, 30]],
                ["minute", [1, 2, 5, 10, 15, 30]],
                ["hour", [1, 2, 3, 4, 6, 8, 12]],
                ["day", [1]],
                ["week", [1]],
                ["month", [1, 3, 6]],
                ["year", null],
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
    <>
      {chartOptions && (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={chartOptions}
          ref={chartRef}
          allowChartUpdate={true}
          immutable={false}
          containerProps={{ className: "chartContainer" }}
        />
      )}
    </>
  );
}

export default TradingChart;
