import { useEffect } from "react";

import metamask from "../utils/metamaskService";

const useWatchMetamask = () => {
    const currentAccount = ""; // useSelector(loginSelector) 에서 현재 지갑주소 불러올 것

    function handleChainChanged(_chainId) {
        // 네트워크가 변경되었을 때 처리. 새로고침 처리가 권장되고 있음.
        console.log("_chainId:", _chainId);
        window.location.reload();
    }

    function handleAccountsChanged(accounts) {
        console.log("accounts in useMeta:", accounts);
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            alert("메타마스크를 연결해 주세요.");
        } else if (accounts[0] !== currentAccount) {
            // 현재 지갑주소와 다르면 새 지갑 주소로 변경 또는 로그아웃 처리. 기획 내용에 따라 대응
            alert("지갑 주소가 변경 되었습니다.");
            window.location.reload();
        }
    }

    useEffect(() => {
        if (!metamask.isEnabled) return;

        // 네트워크 변경 시
        window.ethereum.on("chainChanged", handleChainChanged);

        // 계정 변경 시
        window.ethereum.on("accountsChanged", handleAccountsChanged);

        return () => {
            // 현재 컴포넌트를 벗어날 때 이벤트 리스너 제거. 로그아웃 처리할 때 이벤트리스너 제거할 지 추후 설계에 따라 변경 고려.
            window.ethereum.removeListener("chainChanged", handleChainChanged);
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        };
    }, []);
};

export default useWatchMetamask;
