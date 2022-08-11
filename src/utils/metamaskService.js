import { ethers } from "ethers"; // 현 서비스에서 ethers 는 잔액 해시값을 수치로 변환할 때만 사용

const metamask = {
    isEnabled: !!window.ethereum, // 메타마스크 확장프로그램을 사용할 수 있는 상태인지 확인
    getWallet: async () => {
        const ethereum = window.ethereum;

        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            return accounts[0]; // 지갑 주소 리턴
        } catch (err) {
            return err.message.includes("User rejected") ? "USER_DENIED" : false;
        }
    },
    getChainId: async () => {
        try {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            return chainId;
        } catch (err) {
            if (err.message.includes("User rejected")) {
                return { isSuccess: false, result: "요청이 취소되었어요." };
            }
            return { isSuccess: false, result: "메타마스크 오류가 발생했습니다." };
        }
    },
    getBalance: async (address) => {
        // 현재 연결된 네트워크상 지갑의 메인 크립토 잔고를 가져옵니다.
        const ethereum = window.ethereum;
        try {
            const balanceHash = await ethereum.request({ method: "eth_getBalance", params: [address, "latest"] });
            console.log("balanceHash in getBal:", balanceHash);
            const balance = await ethers.utils.formatEther(balanceHash);
            return balance;
        } catch (err) {
            if (err.message.includes("User rejected")) {
                return { isSuccess: false, result: "요청이 취소되었어요." };
            }
            return { isSuccess: false, result: "메타마스크 오류가 발생했습니다." };
        }
    },
    getRawTransaction: async (price) => {
        const ethereum = window.ethereum;
        // 아래 paramter 값들은 샘플값으로 프로젝트 적용 시 블록체인팀의 컨펌이 필요함.
        const transactionParameters = {
            gasPrice: "0x09184e72a000", // unit 당 가스비
            gas: "0x2710", // Gas limit을 의미. 총 가스비는 gasPrice * gasLimit.
            to: "0x0000000000000000000000000000000000000000", // 받는 지갑 주소
            from: ethereum.selectedAddress, // 보내는 지갑 주소. 현재 연결된 지갑주소가 배정됨.
            value: "0x00", // price를 unit단위(gwei)로 변환했을 때 송금할 총량. Only required to send ether to the recipient from the initiating external account.
        };
        try {
            const txHash = await ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionParameters],
            });

            return { isSuccess: true, result: txHash };
        } catch (err) {
            if (err.message.includes("User rejected")) {
                return { isSuccess: false, result: "요청이 취소되었어요." };
            }
            return { isSuccess: false, result: "메타마스크 오류가 발생했습니다." };
        }
    },
};

export default metamask;
