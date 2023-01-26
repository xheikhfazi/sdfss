const Web3 = require('web3');
const gql = require('graphql-request').gql;
const GraphQLClient = require('graphql-request').GraphQLClient;

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545')
// ABI definition for the Uniswap v2 exchange contract
const uniswapExchangeABI = [
  {
    constant: true,
    inputs: [],
    name: 'pairs',
    outputs: [
      {
        name: '',
        type: 'bytes32[]',
      },
    ],
    payable: false,
    state_mutability: 'view',
    type: 'function',
  },
  // ... other ABI definitions here
];

// Address of the Uniswap v3 exchange contract on the Ethereum blockchain
const contractAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

// Connect to the Uniswap subgraph
const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-gorli';

// Use the Web3 eth object to create a contract instance
const subgraph = new web3.eth.Contract(uniswapExchangeABI, contractAddress);

// Create a GraphQL client using the subgraph URL
const graphqlClient = new  GraphQLClient(subgraphUrl);

async function findProfitableArbitragePath() 
{

  // Query the subgraph to get a list of all pairs on Uniswap
  const query = gql`
  query{
    pools(
      where: {token0_: {symbol: "WETH"}, token1_: {symbol: "USDC"}}
      orderBy: txCount
      orderDirection: desc
      first: 1
    ) {

      id
      totalValueLockedToken0
      totalValueLockedToken1
      
      token0 {
        symbol
        totalSupply  
        id
      }

      token1 {
        symbol
        id
      }
      
      token0Price
      token1Price
      
      feeTier
      liquidity
    }
  }
  `;
  
  const data = await graphqlClient.request(query);
  
  const Basepair = data.pools;
  const pairs = data.pools;
  // Find the most profitable triangular arbitrage path
  let maxProfit = 0;
  let bestPath;
  let  len=0;

  for (const pair of Basepair) 
  {   
    
    const {token0, token1} = pair;
    
    let AmountIn = 1 ;
    let exchangeRate01 = AmountIn * pair.token1Price ;

    //// SWAP FEE
    let swapFeePercentage = (pair.feeTier * 100)/1000000;

    let swapFee = swapFeePercentage * AmountIn;

 
    //// PRICE IMPACT
    let marketPrice = (pair.totalValueLockedToken0 / token0.totalSupply ) * pair.totalValueLockedToken1; 

    let PriceImpact = marketPrice - exchangeRate01;


    console.log( token0.symbol + '/' + token1.symbol   + exchangeRate01 );
    console.log('SWAP FEE : '+ swapFee);
    console.log('PRICE IMPACT : '+ PriceImpact);

  }




  //   // Query the subgraph to get the exchange rates for the pair
    
  //   const exchangeRate10 = pair.totalValueLockedToken0 / pair.totalValueLockedToken1;

  //   // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
  //   // console.log( token0.symbol + '/' + token1.symbol + '  :  ' + exchangeRate01);
  //   // console.log( token1.symbol + '/' + token0.symbol + '  :  ' + exchangeRate10);
  //   // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n");



  //   // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  //   // console.log('CHECKING PAIR : '+ token0.symbol + '/' + token1.symbol +'\n');
    

  //   // Check if this pair is part of a profitable triangular arbitrage
  //   for (const otherPair of pair1) 
  //   {
  //     if (pair.id === otherPair.id) continue;
       
  //     const otherToken0= otherPair.token0;
  //     const otherToken1= otherPair.token1;

  //     // console.log('WITH : '+ otherToken0.symbol + '/' + otherToken1.symbol);


  //     if (token0 === otherToken0 || token0 === otherToken1) 
  //     {
  //       const exchangeRate = token0 === otherToken0 ? exchangeRate10 : exchangeRate01;
        
  //       const profit = exchangeRate * ( otherPair.totalValueLockedToken1/otherPair.totalValueLockedToken0 );
  //       if (profit > maxProfit) 
  //       {
  //         maxProfit = profit;
  //         bestPath = [
  //           {
  //             pairId: pair.id,
  //             token0: pair.token0,
  //             token1: pair.token1,
  //           },            {
  //               pairId: otherPair.id,
  //               token0: otherPair.token0,
  //               token1: otherPair.token1,
  //             },
  //           ];
  //         }
  //       }
  //     }

  //     len++;

  // }


    
  // console.log('TOTAL POOLS CHECKED: ', len);
  // console.log('Best path: ', bestPath);
  // console.log('Max profit: ', maxProfit);
}






findProfitableArbitragePath();