const express = require("express");
const router = express.Router();
const { web3, contract } = require("../utils/web3");

// Route to list a new model
router.post("/list", async (req, res) => {
    const { name, description, price, account } = req.body;

    try {
        const result = await contract.methods
            .listModel(name, description, web3.utils.toWei(price, "ether"))
            .send({ from: account });

        res.status(200).json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route to purchase a model
router.post("/purchase", async (req, res) => {
    const { modelId, account, price } = req.body;

    try {
        const result = await contract.methods
            .purchaseModel(modelId)
            .send({ from: account, value: web3.utils.toWei(price, "ether") });

        res.status(200).json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route to rate a model
router.post("/rate", async (req, res) => {
    const { modelId, rating, account } = req.body;

    try {
        const result = await contract.methods
            .rateModel(modelId, rating)
            .send({ from: account });

        res.status(200).json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Route to get model details
router.get("/:modelId", async (req, res) => {
    const modelId = req.params.modelId;

    try {
        const result = await contract.methods.getModelDetails(modelId).call();
        res.status(200).json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
