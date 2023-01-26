// import Web3 from "web3"

const { WEB3 } = require("web3");
const { ethers } = require("ethers");

const YOUR_WEB3_PROVIDER = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/9ab640d325c448218bb3d24ac2ab4412"
);

const web3 = new Web3(YOUR_WEB3_PROVIDER)

async function getPairs() {
  // Load the Uniswap V3 factory contract
  const factory = new web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS)

  // Call the getPairs function on the factory contract to get the list of all the pairs
  const pairs = await factory.methods.getPairs().call()

  // Do something with the list of pairs
  console.log(pairs)
}

getPairs()
