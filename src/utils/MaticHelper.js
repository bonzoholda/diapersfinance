import { ethers, utils } from 'ethers';
import { DYPRTokenABI } from './DYPRTokenABI';
import { WYPETokenABI } from './WYPETokenABI';
import { ShitPoolABI } from './ShitPoolABI';
import { WypePoolABI } from './WypePoolABI';
import { QuickSwapRouterABI } from './QuickSwapRouterABI';
import { WypeShitFarmABI } from './WypeShitFarmABI';
import axios from 'axios';

const pairABI = [
  'function price0CumulativeLast() external view returns (uint)',
  'function price1CumulativeLast() external view returns (uint)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
];

const ERC20ABI = [
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() public view returns (uint8)',
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function allowance(address owner, address spender) public view returns (uint256)',
];

//Mainnet
const provider = new ethers.providers.JsonRpcProvider(
  'https://polygon-rpc.com'
);
const dyprTokenAddress = '0x92fF563cE14fC62A5A87961CaBf1f98748fbBaEe'; //
const shitPoolAddress = '0x22762a8a33b7Cb7c52AfAD5096B3b0790DE1c649'; //
const pairAddressDYPR = '0xF5643d91CE7b1Fb1e01A7a15E7b9977e9A0d4E77'; //
const wypeTokenAddress = '0x9fACF2F2Bc061Ceb2f3Cd68B0917e98F590E8ea6';
const wypePoolAddress = '0x47b15Da820c2CCe99a3299669C02849122ab02de';
const pairAddressWYPE = '0x59Ec17F69Ebcf42c75e171df98853d42c17E7F1D';
const quickSwapRouterAddress = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff'; //
const WMATICAddress = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'; //
const USDCAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; //
const wypeShitFarmAddress = '0xD960aE078DD5b3Ef676abEf7F03b2ae12A56f1F2';
const oldWypeVaultAddress = '0xc8ba578e05c1931c82788004f8fe85933b668bad';

// Testnet
// const provider = new ethers.providers.JsonRpcProvider(
//   'https://matic-testnet-archive-rpc.bwarelabs.com'
// );
// const dyprTokenAddress = '0x0FADF8b7dF2508A36CD0c536b98d206a2C9aee5b';
// const shitPoolAddress = '0xA5048Ff327ee59DE539888A96603da63089fd20d';
// const pairAddressDYPR = '0x3cD4678cf32b7D8Ea80b8c0d921Fecd4a49A8dac';
// const wypeTokenAddress = '0x97181e51383492cecBcc4dAaA034c6A3f792d9A5';
// const wypePoolAddress = '0x036ea534f80ec13776a82ABcF68BC6563B241421';
// const pairAddressWYPE = '0x7D4dF57c5D779dFD03fe362b5C4c47dccE2D3F03';
// const quickSwapRouterAddress = '0x8954AfA98594b838bda56FE4C12a09D7739D179b';
// const WMATICAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
// const USDCAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
// const wypeShitFarmAddress = '0xA2138AFEb91d386Ba37e8d9DFa0e49277EcAcA77';

const dyprTokenContract = new ethers.Contract(
  dyprTokenAddress,
  DYPRTokenABI,
  provider
);
const shitPoolContract = new ethers.Contract(
  shitPoolAddress,
  ShitPoolABI,
  provider
);
const wypeTokenContract = new ethers.Contract(
  wypeTokenAddress,
  WYPETokenABI,
  provider
);
const wypePoolContract = new ethers.Contract(
  wypePoolAddress,
  WypePoolABI,
  provider
);
const USDCContract = new ethers.Contract(USDCAddress, ERC20ABI, provider);

const pairDYPRContract = new ethers.Contract(
  pairAddressDYPR,
  pairABI,
  provider
);
const pairWYPEContract = new ethers.Contract(
  pairAddressWYPE,
  pairABI,
  provider
);
const quickSwapRouterContract = new ethers.Contract(
  quickSwapRouterAddress,
  QuickSwapRouterABI,
  provider
);
const wypeShitFarmContract = new ethers.Contract(
  wypeShitFarmAddress,
  WypeShitFarmABI,
  provider
);

