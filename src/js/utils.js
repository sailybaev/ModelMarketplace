const CONTRACT_ADDRESS = '0xab4E6F796f7ef133e0995ef634B994f0A9FD5091';
const CONTRACT_ABI = 

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        } catch (error) {
            console.error('Error connecting wallet:', error);
            return null;
        }
    }
    alert('Please install MetaMask!');
    return null;
}

async function getContract() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }
    return null;
}