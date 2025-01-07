document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-wallet');
    const walletAddress = document.getElementById('wallet-address');
    const modelForm = document.getElementById('model-form');
    const modelsContainer = document.getElementById('models-container');

    let contract = null;
    let userAddress = null;

    connectButton.addEventListener('click', async () => {
        userAddress = await connectWallet();
        if (userAddress) {
            walletAddress.textContent = `Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
            contract = await getContract();
            loadModels();
        }
    });

    async function loadModels() {
        if (!contract) return;
        
        try {
            const modelCount = await contract.methods.getModelCount().call();
            modelsContainer.innerHTML = '';
            
            for (let i = 0; i < modelCount; i++) {
                const model = await contract.methods.getModelDetails(i).call();
                const modelElement = createModelCard(model, i);
                modelsContainer.appendChild(modelElement);
            }
        } catch (error) {
            console.error('Error loading models:', error);
        }
    }

    function createModelCard(model, id) {
        const div = document.createElement('div');
        div.className = 'model-card';
        div.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
            <p>Price: ${Web3.utils.fromWei(model.price, 'ether')} ETH</p>
            <button onclick="purchaseModel(${id})">Purchase</button>
        `;
        return div;
    }

    modelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!contract || !userAddress) {
            alert('Please connect your wallet first');
            return;
        }

        const name = document.getElementById('model-name').value;
        const description = document.getElementById('model-description').value;
        const price = Web3.utils.toWei(document.getElementById('model-price').value, 'ether');

        try {
            await contract.methods.listModel(name, description, price)
                .send({ from: userAddress });
            modelForm.reset();
            loadModels();
        } catch (error) {
            console.error('Error submitting model:', error);
            alert('Error submitting model');
        }
    });

    window.purchaseModel = async (modelId) => {
        if (!contract || !userAddress) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            const model = await contract.methods.getModelDetails(modelId).call();
            await contract.methods.purchaseModel(modelId)
                .send({ from: userAddress, value: model.price });
            alert('Purchase successful!');
        } catch (error) {
            console.error('Error purchasing model:', error);
            alert('Error purchasing model');
        }
    };
});