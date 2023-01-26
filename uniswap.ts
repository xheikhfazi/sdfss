// import { ethers } from 'ethers'
import { ethers } from "ethers";
//convert all imports to require

// const ethers = require("ethers");
// const { Pool } = require("@uniswap/v3-sdk")
import { Pool } from "@uniswap/v3-sdk";
const { CurrencyAmount, MaxUint256, Token, TradeType } = require('@uniswap/sdk-core');




// import {
//   CurrencyAmount,
//   MaxUint256,
//   Token,
//   TradeType,
// } from "@uniswap/sdk-core";


// const { Route } = require("@uniswap/v3-sdk")
// const { Trade } = require("@uniswap/v3-sdk")
import { Route } from "@uniswap/v3-sdk";
import { Trade } from "@uniswap/v3-sdk";

import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

import { abi as QuoterABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";


const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/269e68ee0f9c41c283017f6764ca2816"
);

// USDC-WETH pool address on mainnet for fee tier 0.05%
const poolAddress = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640";

const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3PoolABI,
  provider
);

const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

const quoterContract = new ethers.Contract(quoterAddress, QuoterABI, provider);

interface Immutables {
  factory: string;
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: ethers.BigNumber;
}

interface State {
  liquidity: ethers.BigNumber;
  sqrtPriceX96: ethers.BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}

async function getPoolImmutables() {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
    await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ]);

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  };
  return immutables;
}

async function getPoolState() {
  // note that data here can be desynced if the call executes over the span of two or more blocks.
  const [liquidity, slot] = await Promise.all([
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };

  return PoolState;
}

export default async function Uniswap_Price(): Promise<number> {

  
  // query the state and immutable variables of the pool
  const [immutables, state] = await Promise.all([
    getPoolImmutables(),
    getPoolState(),
  ]);

  // create instances of the Token object to represent the two tokens in the given pool
  const TokenA = new Token(3, immutables.token0, 6, "USDC", "USD Coin");
  const TokenB = new Token(3, immutables.token1, 18, "WETH", "Wrapped Ether");

  // create an instance of the pool object for the given pool
  const poolExample = new Pool(
    TokenA,
    TokenB,
    immutables.fee,
    state.sqrtPriceX96.toString(), //note the description discrepancy - sqrtPriceX96 and sqrtRatioX96 are interchangable values
    state.liquidity.toString(),
    state.tick
  );

  // assign an input amount for the swap
  const amountIn = 1 * 1e18;
  const amountIn2 = 10000 * 1e6;

  // call the quoter contract to determine the amount out of a swap, given an amount in
  const quotedAmountOut =
    await quoterContract.callStatic.quoteExactOutputSingle(
      immutables.token0,
      immutables.token1,
      immutables.fee,
      amountIn.toString(),
      0
    );

  var am = quotedAmountOut;

  am = am / 1e6;

  const quotedAmountOut2 =
    await quoterContract.callStatic.quoteExactInputSingle(
      immutables.token0,
      immutables.token1,
      immutables.fee,
      amountIn2.toString(),
      0
    );

  let am2 = quotedAmountOut2;

  am2 = am2 / 1e18;

  // create an instance of the route object in order to construct a trade object
  const swapRoute = new Route([poolExample], TokenA, TokenB);

  // create an unchecked trade instance
  const uncheckedTradeExample = await Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(TokenA, amountIn.toString()),
    outputAmount: CurrencyAmount.fromRawAmount(
      TokenB,
      quotedAmountOut.toString()
    ),
    tradeType: TradeType.EXACT_INPUT,
  });

  return am.toString();


  // console.log('10,000 USDC :   ', am2.toString() , '  ETHERS' )

  // var am3 = am2 * 0.05/100;

  // am2= am2-am3;

  // var fee = am3 * am ;
  // var loss =10000-fee;

  // console.log('\n FEE  :   ',fee.toString() ,'  DOLLARS')

  // console.log('\n LOSS  :   ',loss.toString() ,'  DOLLARS')
  // console.log('\n>>>>>>>> EXPECTED OUTPUT :   ',am2.toString())
  // console.log("_______________________________________________________\n")

  // // console.log('The unchecked trade object is', uncheckedTradeExample)
}

