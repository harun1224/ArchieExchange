import { Box, Button, Tooltip } from "@material-ui/core";

import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RangoClient, TransactionStatus } from "rango-sdk";
import ReactLoading from "react-loading";

import BestRoute from "./BestRoute";
import {closeAll, info, multiChainSwap} from "../../slices/MessagesSlice";
import NetworkModal from "./NetworkModal";
import SwapSettingmodal from "./swapsetting";
import TokenModal from "./TokenModal";
import { useWeb3Context } from "../../hooks";
import { swapNetworks, modalType } from "./data";
import { RANGO_API_KEY, RANGO_AFFILIATE_REF_ID, FEE_CONTRACT } from "../../constants";
import { getSavedNetworkId } from "../../hooks/web3Context";
import {
  formatAmount,
  getDownRate,
  expectSwapErrors,
  sliceList,
  requireAssetMessage, prepareEvmTransaction, checkApprovalSync, sortTokenList, setIsDexLoading,
} from "../../helpers/Dex";
import useDebounce from "../../hooks/Debounce";
import { sleep } from "../../helpers/Sleep";
import { trim } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import { NetworkIds } from "../../networks";
import { DebugHelper } from "../../helpers/DebugHelper";
import "./dex.scss";
import { ethers } from "ethers";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { abi as fee_contract_abi } from "src/abi/FeeContract.json";
import FromTokenSection from "./FromTokenSection";
import ToTokenSection from "./ToTokenSection";

import WalletModal from "./WalletModal";

const rangoClient = new RangoClient(RANGO_API_KEY);


let messageDetail;

