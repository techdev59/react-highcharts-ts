import { useGetKlinesQuery } from "../../services/tradingServices";
import Highcharts from "highcharts/highstock";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import { io } from "socket.io-client";
import { useState, useRef, useEffect } from "react";

function TradingChart({
  currency,
  interval,
}: {
  currency: string;
  interval: string;
}) {
  const { isLoading, isSuccess, isError, error, data } = useGetKlinesQuery([
    currency,
    interval,
  ]);
  const chartRef = useRef<HighchartsReactRefObject>(null);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>();

  const socket = io("http://localhost:4000/");

  socket.on("KLINE", (candle: any) => {
    const update: any = [
      candle.time * 1000,
      candle.open,
      candle.high,
      candle.low,
      candle.close,
    ];
    // const update = {
    //   x: candle.time * 1000,
    //   open: candle.open,
    //   high: candle.high,
    //   low: candle.low,
    //   close: candle.close,
    // };
    if (chartRef.current && chartOptions) {
      // chartRef.current.chart.series[0].chart.addSeries(update, true, false);
      chartRef.current.chart.addSeries(update, true, false);
      chartRef.current.chart.update(update, true, false);
      console.log(chartRef.current.chart.series[0]);
    }
  });
  // useEffect(() => {
  //   const socket = io("http://localhost:4000/");

  //   if (chartRef.current && chartOptions) {
  //     socket.on("KLINE", (candle: any) => {
  //       // Add new data to the chart's series
  //       const update: any = [
  //         candle.time * 1000,
  //         candle.open,
  //         candle.high,
  //         candle.low,
  //         candle.close,
  //       ];
  //       const chart = chartRef?.current?.chart;
  //       chart?.series[0].addPoint(update, true, true);
  //     });
  //   }
  //   // Request new data every second
  //   const intervalId = setInterval(() => {
  //     socket.emit("get_data");
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //     socket.close();
  //   };
  // }, [chartRef.current]);

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

  console.log(chartOptions);

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
