// import {
//   AutoRouter,
//   ChainId,
//   TokenAmount,
//   Trade,
//   TradeType,
//   Route,
//   CurrencyAmount,
//   getPrice
// } from '@uniswap/sdk';



//   async function findProfitableArbitragePath(chainId: ChainId, tokens: string[], minProfitMargin: number) {
//   // create an AutoRouter instance
//   const router = new AutoRouter(chainId);
  
  
//   // initialize the trade object with the first token in the list
//   let trade = new Trade(TradeType.EXACT_INPUT, new TokenAmount(tokens[0], '1000000000000'), new TokenAmount(tokens[0], '1'), chainId);
  
//   // initialize an array to store the path of the trade
//   let path = [tokens[0]];
  
//   // loop through the list of tokens
//   for (let i = 1; i < tokens.length; i++) {
//       // get the current price of the token we are interested in buying
//       const currentPrice = await getPrice(trade.sellAmount, new TokenAmount(tokens[i], '1'));
  
//       // check if there is an arbitrage opportunity
//       if (currentPrice.greaterThan(trade.buyAmount.multipliedBy(minProfitMargin))) {
//           // update the trade object to buy the current token and sell the previous token
//           trade = new Trade(TradeType.EXACT_INPUT, new TokenAmount(tokens[i], '1000000000000'), trade.buyAmount.multipliedBy(minProfitMargin), chainId);
  
//           // add the current token to the path
//           path.push(tokens[i]);
//       }
//   }
  
//   // return the path
//   return path;
//   }
    
//     // example usage
//     const chainId = ChainId.MAINNET
//     const tokens = ['DAI', 'USDC', 'WBTC']
//     const minProfitMargin = 1.01
//     const path = findProfitableArbitragePath(chainId, tokens, minProfitMargin)
//     console.log(path)






{
  pools(first: 500, orderBy: txCount, orderDirection: desc) {
    token0 {
			symbol
    }
    
    token1 {
      symbol
     
    }
    
    token0Price
    token1Price
  }
}