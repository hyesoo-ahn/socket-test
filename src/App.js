import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState({
    BTC_KRW: {},
    ETH_KRW: {},
  });
  useEffect(() => {
    connectWS();
  }, []);
  let socket;

  // 웹소켓 연결
  const connectWS = () => {
    if (socket != undefined) {
      socket.close();
    }
    console.log("connecting ...", "wss://pubwss.bithumb.com/pub/ws");

    socket = new WebSocket("wss://pubwss.bithumb.com/pub/ws");

    socket.onopen = function (e) {
      console.log("onopen...");
    };

    socket.onclose = function (e) {
      console.log("onclose...");
      socket = undefined;
    };
    socket.onmessage = function (e) {
      const parsedData = JSON.parse(e.data);
      let tempOb = { ...data };
      tempOb[parsedData.content.symbol] = parsedData;

      console.log(tempOb);
      setData(tempOb);
    };
  };

  // 웹소켓 연결 해제
  function closeWS() {
    if (socket != undefined) {
      console.log("closing requested");
      socket.close();
      socket = undefined;
    }
  }

  // 웹소켓 요청
  function filterRequest(filter) {
    if (socket == undefined) {
      alert("no connect exists");
      return;
    }

    socket.send(filter);
  }

  const test = async () => {
    // connectWS();
    filterRequest(
      JSON.stringify({
        type: "ticker",
        symbols: ["BTC_KRW", "ETH_KRW"],
        tickTypes: ["30M", "1H", "12H", "24H", "MID"],
      })
    );

    // closeWS();
  };

  return (
    <div
      className="App"
      style={{
        // height: 200,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ cursor: "pointer" }} onClick={test}>
        웹소켓 요청 Click
      </h1>

      <div
        style={{
          // display: "flex",
          // justifyContent: "space-between",
          // alignItems: "center",
          width: "50%",
        }}
      >
        <div style={{ width: "50%", border: "1px solid red" }}>
          <h2>BTC_KRW</h2>
          {JSON.stringify(data["BTC_KRW"])}
        </div>
        <div style={{ width: "50%", border: "1px solid red" }}>
          <h2>ETH_KRW</h2>
          {JSON.stringify(data["ETH_KRW"])}
        </div>
      </div>
    </div>
  );
}

export default App;
