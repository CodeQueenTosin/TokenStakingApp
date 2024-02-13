async function commonProviderDetector(_provider) {
    if (_provider == "metamask_wallet") {
        if (window.ethereum && window.ethereum.providers) {
            const metamaskProvider = window.ethereum.providers.find(
                (provider) => provider.isMetaMask
            );

            if (metamaskProvider) {
                window.ethereum.providers = [metamaskProvider];
                return await commonInjectedConnect(metamaskProvider, _provider);
            } else {
                console.log("metamask wallet is not found");
                window.open("https://metamask.io/download/", "_blank").focus();
                return false;
            }
        }
    } else if (window.ethereum) {
        return await commonInjectedConnect(window.ethereum, _provider);
    } else {
        console.log("metamask wallet is not found");
    }

    try {
        window.open("https://metamask.io/download", "_blank").focus();
    } catch (error) {}

    return false;
}
