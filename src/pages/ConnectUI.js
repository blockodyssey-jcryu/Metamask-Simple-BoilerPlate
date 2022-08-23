import React, { useReducer } from "react";
import metamask from "../utils/metamaskService";
import useWatchMetamask from "../hooks/useWatchMetamask";
import { useNavigate } from "react-router-dom";
import MobileDetector from "../utils/mobileDetector";

function walletReducer(state, action) {
    switch (action.type) {
        case "setCurrentAccount":
            return { ...state, currentAccount: action.payload };
        case "setCurrentNetwork":
            let netTicker = "ETH"; // default 이더리움 네트워크
            let netName = "Ethereum Mainnet";
            if (action.payload === "0x38") {
                // 바이낸스 스마트 체인 네트워크일 경우
                netTicker = "BNB";
                netName = "Binance Smart Chain";
            }
            return { ...state, currentNetwork: netName, currentCrypto: netTicker };
        case "setUserBalance":
            return { ...state, userBalance: action.payload };
        case "setConnBtnText":
            return { ...state, connBtnText: action.payload };
        default:
            throw new Error();
    }
}

export default function ConnectUI() {
    const navigate = useNavigate();
    const isMobile = MobileDetector.isMobile();
    useWatchMetamask();
    const initialState = {
        currentAccount: null,
        currentNetwork: null,
        currentCrypto: null,
        userBalance: null,
        connBtnText: "지갑 연결",
    };
    const [walletInfo, dispatch] = useReducer(walletReducer, initialState);

    const handleAccountsChanged = async (account) => {
        dispatch({ type: "setCurrentAccount", payload: account });

        const balance = await metamask.getBalance(account);
        dispatch({ type: "setUserBalance", payload: balance });

        const chainId = await metamask.getChainId();
        dispatch({ type: "setCurrentNetwork", payload: chainId });
    };

    const handleConnection = async () => {
        if (isMobile) {
            // 모바일 환경일 경우, 메타마스크 딥링크를 통해 앱으로 연결.
            // 메타마스크 앱 내부의 브라우저는 크롬을 지원하고 있음.
            // 모바일 웹 테스트는 아이폰 사파리 브라우저를 사용해야 함.
            if (MobileDetector.getBrowserName() === "Safari") {
                window.location.href = "https://metamask.app.link/dapp/goToMetamask";
                return;
            }
        }

        if (!metamask.isEnabled) {
            console.log("metamask.isEnabled:", metamask.isEnabled);
            navigate("/notInstalled");
            return;
        }

        const walletAddress = await metamask.getWallet();
        handleAccountsChanged(walletAddress);
    };

    const shortenAddress = (address) => {
        return address ? address.slice(0, 6) + " ... " + address.slice(-6) : null;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4>이더리움 기반 메타마스크 연결</h4>
            <button onClick={handleConnection}>{walletInfo.connBtnText}</button>
            <div>
                <h3>Address: {shortenAddress(walletInfo.currentAccount)}</h3>
            </div>
            <div>
                <h3>Mainnet: {walletInfo.currentNetwork}</h3>
            </div>
            <div>
                <h3>Ticker: {walletInfo.currentCrypto}</h3>
            </div>
            <div>
                <h3>Balance: {walletInfo.userBalance}</h3>
            </div>
            {walletInfo.errMsg}
        </div>
    );
}
