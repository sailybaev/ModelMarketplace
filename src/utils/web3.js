const Web3 = require("web3");
require("dotenv").config();

const web3 = new Web3(process.env.INFURA_URL);

const contractABI = require("./abi.json");
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3, contract };
