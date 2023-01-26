import Uniswap_Price from "./uniswap";
import { Sushiswap_Price } from "./sushiswap";

import { Pancakeswap_Price } from "./pancakeswap";



let SushiswapPrice: number = 0;
let UniswapPrice: number = 0;
let PancakeswapPrice: number = 0;


let uniafterfee = 0;
let sushiafterfee = 0;


function rt()
{
  Sushiswap_Price().then((responseFromSushi) => {
 SushiswapPrice= responseFromSushi;

  Uniswap_Price().then((responseFromUni) => {
    UniswapPrice  = responseFromUni;


  });
});



}

rt()



const printNumbersForEvery2Sec = (n)=>{
  for (let i = 1; i <= n; i++) {
      setTimeout( () =>{
          
        if( UniswapPrice != 0 && SushiswapPrice !=0 )
        {
        console.log("\x1b[46m", "******* DEX_PRICES *******", "\x1b[0m");
        console.log("Price of Uniswap : ", UniswapPrice);
        console.log("Price of Sushiswap : ", SushiswapPrice);

        if(UniswapPrice > SushiswapPrice)
        {  
          let bought = 10000;  ///////// FOR 10,000 dollars and  9 dollar gas fee 

          let loanfee = bought * 0.09/100;
          console.log("Loan ", loanfee);

          bought= bought / SushiswapPrice;

          ///////LOSS AFTER buying from uni 
          
          let loss =bought * 0.05/100;
          bought = bought - loss;

          let inUsdc = bought *  UniswapPrice;
          let loss2 = inUsdc * 0.05/100;

          inUsdc= inUsdc-loss2;
          inUsdc = inUsdc - loanfee;



          console.log("\x1b[42m", "******* PROFIT IN USDC *******", "\x1b[0m");
          console.log("FINAL PROFIT AT 10000 USDC BUY AT SUSHI: ", inUsdc);


        }
        else
        {
          
          let bought = 10000;  ///////// FOR 10,000 dollars and  9 dollar gas fee
          let loanfee = bought * 0.09/100;
          
          bought= bought / UniswapPrice;

          ///////LOSS AFTER buying from uni 
          
          let loss =bought * 0.05/100;
          bought = bought - loss;

          let inUsdc = bought * SushiswapPrice;
          let loss2 = inUsdc * 0.05/100;
          inUsdc= inUsdc-loss2;
          inUsdc = inUsdc - loanfee;



          console.log("\x1b[49m", "******* PROFIT IN USDC *******", "\x1b[0m");
          console.log("FINAL PROFIT AT 10000 USDC BUY AT UNI : ", inUsdc);
        }
        




        }
        else
        {
          console.log("\x1b[34m", "******* FETCHING PRICES *******", "\x1b[0m");
        }

      }, i * 30000)
    }
}
printNumbersForEvery2Sec(10);

