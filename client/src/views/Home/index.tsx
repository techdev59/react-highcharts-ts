import { useState } from "react";
import TradingChart from "../../components/TradingChart";

const Home = () => {
  const [currency, setCurrency] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<string>("1s");
  return <TradingChart currency={currency} interval={interval} />;
};

export default Home;
