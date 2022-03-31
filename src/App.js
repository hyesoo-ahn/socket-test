import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
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

    // socket.onclose = function (e) {
    //   console.log("onclose...");
    //   // $("#session_id").val("");
    //   socket = undefined;
    // };
    socket.onmessage = function (e) {
      console.log("onmessage...", e.data);
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

  // // run test()
  // test();

  return (
    <div
      className="App"
      style={{ height: 200, display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <h1 style={{ cursor: "pointer" }} onClick={test}>
        웹소켓 요청 Click
      </h1>
    </div>
  );
}

export default App;
