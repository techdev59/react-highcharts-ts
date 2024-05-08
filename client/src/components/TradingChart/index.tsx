// Import necessary dependencies
import { useGetKlinesQuery } from "../../services/tradingServices";
import Highcharts from "highcharts/highstock";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import { useState, useRef, useEffect } from "react";
import Indicators from "highcharts/indicators/indicators";

// Initialize Highcharts indicators
Indicators(Highcharts);

// The TradingChart component
function TradingChart({
  currency,
  interval,
}: {
  currency: string;
  interval: string;
}) {
  // Fetch kline data using the useGetKlinesQuery hook
  const { isLoading, isError, data } = useGetKlinesQuery([currency, interval]);

  // Create a reference to the Highcharts chart
  const chartRef = useRef<HighchartsReactRefObject>(null);

  // State to hold the chart options
  const [chartOptions, setChartOptions] = useState<any>();

  // Set up a WebSocket connection to receive real-time data updates
  useEffect(() => {
    const socket = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@kline_1s"
    );

    // Handle incoming WebSocket messages
    socket.onmessage = (event) => {
      const incomingData = JSON.parse(event.data);
      const newDataPoint = [
        incomingData.k.t,
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

    // Clean up the WebSocket connection on component unmount
    return () => socket.close();
  }, []);

  // Update the chart options when the data changes
  useEffect(() => {
    if (data) {
      setChartOptions({
        title: {
          text: currency,
        },
        navigation: {
          bindingsClassName: "tools-container", // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
        },
        stockTools: {
          gui: {
            enabled: true, // disable the built-in toolbar
          },
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
          {
            type: "sma",
            linkedTo: ":previous",
            params: {
              period: 14,
            },
          },
        ],
      });
    }
  }, [data]);

  // Render the chart if data is available, or display loading/error messages
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

// Export of the TradingChart component
export default TradingChart;
