import React, { useEffect, useState, useRef } from "react";
import { priceFomat } from "./method";

const SocketTest = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [sendMsg, setSendMsg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataF, setDataF] = useState({
    BTC_KRW: {
      buyVolume: "",
      chgAmt: "",
      chgRate: "",
      closePrice: "",
      date: "",
      highPrice: "",
      lowPrice: "",
      openPrice: "",
      prevClosePrice: "",
      sellVolume: "",
      symbol: "",
      tickType: "",
      time: "",
      value: "",
      volume: "",
      volumePower: "",
    },
    ETH_KRW: {
      buyVolume: "",
      chgAmt: "",
      chgRate: "",
      closePrice: "",
      date: "",
      highPrice: "",
      lowPrice: "",
      openPrice: "",
      prevClosePrice: "",
      sellVolume: "",
      symbol: "",
      tickType: "",
      time: "",
      value: "",
      volume: "",
      volumePower: "",
    },
  });

  const webSocketUrl = `wss://pubwss.bithumb.com/pub/ws`;
  let ws = useRef(null);

  // 소켓 객체 생성
  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(webSocketUrl);
      ws.current.onopen = () => {
        console.log("connected to " + webSocketUrl);
        setSocketConnected(true);
      };
      ws.current.onclose = (error) => {
        console.log("disconnect from " + webSocketUrl);
        console.log(error);
      };
      ws.current.onerror = (error) => {
        console.log("connection error " + webSocketUrl);
        console.log(error);
      };
      ws.current.onmessage = async (evt) => {
        const data = await JSON.parse(evt.data);
        console.log(data.content.symbol);

        setDataF((prev) => {
          return {
            ...prev,
            [data.content.symbol]: data.content,
          };
        });

        setLoading(false);
      };
    }

    // return () => {
    //   console.log("clean up");
    //   ws.current.close();
    // };
  }, []);

  // 소켓이 연결되었을 시에 send 메소드
  useEffect(() => {
    if (socketConnected) {
      // 웹소켓 요청
      ws.current.send(
        JSON.stringify({
          type: "ticker",
          symbols: ["BTC_KRW", "ETH_KRW"],
          tickTypes: ["30M", "1H", "12H", "24H", "MID"],
        })
      );

      setSendMsg(false);
    }
  }, [socketConnected]);

  return (
    <div>
      <div style={{ width: 500, padding: 10 }}>
        <div
          style={{
            border: "1px solid #ececec",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <p>심볼</p>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p>현재가</p>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p>변동율</p>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p>누적거래량</p>
          </div>
        </div>
        {!loading && (
          <>
            <div
              style={{
                marginTop: 5,
                border: "1px solid #ececec",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 13,
              }}
            >
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontWeight: "bold" }}>BTC_KRW</p>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p>{priceFomat(dataF["BTC_KRW"].closePrice)}</p>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p>{priceFomat(dataF["BTC_KRW"].chgAmt)}</p>
                <p>{dataF["BTC_KRW"].chgRate}%</p>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p>{priceFomat(dataF["BTC_KRW"].volume)}(백만)</p>
              </div>
            </div>

            <div
              style={{
                marginTop: 5,
                border: "1px solid #ececec",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 13,
              }}
            >
              <div style={{ flex: 1, textAlign: "center" }}>
                <p style={{ fontWeight: "bold" }}>ETH_KRW</p>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p>{priceFomat(dataF["ETH_KRW"].closePrice)}</p>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p>{priceFomat(dataF["BTC_KRW"].chgAmt)}</p>
                <p>{dataF["ETH_KRW"].chgRate}%</p>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <p>{priceFomat(dataF["ETH_KRW"].volume)}(백만)</p>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocketTest;