Number.prototype.toFixedDown = function (digits) {
  var re = new RegExp('(\\d+\\.\\d{' + digits + '})(\\d)'),
    m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
};

export const getDYPRBalance = async address => {
  let balance = parseFloat(
    utils.formatEther(await dyprTokenContract.balanceOf(address))
  );
  return balance;
};
export const getWYPEBalance = async address => {
  let balance = parseFloat(
    utils.formatEther(await wypeTokenContract.balanceOf(address))
  );
  return balance;
};
export const getMATICBalance = async address => {
  let balance = parseFloat(
    utils.formatEther(await provider.getBalance(address))
  );
  return balance;
};
export const getUSDCBalance = async address => {
  let balance = parseFloat(
    utils.formatUnits(
      await USDCContract.balanceOf(address),
      await USDCContract.decimals()
    )
  );
  return balance;
};
export const getStakesDYPR = async address => {
  let stakes = await dyprTokenContract.getUserStakes(address);
  let maturity = parseFloat(await dyprTokenContract.maturity());
  let parsedStakes = [];
  for (let i = 0; i < stakes.length; i++) {
    const stake = stakes[i];
    parsedStakes.push({
      amount: parseFloat(utils.formatEther(stake[0])),
      timestamp: parseFloat(stake[1]) * 1000,
      reward: parseFloat(
        utils.formatEther(await shitPoolContract.calculateRewards(stake[0]))
      ),
      isReady:
        Math.floor(Date.now() / 1000) > parseFloat(stake[1]) + maturity
          ? true
          : false,
      readyTimestamp: (parseFloat(stake[1]) + maturity) * 1000,
    });
  }
  parsedStakes = parsedStakes.sort((a, b) => a.timestamp - b.timestamp);
  return parsedStakes;
};
export const getStakesWYPE = async address => {
  let stakes = await wypeTokenContract.getUserStakes(address);
  let maturity = parseFloat(await wypeTokenContract.maturity());
  let DYPRBalance = await getDYPRBalance(address);
  let parsedStakes = [];
  for (let i = 0; i < stakes.length; i++) {
    const stake = stakes[i];
    parsedStakes.push({
      amount: parseFloat(utils.formatEther(stake[0])),
      timestamp: parseFloat(stake[1]) * 1000,
      reward: parseFloat(
        utils.formatEther(await wypePoolContract.calculateRewards(stake[0]))
      ),
      adjustedreward: parseFloat(
        utils.formatEther(
          await wypePoolContract.calculateRewards(
            utils.parseEther(
              Math.min(utils.formatEther(stake[0]), DYPRBalance).toString()
            )
          )
        )
      ),
      isReady:
        Math.floor(Date.now() / 1000) > parseFloat(stake[1]) + maturity
          ? true
          : false,
      readyTimestamp: (parseFloat(stake[1]) + maturity) * 1000,
    });
  }
  parsedStakes = parsedStakes.sort((a, b) => a.timestamp - b.timestamp);
  return parsedStakes;
};
export const getDYPRPoolShare = addressDYPRBalance => {
  return addressDYPRBalance / 100;
};
export const getWYPEPoolShare = addressWYPEBalance => {
  return addressWYPEBalance / 100;
};
export const rewardsDYPRAvailableNow = async address => {
  let rewards = parseFloat(
    utils.formatEther(await shitPoolContract.getRewards(address))
  );
  return rewards;
};
export const rewardsWYPEAvailableNow = async address => {
  let rewards = parseFloat(
    utils.formatEther(await wypePoolContract.getRewards(address))
  );
  return rewards;
};
export const claimDYPR = async signer => {
  let tx = await shitPoolContract.connect(signer).claim();
  return tx;
};
export const claimWYPE = async signer => {
  let tx = await wypePoolContract.connect(signer).claim();
  return tx;
};
export const getAmountMaticInDYPROut = async MaticIn => {
  let amountOut = await quickSwapRouterContract.getAmountsOut(
    utils.parseEther(MaticIn),
    [WMATICAddress, dyprTokenAddress]
  );
  let DYPROut = parseFloat(utils.formatEther(amountOut[1]));
  return DYPROut;
};
export const getAmountUSDCInWYPEOut = async USDCIn => {
  let amountOut = await quickSwapRouterContract.getAmountsOut(
    utils.parseUnits(USDCIn, await USDCContract.decimals()),
    [USDCAddress, wypeTokenAddress]
  );
  let WYPEOut = parseFloat(utils.formatEther(amountOut[1]));
  return WYPEOut;
};
export const getAmountDYPRInMaticOut = async DYPRIn => {
  let amountOut = await quickSwapRouterContract.getAmountsOut(
    utils.parseEther(DYPRIn),
    [dyprTokenAddress, WMATICAddress]
  );
  let MaticOut = parseFloat(utils.formatEther(amountOut[1]));
  return MaticOut;
};
export const getAmountWYPEInUSDCOut = async WYPEIn => {
  let amountOut = await quickSwapRouterContract.getAmountsOut(
    utils.parseEther(WYPEIn),
    [wypeTokenAddress, USDCAddress]
  );
  let USDCOut = parseFloat(
    utils.formatUnits(amountOut[1], await USDCContract.decimals())
  );
  return USDCOut;
};
export const getDYPRPrice = async () => {
  const reserves = await pairDYPRContract.getReserves();
  const DYPRReserve = parseFloat(utils.formatEther(reserves[1]));
  const MATICReserve = parseFloat(utils.formatEther(reserves[0]));
  console.log({ DYPRReserve, MATICReserve });
  const price = MATICReserve / DYPRReserve;
  return price;
};
export const getWYPEPrice = async () => {
  const reserves = await pairWYPEContract.getReserves();
  const WYPEReserve = parseFloat(utils.formatEther(reserves[1]));
  const USDCReserve = parseFloat(
    utils.formatUnits(reserves[0], await USDCContract.decimals())
  );
  console.log({ WYPEReserve, USDCReserve });
  const price = USDCReserve / WYPEReserve;
  return price;
};


