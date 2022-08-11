import React, { useReducer } from "react";
import metamask from "../utils/metamaskService";
import useWatchMetamask from "../hooks/useWatchMetamask";

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
        case "setErrMsg":
            return { ...state, errMsg: action.payload };
        default:
            throw new Error();
    }
}

export default function ConnectUI() {
    useWatchMetamask();
    const initialState = {
        currentAccount: null,
        currentNetwork: null,
        currentCrypto: null,
        userBalance: null,
        connBtnText: "지갑 연결",
        errMsg: null,
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
        const walletAddress = await metamask.getWallet();
        handleAccountsChanged(walletAddress);
    };

    return (
        <div>
            <h4>이더리움 기반 메타마스크 연결</h4>
            <button onClick={handleConnection}>{walletInfo.connBtnText}</button>
            <div>
                <h3>Address: {walletInfo.currentAccount}</h3>
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
