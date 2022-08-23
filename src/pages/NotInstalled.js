const NotInstalled = () => {
    const goToInstall = () => {
        window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ko");
    };

    return (
        <div>
            <h1>Metamask 설치 후 이용할 수 있습니다.</h1>
            <button type="button" onClick={goToInstall}>
                Metamask 설치하기
            </button>
        </div>
    );
};

export default NotInstalled;
