// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const tradingApi = createApi({
  reducerPath: "tradingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.binance.com/api/v3/",
  }),
  endpoints: (builder) => ({
    getKlines: builder.query<TradeCandle[], [string, string]>({
      query: ([currency, interval]): string =>
        `klines?symbol=${currency}&interval=${interval}`,
      transformResponse: (response: any) => {
        return response.map((candle: any) => {
          return [
            candle[0],
            parseFloat(candle[1]),
            parseFloat(candle[2]),
            parseFloat(candle[3]),
            parseFloat(candle[4]),
          ];
        });
      },
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetKlinesQuery } = tradingApi;
