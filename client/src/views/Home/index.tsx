import { useState } from "react";
import TradingChart from "../../components/TradingChart";

const Home = () => {
  const [currency, setCurrency] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<string>("1d");
  return <TradingChart currency={currency} interval={interval} />;
};

export default Home;