function Dex() {

  const dispatch = useDispatch();

  const { provider, connect, switchEthereumChain, address } = useWeb3Context();
  const [fromNetworkModalOpen, setFromNetworkModalOpen] = useState(false);
  const [fromTokenModalOpen, setFromTokenModalOpen] = useState(false);
  const [fromNetwork, setFromNetwork] = useState(null);
  const [fromTokenList, setFromTokenList] = useState([]);
  const [fromSearchTokenList, setFromSearchTokenList] = useState([]);
  const [fromToken, setFromToken] = useState(null);
  const [fromTokenAmount, setFromTokenAmount] = useState("");
  const fromTokenAmountDebounce = useDebounce(fromTokenAmount, 1000);
  const [toNetworkModalOpen, setToNetworkModalOpen] = useState(false);
  const [toTokenModalOpen, setToTokenModalOpen] = useState(false);
  const [toNetwork, setToNetwork] = useState(null);
  const [toTokenList, setToTokenList] = useState([]);
  const [toSearchTokenList, setToSearchTokenList] = useState([]);
  const [toToken, setToToken] = useState(null);
  const [toTokenAmount, setToTokenAmount] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [fromUpdateTokenLoading, setFromUpdateTokenLoading] = useState(false);
  const [toUpdateTokenLoading, setToUpdateTokenLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [bestRoute, setBestRoute] = useState(null);
  const [requiredAssets, setRequiredAssets] = useState([]);
  const [slippage, setSlippage] = useState(1);
  const [feeAddress, setFeeAddress] = useState("");
  const [feeEnabled, setFeeEnabled] = useState(false);
  const [swapSetting, SetswapSetting] = useState(false);
  const [walletOpen, SetwalletOpen] = useState(false);
  const isDarkMode = useSelector(state => state.darkmode.DarkState);

  const metaData = useSelector(state => {
    return state?.swap?.value;
  });

  const changeNetworks = async (chainId) => {
    const result = await switchEthereumChain(chainId);
    if (!result) {
      const message = "Unable to switch networks. Please change network using provider.";
      dispatch(error(message));
    }
    return result;
  };

  const outOfService = (chainName) => {
    dispatch(info(`Swap on ${chainName} chain is currently out of service.`));
  };

  const isSwappable = () => {
    return (bestRoute && bestRoute?.result) && expectSwapErrors(bestRoute?.result?.swaps).length === 0 && requireAssetMessage(requiredAssets).length === 0;
  };

  const isPriceImpact = () => {
    return isSwappable() && getDownRate(fromToken, toToken, fromTokenAmount, toTokenAmount)< -5;
  };

  const initialize = async () => {
    if (!metaData) {
      return;
    }
    setInitialLoading(true);
    const toNetwork = swapNetworks[2];
    let fromNetwork;
    fromNetwork = swapNetworks[0];
    setFromNetwork(fromNetwork);
    setToNetwork(toNetwork);
    setInitialLoading(false);
    await fromNetworkDetails(fromNetwork);
    await toNetworkDetails(toNetwork);
    setInitialized(true);
  };

  const setMaxFromTokenAmount = () => {
    setFromTokenAmount(Number(formatAmount(fromToken?.amount, fromToken?.decimals, 2, fromToken?.symbol)));
  };

  const opeNetworkModal = (type) => {
    if (type === modalType.from) {
      setFromNetworkModalOpen(true);
    } else {
      setToNetworkModalOpen(true);
    }
  };

  const closeAllModal = () => {
    setFromNetworkModalOpen(false);
    setToNetworkModalOpen(false);
    setFromTokenModalOpen(false);
    setToTokenModalOpen(false);
  };

  const openTokenModal = (type) => {
    if (type === modalType.from) {
      setFromTokenModalOpen(true);
    } else {
      setToTokenModalOpen(true);
    }
  };

  const closeNetworkModal = (type, network) => {
    closeAllModal();
    if (!network) {
      return;
    }
    if (type === modalType.from) {
      setFromNetwork(network);
    } else {
      setToNetwork(network);
    }
    setBestRoute(null);
  };

  const closeTokenModal = (type, token) => {
    closeAllModal();
    if (!token) {
      return;
    }
    if (type === modalType.from) {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setToTokenAmount("");
    setBestRoute(null);
  };

  const changeTokenModalList = (name, type) => {
    if (type === modalType.from) {
      const list = fromTokenList.filter(token => token.symbol.toLowerCase().indexOf(name.toLowerCase())>=0);
      setFromSearchTokenList(list);
    } else {
      const list = toTokenList.filter(token => token.symbol.toLowerCase().indexOf(name.toLowerCase())>=0);
      setToSearchTokenList(list);
    }
  };

  const fromNetworkDetails = async (fromNetwork) => {
    setFromUpdateTokenLoading(true);
    let fromTokenList = metaData.tokens.filter(token => token?.blockchain === fromNetwork?.blockchain);
    if (fromTokenList.length) {
      fromTokenList = fromTokenList.map(token => {
        return { ...token, amount: 0 };
      });
    }
    setFromTokenList(fromTokenList);
    setFromSearchTokenList(fromTokenList);
    if (!address) {
      sortTokenList(fromNetwork, fromTokenList);
      setFromToken(fromTokenList[0]);
      setFromUpdateTokenLoading(false);
      return;
    }
    const walletDetails = await rangoClient.getWalletsDetails([{
      blockchain: fromNetwork?.blockchain,
      address: address,
    }]);
    walletDetails.wallets.forEach(wallet => {
      if (wallet.balances) {
        wallet.balances.forEach(balance => {
          const index = fromTokenList.findIndex(token => token.address === balance?.asset?.address);
          if (index>=0) {
            fromTokenList[index].amount = Number(balance?.amount.amount) || 0;
          }
        });
      } else {
        outOfService(wallet.blockChain);
      }
    });
    fromTokenList.sort((a, b) => b.amount - a.amount);
    sortTokenList(fromNetwork, fromTokenList);
    setFromTokenList(fromTokenList);
    setFromSearchTokenList(fromTokenList);
    setFromToken(fromTokenList[0]);
    setFromUpdateTokenLoading(false);
  };

  const toNetworkDetails = async (toNetwork) => {
    setToUpdateTokenLoading(true);
    let toTokenList = metaData.tokens.filter(token => token.blockchain === toNetwork?.blockchain);
    if (toTokenList.length) {
      toTokenList = toTokenList.map(token => {
        return { ...token, amount: 0 };
      });
    }
    setToTokenList(toTokenList);
    setToSearchTokenList(toTokenList);
    if (!address) {
      sortTokenList(toNetwork, toTokenList);
      if (!fromNetwork && fromNetwork?.blockchain === toNetwork?.blockchain) {
        setToToken(toTokenList[1]);
      } else {
        setToToken(toTokenList[0]);
      }
      setToUpdateTokenLoading(false);
      return;
    }
    const walletDetails = await rangoClient.getWalletsDetails([{
      blockchain: toNetwork?.blockchain,
      address: address,
    }]);
    walletDetails.wallets.forEach(wallet => {
      if (wallet.balances) {
        wallet.balances.forEach(balance => {
          const index = toTokenList.findIndex(token => token.address === balance?.asset?.address);
          if (index>=0) {
            toTokenList[index].amount = Number(balance?.amount.amount) || 0;
          }
        });
      } else {
        outOfService(wallet.blockChain);
      }
    });
    toTokenList.sort((a, b) => b.amount - a.amount);
    sortTokenList(toNetwork, toTokenList);
    setToTokenList(toTokenList);
    setToSearchTokenList(toTokenList);
    if (!fromNetwork && fromNetwork?.blockchain === toNetwork?.blockchain) {
      setToToken(toTokenList[1]);
    } else {
      setToToken(toTokenList[0]);
    }
    setToUpdateTokenLoading(false);
  };

  const getBestRoute = async () => {
    setRouteLoading(true);
    setToTokenAmount("");
    let connectedWallets = [];
    const selectedWallets = {};
    if (address) {
      connectedWallets = swapNetworks.map(network => {
        return {
          blockchain: network?.blockchain,
          addresses: [address],
        };
      });
      selectedWallets[fromNetwork?.blockchain] = address;
      if (fromNetwork?.chainId !== toNetwork?.chainId) {
        selectedWallets[toNetwork?.blockchain] = address;
      }
    }
    const from = {
      blockchain: fromToken?.blockchain,
      symbol: fromToken?.symbol,
      address: fromToken?.address?.toLowerCase(),
    };
    const to = {
      blockchain: toToken?.blockchain,
      symbol: toToken?.symbol,
      address: toToken?.address == null ? toToken?.address : toToken?.address?.toLowerCase(),
    };
    const bestRoute = await rangoClient.getBestRoute({
      amount: fromTokenAmount * 0.98,
      affiliateRef: RANGO_AFFILIATE_REF_ID,
      checkPrerequisites: true,
      connectedWallets,
      from,
      selectedWallets,
      to,
    });
    messageDetail = {
      details: [],
      step: 0,
      type: "swap",
      title: `Swap ${ fromTokenAmount } ${ fromToken.symbol } to ${ toToken.symbol }`,
    };
    if (bestRoute?.result?.swaps?.length) {
      bestRoute.result.swaps = bestRoute.result.swaps.map(swap => {
        return {
          ...swap,
          logo: metaData?.swappers.find(sw => sw.id === swap.swapperId)?.logo,
        };
      });
      bestRoute.result.swaps.forEach((swap, index) => {
        messageDetail.details.push({
          text: "",
          txStatus: null,
          txHash: null,
          step: index,
          swap,
        });
      });
    }
    setBestRoute(bestRoute);
    setToTokenAmount(trim(bestRoute?.result?.outputAmount, 4) || 0);
    setRouteLoading(false);
    const requiredAssets = bestRoute.validationStatus?.flatMap(v => v.wallets.flatMap(w => w.requiredAssets)) || [];
    setRequiredAssets(requiredAssets);
  };

  const beforeUnloadListener = (event) => {
    event.preventDefault();
    return event.returnValue = "Are you sure you want to cancel swap and leave it not complete?";
  };

  const preventLeave = (prevent) => {

    const root = document.documentElement;

    if(prevent) {
      root.style.cursor = "progress";
      document.body.setAttribute("is-paralyzed", "");
      addEventListener("beforeunload", beforeUnloadListener, {capture: true});
    } else {
      root.style.removeProperty("cursor");
      document.body.removeAttribute("is-paralyzed");
      removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
    }
  }

  const swap = async () => {
    let currentStep = 0;
    messageDetail.step = currentStep;
    if (messageDetail.details.length>=0) {
      messageDetail.details[currentStep].text = "Swap process started";
    }
    dispatch(multiChainSwap(JSON.parse(JSON.stringify(messageDetail))));
    setRequiredAssets([]);
    setForceBondLoading(false);
    if (!fromToken || !toToken) {
      return;
    }
    setSwapLoading(true);
    preventLeave(true);
    setIsDexLoading("true");
    try {
      
      if (feeEnabled) {
        /// here fee
        const feeResult = await payFee(bestRoute)
        if (!feeResult) {
          setSwapLoading(false);
          dispatch(closeAll());
          setBestRoute(null);
          await fromNetworkDetails(fromNetwork);
          await toNetworkDetails(toNetwork);
        }

        while (feeResult) {
          const txStatus = await executeRoute(bestRoute, currentStep);
          if (!txStatus || txStatus?.status !== TransactionStatus.SUCCESS || currentStep>=bestRoute.result.swaps.length - 1) {
            break;
          }
          currentStep++;
        }
      } else {
        while(true) {
          const txStatus = await executeRoute(bestRoute, currentStep);
          if (!txStatus || txStatus?.status !== TransactionStatus.SUCCESS || currentStep>=bestRoute.result.swaps.length - 1) {
            break;
          }
          currentStep++;
        }
      }
      

     
    } catch (e) {
      console.log("error", e);
    } finally {
      setIsDexLoading("false");
    }
    preventLeave(false);
  };

  const payFee = async (routeResponse) => {
    const network = swapNetworks.find(network => network.blockchain === routeResponse.result.swaps[0].from.blockchain);
    if (network.chainId !== getSavedNetworkId()) {
      console.log('change wallet network');
      messageDetail.details[0].text = `Please change your wallet network to ${ network.blockchain }`;
      dispatch(multiChainSwap(JSON.parse(JSON.stringify(messageDetail))));
      const result = await changeNetworks(network?.chainId);
      if (!result) {
        dispatch(closeAll());
        return false;
      }
    }

    messageDetail.details[0].text = `You have to pay 0.1% fee`;
    const fee = fromTokenAmount * 0.001;
    const tokenAddress = routeResponse.result.swaps[0].from.address;
    console.log('from: ', tokenAddress);
    dispatch(multiChainSwap(JSON.parse(JSON.stringify(messageDetail))));
    const signer = provider.getSigner();

    try {
      if (!tokenAddress) {
        console.log('fee: ', fee);
        const res = await signer.sendTransaction({
          to: feeAddress,
          value: ethers.utils.parseEther(fee.toString().substring(0, 10))
        })
        return true;
      } else {
        console.log('abi: ', ierc20Abi);
        const erc20Contract = new ethers.Contract(tokenAddress, ierc20Abi, signer);
        const res = await erc20Contract.transfer(
          feeAddress, 
          ethers.utils.parseEther(fee.toString().substring(0, 10))
        );
        
        console.log(res);
        return true;
      }
      
    } catch (error) {
      console.log('error: ', error)
      return false;
    }
    
  }

  const executeRoute = async (routeResponse, step) => {
    if (routeResponse.result.swaps[step]) {
      const network = swapNetworks.find(network => network.blockchain === routeResponse.result.swaps[step].from.blockchain);
      if (network.chainId !== getSavedNetworkId()) {
        messageDetail.details[step].text = `Please change your wallet network to ${ network.blockchain }`;
        const result = await changeNetworks(network?.chainId);
        if (!result) {
          dispatch(closeAll());
          return;
        }
      }
    }
    messageDetail.details[step].text = `Sending request to ${ routeResponse.result.swaps[step].swapperId } for ${ routeResponse.result.swaps[step].from?.blockchain }.${ routeResponse.result.swaps[step].from?.symbol } token`;
    messageDetail.step = step;
    dispatch(multiChainSwap(JSON.parse(JSON.stringify(messageDetail))));
    const signer = provider.getSigner();

    let evmTransaction;
    try {
      while (true) {
        const transactionResponse = await rangoClient.createTransaction({
          requestId: routeResponse.requestId,
          step: step + 1,
          userSettings: { "slippage": slippage },
          validations: { balance: true, fee: true },
        });

        evmTransaction = transactionResponse.transaction;
        if (evmTransaction.isApprovalTx) {
          const finalTx = prepareEvmTransaction(evmTransaction);
          await signer.sendTransaction(finalTx);
          await checkApprovalSync(routeResponse, rangoClient);
        } else {
          break;
        }
      }
      const finalTx = prepareEvmTransaction(evmTransaction);
      const txHash = (await signer.sendTransaction(finalTx)).hash;
      messageDetail.details[step].text = `Request sent to ${ routeResponse.result.swaps[step].swapperId } for ${ routeResponse.result.swaps[step].from?.blockchain }.${ routeResponse.result.swaps[step].from?.symbol } token`;
      messageDetail.details[step].txHash = txHash;
      dispatch(multiChainSwap(JSON.parse(JSON.stringify(messageDetail))));
      const txStatus = await checkTransactionStatusSync(txHash, routeResponse, rangoClient, step);
      if (txStatus?.step>=routeResponse.result.swaps.length - 1) {
        if (fromNetwork?.chainId === NetworkIds.FantomOpera || toNetwork?.chainId === NetworkIds.FantomOpera) {
          setForceBondLoading(true);
        }
        setSwapLoading(false);
        setBestRoute(null);
        setFromTokenAmount("");
        setToTokenAmount("");
        dispatch(closeAll());
        await fromNetworkDetails(fromNetwork);
        await toNetworkDetails(toNetwork);
      }
      return txStatus;
    } catch (e) {
      setSwapLoading(false);
      const rawMessage = JSON.stringify(e).substring(0, 90) + "...";
      await rangoClient.reportFailure({
        data: { message: rawMessage },
        eventType: "TX_FAIL",
        requestId: routeResponse.requestId,
      });
      dispatch(closeAll());
      setBestRoute(null);
      await fromNetworkDetails(fromNetwork);
      await toNetworkDetails(toNetwork);
      return {
        status: TransactionStatus.FAILED,
      };
    }
  };

  const checkTransactionStatusSync = async (txHash, bestRoute, rangoClient, step) => {
    while (true) {
      let txStatus = await rangoClient.checkStatus({
        requestId: bestRoute.requestId,
        step: step + 1,
        txId: txHash,
      });
      txStatus = { ...txStatus, step };
      messageDetail.details[step].txStatus = txStatus;
      dispatch(multiChainSwap(JSON.parse(JSON.stringify(messageDetail))));

      if (!!txStatus.status && [TransactionStatus.FAILED, TransactionStatus.SUCCESS].includes(txStatus.status)) {
        return txStatus;
      }
      await sleep(3);
    }
  };

  useEffect(() => {
    DebugHelper.isActive("enable-debug");
    initialize().then();
    setIsDexLoading("false");
  }, [metaData, address]);

  useEffect(() => {
    if (!fromNetwork || !toNetwork) {
      return;
    }
    fromNetworkDetails(fromNetwork).then();
    toNetworkDetails(toNetwork).then();
  }, [address]);

  useEffect(() => {
    if (!fromNetwork || !initialized) {
      return;
    }
    fromNetworkDetails(fromNetwork).then();
  }, [fromNetwork]);

  useEffect(() => {
    if (!toNetwork || !initialized) {
      return;
    }
    toNetworkDetails(toNetwork).then();
  }, [toNetwork]);

  useEffect(() => {
    if (!fromTokenAmount || fromTokenAmount === 0 || !fromToken || !toToken || !initialized) {
      setBestRoute(null);
      setToTokenAmount("");
      return;
    }
    getBestRoute().then();
  }, [fromToken, toToken, fromTokenAmountDebounce]);

  useEffect(async () => {
   const eth_provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/84842078b09946638c03157f83405213');
   const contract = new ethers.Contract(FEE_CONTRACT, fee_contract_abi, eth_provider);

   const _feeAddress = await contract.getFeeAddress();
   const _feeEnabled = await contract.isFeeEnabled();
    
    //  const _feeAddress = "0x01f6ed64AA795E3Fc650A129b59D2408f5B68833";
    //  const _feeEnabled = true;
    setFeeAddress(_feeAddress); 
    setFeeEnabled(_feeEnabled);
  }, [])

  
  const handleSwapSetting = (item) =>{
    setSlippage(item);
  }
  const handleWallet=()=>{
    SetwalletOpen(false);
  }
  
  return (
    <div className="pb-[50px]"> 
      <NetworkModal type={ modalType.from } open={ fromNetworkModalOpen } onClose={ closeNetworkModal } />
      <NetworkModal type={ modalType.to } open={ toNetworkModalOpen } onClose={ closeNetworkModal } />
      <TokenModal type={ modalType.from } open={ fromTokenModalOpen } tokenCount={ fromTokenList.length }
                  tokenList={ fromSearchTokenList } searchList={ sliceList(fromTokenList, 20) }
                  onChange={ changeTokenModalList } onClose={ closeTokenModal } />
      <TokenModal type={ modalType.to } open={ toTokenModalOpen } tokenCount={ toTokenList.length }
                  tokenList={ toSearchTokenList } searchList={ sliceList(toTokenList, 20) }
                  onChange={ changeTokenModalList } onClose={ closeTokenModal } />
      <SwapSettingmodal open={swapSetting} slippage={slippage} handleSwapSetting={handleSwapSetting} onClose={()=>SetswapSetting(false)}/>
      <WalletModal open={walletOpen} onClose={handleWallet}/> 

      <div className={`${isDarkMode ? 'bg-[#131823]' : 'bg-white'} mt-9 rounded-[12px] w-11/12 sm:w-10/12 md:w-[32rem] mx-auto p-2`}>
        <div className="flex flex-row px-2">
            <div className=" flex flex-grow items-center justify-start  text-left">
              <p className={`${isDarkMode ? "text-white" : 'text-black'} text-[1.25rem] leading-[20px] font-medium max-[418px]:text-[12px]`}>Swap</p>
            </div>
            <div className="flex justify-end text-right">
              <Button>
                <Box onClick={()=>SetswapSetting(true)}>
                  <svg style={{fill:`${isDarkMode ? 'white' : 'black'}`, width:"24px", height:"24px" }}>
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z">
                    </path>
                  </svg>
                </Box>                
              </Button>
            </div>
        </div>
        { initialLoading ?
            <Box display="flex" justifyContent="center" alignItems="center">
                    <ReactLoading type="spinningBubbles" color="#fff" />
                  </Box> : (
        <div className="flex flex-col mt-4 relative">
          <FromTokenSection fromToken={ fromToken } fromTokenAmount={ fromTokenAmount }
                                          fromNetwork={ fromNetwork }
                                          setFromTokenAmount={ setFromTokenAmount }
                                          setMaxFromTokenAmount={ setMaxFromTokenAmount }
                                          fromUpdateTokenLoading={ fromUpdateTokenLoading }
                                          openTokenModal={ openTokenModal }
                                          opeNetworkModal={ opeNetworkModal } />                            
          <ToTokenSection fromToken={ fromToken } fromTokenAmount={ fromTokenAmount } toToken={ toToken }
                                        toTokenAmount={ toTokenAmount } toNetwork={ toNetwork }
                                        openTokenModal={ openTokenModal } opeNetworkModal={ opeNetworkModal }
                                        toUpdateTokenLoading={ toUpdateTokenLoading } />
          {fromTokenAmount > 0 ?
          <BestRoute bestRoute={ bestRoute } routeLoading={ routeLoading } slippage={ slippage }
                                 setSlippage={ setSlippage } metaData={ metaData }
                                 fromTokenAmount={ fromTokenAmount } toTokenAmount={ toTokenAmount }
                                 fromToken={ fromToken }
                                 toToken={ toToken } requiredAssets={ requiredAssets } />
          :<></>}
          <Box mt="20px" display="flex" justifyContent="center" alignItems="center">
                        {
                          !address && <Button
                            variant="contained"
                            color="primary"
                            bgcolor="#2F8AF5"
                            className={`bg-[#2F8AF5]/[.16]' w-full text-[#2F8AF5] hover:bg-[#7b8dc9]`}
                            onClick={()=> connect() }
                          >
                            {/* !address && <Button
                            variant="contained"
                            color="primary"
                            bgcolor="#2F8AF5"
                            // style={{backgroundColor: 'rgba(47, 138, 245, 0.16)'}}
                            className={`bg-[#2F8AF5]/[.16]' w-full text-[#2F8AF5] hover:bg-[#7b8dc9]`}
                            onClick={()=> SetwalletOpen(true) }
                          > */}
                            {/* <div className="self-center mr-3">
                              <img src={ConnectWalletBtn}/>
                            </div> */}
                            <p className="text-[16px] font-medium self-center">Connect Wallet</p>
                          </Button>
                        }
                        {
                          address && !isPriceImpact() && <Button
                            variant="contained"
                            bgcolor="#2F8AF5"
                            style={{backgroundColor: 'rgba(47, 138, 245, 0.16)'}}
                            className={`bg-[#2F8AF5]/[.86]' w-full`}
                            disabled={ !isSwappable() || swapLoading }
                            onClick={ () => swap() }
                          >
                            {
                              !isSwappable() || swapLoading ?
                                <h4 style={{color: `${isDarkMode ? "text-['#958e8ed6']" : "#aba0a0d6"}`}}> SWAP </h4>
                                :<></>
                            }
                            {
                              isSwappable() && !swapLoading ? 
                                <h4 className={`${isDarkMode ? "text-['white']" : "text-['black']"}`}> SWAP </h4>
                                :<></>
                            }
                          </Button>
                        }
                        {
                          address && isPriceImpact() && <Box className="price-impact">
                            <Button
                              variant="contained"
                              className="price-impact w-full"
                              disabled={ !isPriceImpact() || swapLoading }
                              onClick={ () => swap() }
                            >
                              <Box display="flex" alignItems="center">
                                Price impact is too high!
                                <Box ml="10px" display="flex" alignItems="center">
                                  <Tooltip
                                    arrow
                                    title={ `The estimated output is ${ getDownRate(fromToken, toToken, fromTokenAmount, toTokenAmount).toFixed(2) }% lower than input amount. Please be careful.` }
                                  >
                                    <HelpOutlineIcon viewBox="0 0 25 25" />
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Button>
                          </Box>
                        }
                  </Box>                           
        </div>
        )  
      }
      </div>
    </div>
  );
}

export default memo(Dex);