export const getMATICPrice = async () => {
  try {
    // Polygon mainnet RPC (free and public)
    const POLYGON_RPC = "https://polygon-rpc.com";

    // Official Chainlink POL/USD feed address
    const FEED_ADDRESS = "0x60fAa7faC949aF392DFc858F5d97E3EEfa07E9EB";

    // Minimal ABI to read latest price
    const aggregatorV3InterfaceABI = [
      {
        "inputs": [],
        "name": "latestRoundData",
        "outputs": [
          { "name": "roundId", "type": "uint80" },
          { "name": "answer", "type": "int256" },
          { "name": "startedAt", "type": "uint256" },
          { "name": "updatedAt", "type": "uint256" },
          { "name": "answeredInRound", "type": "uint80" }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    // Connect to Polygon RPC
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC);
    const priceFeed = new ethers.Contract(FEED_ADDRESS, aggregatorV3InterfaceABI, provider);

    // Call latestRoundData from Chainlink oracle
    const roundData = await priceFeed.latestRoundData();

    // Convert from 8-decimal Chainlink format
    const price = Number(roundData.answer) / 1e8;

    return price;
  } catch (error) {
    console.error("Error fetching POL/USD price from Chainlink:", error);
    return null;
  }
};


export const buyDYPRTx = async (amountIn, amountOut, signer, address) => {
  const fixedAmount = Number(amountIn).toFixedDown(18).toFixed(18);
  let tx = await quickSwapRouterContract.connect(signer).swapExactETHForTokens(
    utils.parseEther(
      Number(parseFloat(amountOut) * 0.87)
        .toFixedDown(18)
        .toFixed(18)
        .toString()
    ),
    [WMATICAddress, dyprTokenAddress],
    address,
    Math.floor(Date.now() / 1000 + 86400),
    {
      value: utils.parseEther(fixedAmount.toString()),
    }
  );
  return tx;
};
export const buyWYPETx = async (amountIn, amountOut, signer, address) => {
  const fixedAmount = Number(amountIn)
    .toFixedDown(await USDCContract.decimals())
    .toFixed(await USDCContract.decimals());
  let tx = await quickSwapRouterContract
    .connect(signer)
    .swapExactTokensForTokens(
      utils.parseUnits(fixedAmount.toString(), await USDCContract.decimals()),
      utils.parseEther(
        Number(parseFloat(amountOut) * 0.87)
          .toFixedDown(18)
          .toFixed(18)
          .toString()
      ),
      [USDCAddress, wypeTokenAddress],
      address,
      Math.floor(Date.now() / 1000 + 86400)
    );
  return tx;
};
export const sellDYPRTx = async (amountIn, amountOut, signer, address) => {
  const fixedAmount = Number(amountIn).toFixedDown(18).toFixed(18);

  console.log({ amountIn, amountOut });
  let tx = await quickSwapRouterContract
    .connect(signer)
    .swapExactTokensForETHSupportingFeeOnTransferTokens(
      utils.parseEther(fixedAmount.toString()),
      utils.parseEther(
        Number(parseFloat(amountOut) * 0.5)
          .toFixedDown(18)
          .toFixed(18)
          .toString()
      ),
      [dyprTokenAddress, WMATICAddress],
      address,
      Math.floor(Date.now() / 1000 + 86400)
    );
  return tx;
};
export const sellWYPETx = async (amountIn, amountOut, signer, address) => {
  const fixedAmount = Number(amountIn).toFixedDown(18).toFixed(18);
  console.log({ amountIn, amountOut });
  let tx = await quickSwapRouterContract
    .connect(signer)
    .swapExactTokensForTokensSupportingFeeOnTransferTokens(
      utils.parseEther(fixedAmount.toString()),
      utils.parseUnits(
        Number(parseFloat(amountOut) * 0.5)
          .toFixedDown(await USDCContract.decimals())
          .toFixed(await USDCContract.decimals())
          .toString(),
        await USDCContract.decimals()
      ),
      [wypeTokenAddress, USDCAddress],
      address,
      Math.floor(Date.now() / 1000 + 86400)
    );
  return tx;
};
export const getDYPRAllowanceQuickSwap = async address => {
  const allowance = parseFloat(
    utils.formatEther(
      await dyprTokenContract.allowance(address, quickSwapRouterAddress)
    )
  );
  return allowance;
};
export const getWYPEAllowanceQuickSwap = async address => {
  const allowance = parseFloat(
    utils.formatEther(
      await wypeTokenContract.allowance(address, quickSwapRouterAddress)
    )
  );
  return allowance;
};
export const getUSDCAllowanceQuickSwap = async address => {
  const allowance = parseFloat(
    utils.formatEther(
      await USDCContract.allowance(address, quickSwapRouterAddress)
    )
  );
  return allowance;
};
export const approveDYPRQuickSwap = async signer => {
  let tx = await dyprTokenContract
    .connect(signer)
    .approve(quickSwapRouterAddress, ethers.constants.MaxUint256);
  return tx;
};
export const approveUSDCQuickSwap = async signer => {
  let tx = await USDCContract.connect(signer).approve(
    quickSwapRouterAddress,
    ethers.constants.MaxUint256
  );
  return tx;
};
export const approveWYPEQuickSwap = async signer => {
  let tx = await wypeTokenContract
    .connect(signer)
    .approve(quickSwapRouterAddress, ethers.constants.MaxUint256);
  return tx;
};

export const getGoldenShitCirculatingSupply = async () => {
  const circulatingSupply = parseFloat(
    await wypeShitFarmContract.activeGoldenShits()
  );
  return circulatingSupply;
};
export const getGoldenShitPrice = async () => {
  const price = parseFloat(
    utils.formatEther(await wypeShitFarmContract.price())
  );
  return price;
};
export const getPlayerGoldenShits = async address => {
  const goldenShitIds = await wypeShitFarmContract.getGoldenShitsByOwner(
    address
  );
  const goldenShits = await Promise.all(
    goldenShitIds.map(async id => {
      const goldenShit = await wypeShitFarmContract.goldenShits(id);
      return {
        id: parseFloat(id),
        isClaimed: goldenShit.isClaimed,
        owner: goldenShit.owner,
        timestamp: parseFloat(goldenShit.timestamp) * 1000,
      };
    })
  );
  return goldenShits;
};
export const getGoldenShitsRewards = async () => {
  let rewards;
  try {
    rewards = parseFloat(
      utils.formatEther(await wypeShitFarmContract.calculateRewards())
    );
  } catch (err) {}
  return rewards;
};
export const getGoldenShitMaturity = async () => {
  const maturity = parseFloat(await wypeShitFarmContract.maturity()) * 1000;
  return maturity;
};
export const buyGoldenShit = async (amount, price, signer) => {
  const tx = await wypeShitFarmContract.connect(signer).buy(amount, {
    value: ethers.utils.parseEther((amount * price).toString()),
  });
  return tx;
};
export const claimGoldenShit = async (id, signer) => {
  const tx = await wypeShitFarmContract.connect(signer).claim(id);
  return tx;
};
export const claimAllGoldenShit = async signer => {
  const tx = await wypeShitFarmContract.connect(signer).claimAll();
  return tx;
};
export const refreshStatsDYPR = async () => {
  const shitPoolDYPRBalance = await getDYPRBalance(shitPoolAddress);
  const DYPRPrice = await getDYPRPrice();
  const MATICPrice = await getMATICPrice();
  return { shitPoolDYPRBalance, DYPRPrice, MATICPrice };
};
export const refreshAllDataDYPR = async address => {
  const addressDYPRBalance = await getDYPRBalance(address);
  const addressMATICBalance = await getMATICBalance(address);
  const addressStakesDYPR = await getStakesDYPR(address);
  const addressPoolShareDYPR = getDYPRPoolShare(addressDYPRBalance);
  const rewardsAvailableDYPR = await rewardsDYPRAvailableNow(address);

  const DYPRAllowanceQuickSwap = await getDYPRAllowanceQuickSwap(address);
  return {
    addressDYPRBalance,
    addressMATICBalance,
    addressStakesDYPR,
    addressPoolShareDYPR,
    rewardsAvailableDYPR,
    DYPRAllowanceQuickSwap,
  };
};
export const refreshStatsWYPE = async () => {
  const wypePoolBalance = await getWYPEBalance(wypePoolAddress);
  const WYPEPrice = await getWYPEPrice();
  return { wypePoolBalance, WYPEPrice };
};
export const refreshAllDataWYPE = async address => {
  const addressWYPEBalance = await getWYPEBalance(address);
  const addressUSDCBalance = await getUSDCBalance(address);
  const addressStakesWYPE = await getStakesWYPE(address);
  const addressPoolShareWYPE = getWYPEPoolShare(addressWYPEBalance);
  const rewardsAvailableWYPE = await rewardsWYPEAvailableNow(address);
  const WYPEAllowanceQuickSwap = await getWYPEAllowanceQuickSwap(address);
  const USDCAllowanceQuickSwap = await getUSDCAllowanceQuickSwap(address);

  return {
    addressWYPEBalance,
    addressUSDCBalance,
    addressStakesWYPE,
    addressPoolShareWYPE,
    rewardsAvailableWYPE,
    WYPEAllowanceQuickSwap,
    USDCAllowanceQuickSwap,
  };
};
export const refreshStatsGoldenShit = async () => {
  const wypeShitFarmBalance = await getWYPEBalance(wypeShitFarmAddress);
  const goldenShitCirculatingSupply = await getGoldenShitCirculatingSupply();
  const goldenShitPrice = await getGoldenShitPrice();
  return { wypeShitFarmBalance, goldenShitCirculatingSupply, goldenShitPrice };
};
export const refreshAllDataGoldenShit = async address => {
  const playerGoldenShits = await getPlayerGoldenShits(address);
  const rewardsPerGoldenShit = await getGoldenShitsRewards();
  const maturityGoldenShit = await getGoldenShitMaturity();
  return { playerGoldenShits, rewardsPerGoldenShit, maturityGoldenShit };
};
