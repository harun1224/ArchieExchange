import React, { useState, ReactElement, useContext, useMemo, useCallback } from "react";
// import Web3Modal from "web3modal";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import { NetworkId, NetworkIds, networks, enabledNetworkIds } from "src/networks";
import store from "src/store";
import { error } from "src/slices/MessagesSlice";
import { chains } from "src/providers";
import { isDexLoading, isDexPage, requireAssetMessage } from "../helpers/Dex";
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import { getKeplr } from "../helpers/Dex";
// import { Cosmos } from "@keplr-wallet/cosmos"
import Long from "long";
import { AnyArray } from "immer/dist/internal";

declare const window: any;

/**
 * determine if in IFrame for Ledger Live
 */
function isIframe() {
  return window.location !== window.parent.location;
}

// function getURI(networkId: NetworkId): string {
//   return chains[networkId].rpcUrls[0];
// }

interface walletInfo {
  name: string,
  evmAddress: string,
  evmProvider: JsonRpcProvider | null,
  cosmosAddresses: Array<object>
}

/*
  Types
*/
type onChainProvider = {
  connect: (wallet: any) => any;
  disconnect: (wallet: any) => any;
  provider: JsonRpcProvider | null;
  address: string;
  connected: Boolean;
  addresses: Array<object>;
  walletstatus: string;
  walletsInfo: Array<walletInfo>
  // web3Modal: Web3Modal;
};

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.",
    );
  }
  const {onChainProvider} = web3Context;
  return useMemo(() => {
    return {...onChainProvider};
  }, [web3Context]);
};


export const useAddress = () => {
  const {address} = useWeb3Context();
  return address;
};

const saveNetworkId = (networkId: NetworkId) => {
  if (window.localStorage) {
    window.localStorage.setItem("defaultNetworkId", networkId.toString());
  }
};

export const getSavedNetworkId = () => {
  const savedNetworkId = window.localStorage && window.localStorage.getItem("defaultNetworkId");
  if (!!savedNetworkId) {
    const parsedNetworkId = parseInt(savedNetworkId);
    if (enabledNetworkIds.includes(parsedNetworkId)) {
      return parsedNetworkId;
    }
  }
  return null;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({children}) => {
  const [connected, setConnected] = useState(false);

  let defaultNetworkId = getSavedNetworkId() || NetworkIds.FantomOpera;
  const [chainId, setChainId] = useState(defaultNetworkId);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [addresses, setAddresses] = useState<object[]>([]);
  const [walletstatus, setWalletstatus] = useState("");
  const [walletsInfo, setWalletsInfo] = useState<walletInfo[]>([])
  // const [keplr, setKeplr] = useState<Keplr | undefined>(undefined);
  // const rpcUris = enabledNetworkIds.reduce((rpcUris: { [key: string]: string }, networkId) => (rpcUris[networkId] = getURI(networkId), rpcUris), {});

  // const [web3Modal, setWeb3Modal] = useState<Web3Modal>(
  //   new Web3Modal({
  //     cacheProvider: true, // optional
  //     providerOptions: {
  //       walletconnect: {
  //         package: WalletConnectProvider,
  //         options: {
  //           rpc: rpcUris,
  //         },
  //       },
  //     },
  //   }),
  // );

  // const hasCachedProvider = (): Boolean => {
  //   if (!web3Modal) return false;
  //   if (!web3Modal.cachedProvider) return false;
  //   return true;
  // };

  // NOTE (appleseed): none of these listeners are needed for Backend API Providers
  // ... so I  these listeners so that they only apply to walletProviders, eliminating
  // ... polling to the backend providers for network changes
  // const _initListeners = useCallback(
  //   rawProvider => {
  //     if (!rawProvider.on) {
  //       return;
  //     }
  //     rawProvider.on("accountsChanged", async (accounts: string[]) => {
  //       setTimeout(() => {
  //         if (!isDexPage() || (isDexPage() && !isDexLoading())) {
  //           window.location.reload();
  //         } else {
  //           if (accounts.length > 0 && accounts[0].length > 0) {
  //             setAddress(accounts[0]);
  //           }
  //         }
  //       }, 1);
  //     });

  //     rawProvider.on("chainChanged", async (chain: string) => {
  //       var chainId;
  //       // On mobile chain comes in as a number but on web it comes in as a hex string
  //       if (typeof chain === "number") {
  //         chainId = chain;
  //       } else {
  //         chainId = parseInt(chain, 16);
  //       }
  //       if (!_checkNetwork(chainId)) {
  //         disconnect().then();
  //       }
  //       setTimeout(() => {
  //         if (!isDexPage() || (isDexPage() && !isDexLoading())) {
  //           window.location.reload();
  //         }
  //       }, 1);
  //     });

  //     rawProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
  //       if (!oldNetwork) {
  //         return;
  //       }
  //       window.location.reload();
  //     });
  //   },
  //   [provider],
  // );

  /**
   * throws an error if networkId is not supported
   */
  const _checkNetwork = (otherChainID: number): Boolean => {
    if (chainId !== otherChainID) {
      console.warn("You are switching networks");
      if (enabledNetworkIds.includes(otherChainID)) {
        setChainId(otherChainID);
        saveNetworkId(otherChainID);
        return true;
      }
      return false;
    }
    return true;
  };

  const switchEthereumChain = async (networkId: NetworkId, forceSwitch: boolean = false) => {
    const chainId = `0x${networkId.toString(16)}`;
    if (connected || forceSwitch) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{chainId}],
        });
        _checkNetwork(networkId);
        return true;
      } catch (e: any) {
        if (e.code === 4902) {
          if (!(networkId in chains)) {
            console.warn(`Details of network with chainId: ${chainId} not known`);
            return false;
          }
          const chainDetails = chains[networkId];
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId,
                  chainName: chainDetails.networkName,
                  nativeCurrency: {
                    symbol: chainDetails.symbol,
                    decimals: chainDetails.decimals,
                  },
                  blockExplorerUrls: chainDetails.blockExplorerUrls,
                  rpcUrls: chainDetails.rpcUrls,
                },
              ],
            });
            _checkNetwork(networkId)
            return true;
          } catch (addError) {
            console.error(addError);
            return false;
          }
        } else {
          console.error(e);
          return false;
        }
      }
    } else {
      // Wallet not connected, just switch network for static providers
      _checkNetwork(networkId)
      if (!isDexPage() || (isDexPage() && !isDexLoading())) {
        window.location.reload();
      }
      return true;
    }
  };

  

  const getUserWallet = async (status:any) => {
    const cosmosPopularChains: { name: string; chainId: string; supportedWallet: AnyArray }[] = [
      { name: 'AKASH', chainId: 'akashnet-2', supportedWallet:["keplr", "Cosmostation", "leap"] },
      { name: 'BANDCHAIN', chainId: 'injective-1', supportedWallet:["Cosmostation", "Coin98", "Frontier"] },
      { name: 'BITCANNA', chainId: 'bitcanna-1', supportedWallet:["Cosmostation", "leap"] },
      { name: 'BNB', chainId: 'binance-chain-tigris', supportedWallet:["Binance", "Coin98"] },
      { name: 'CHIHUAHUA', chainId: 'chihuahua-1', supportedWallet:["Cosmostation", "leap"] },
      { name: 'COMDEX', chainId: 'comdex-1', supportedWallet:["Cosmostation", "leap"] },
      { name: 'COSMOS', chainId: 'cosmoshub-4', supportedWallet:["keplr", "Cosmostation", "leap", "Frontier"] },
      { name: 'CRYPTO_ORG', chainId: 'crypto-org-chain-mainnet-1', supportedWallet:["keplr", "Cosmostation", "Frontier"] },
      { name: 'DESMOS', chainId: 'desmos-mainnet', supportedWallet:["Cosmostation", "leap"] },
      { name: 'EMONEY', chainId: 'emoney-3', supportedWallet:["keplr", "Cosmostation", "leap", "Frontier"] },
      { name: 'IRIS', chainId: 'irishub-1', supportedWallet:["keplr", "Cosmostation", "leap", "Coin98"] },
      { name: 'JUNO', chainId: 'juno-1', supportedWallet:["keplr", "Cosmostation", "leap"] },
      { name: 'KI', chainId: 'kichain-2', supportedWallet:["Cosmostation"] },
      { name: 'KUJIRA', chainId: 'kaiyo-1', supportedWallet:["Cosmostation", "leap", "Coin98"] },
      { name: 'LUMNETWORK', chainId: 'lum-network-1', supportedWallet:["Cosmostation"] },
      { name: 'OSMOSIS', chainId: 'osmosis-1', supportedWallet:["keplr", "Cosmostation", "leap", "Coin98", "Frontier"] },
      { name: 'PERSISTENCE', chainId: 'core-1', supportedWallet:["keplr", "Cosmostation", "leap", "Coin98", "Frontier"] },
      { name: 'REGEN', chainId: 'regen-1', supportedWallet:["keplr", "Cosmostation"] },
      { name: 'SENTINEL', chainId: 'sentinelhub-2', supportedWallet:["keplr", "Cosmostation"] },
      { name: 'STARGAZE', chainId: 'stargaze-1', supportedWallet:["keplr", "Cosmostation", "leap", "Coin98"] },
      { name: 'STARNAME', chainId: 'iov-mainnet-ibc', supportedWallet:["keplr", "Cosmostation", "leap"] },
      { name: 'UMEE', chainId: 'umee-1', supportedWallet:["keplr", "Cosmostation", "leap", "Coin98", "Frontier"] },
      { name: 'THOR', chainId: '', supportedWallet:["Coin98"] },
      { name: 'TERRA', chainId: 'columbus-5', supportedWallet:["keplr", "Coin98"] },
      { name: 'MARS', chainId: 'mars-1', supportedWallet:["Cosmostation", "leap"] },
      { name: 'STRIDE', chainId: 'stride-1', supportedWallet:["keplr", "Cosmostation", "leap", "Coin98"] },
    ]
    const supportedChain = cosmosPopularChains.filter(chain =>{
      return chain.supportedWallet.find(wallet => wallet == status)
    })
    const chainIds = supportedChain.map(chainInfo => chainInfo.chainId)
    const keplr = await getKeplr(status);
    if (!keplr) return []
    await keplr.enable(chainIds)
    let connectedWallets :AnyArray = []

    for (let chain of supportedChain) {
      const offlineSigner = keplr.getOfflineSigner(chain.chainId)
      const accounts = await offlineSigner?.getAccounts()
      if (!!accounts && accounts.length > 0) {
        const address = accounts.map((account: { address: string }) => { return account.address })
        connectedWallets.push({ blockchain: chain.name, addresses: address, })
      }
    }
    return connectedWallets
  }

  // connect - only runs for WalletProviders
  const connect = useCallback(async (wallet) => {
    // handling Ledger Live;
    
    let rawProvider:any;
    let connectedProvider;
    let evmAddress:string = '';
    let walletconnectionStatus: boolean = false;
    let currentWalletsInfo:Array<walletInfo> = walletsInfo;
    let currentWalletInfo:walletInfo = {
        name: '',
        evmAddress: '',
        evmProvider: null,
        cosmosAddresses:[]
      };
    let cosmosAddresses: Array<object> = []

    if (wallet.name == "Metamask") {     
      if (isIframe()) {
        rawProvider = new IFrameEthereumProvider();
      } else {
        rawProvider = await detectEthereumProvider({ mustBeMetaMask: true });
        if(rawProvider) {
          //@ts-ignore
          await rawProvider.request({ method: "eth_requestAccounts" });
        }
        connectedProvider = new Web3Provider(rawProvider as any);
      }
    }

    if (wallet.name == "WallectConect") {
      rawProvider = new WalletConnectProvider({
        infuraId: "27e484dcd9e3efcfd25a83a78777cdf1", // Required
      });
      await rawProvider.enable();
      connectedProvider = new Web3Provider(rawProvider as any);
    }

    if (wallet.name == "Binance") {
      rawProvider = new ethers.providers.Web3Provider(window.BinanceChain)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }

    if (wallet.name == "TrustWallet") {
      rawProvider = new ethers.providers.Web3Provider(window.trustwallet)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }   

    if (wallet.name == "Coinbase") {
      rawProvider = new ethers.providers.Web3Provider(window.coinbaseWalletExtension)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    } 

    if (wallet.name == "Coin98") {
      rawProvider = new ethers.providers.Web3Provider(window.coin98.provider)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }
    
    if (wallet.name == "Exdous") {
      rawProvider = new ethers.providers.Web3Provider(window.ethereum)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }
    if (wallet.name == "Frontier") {
      rawProvider = new ethers.providers.Web3Provider(window.frontier.ethereum)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }  
    if (wallet.name == "Clover") {
      rawProvider = new ethers.providers.Web3Provider(window.clover)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }
    if (wallet.name == 'XDefi') {
      rawProvider = new ethers.providers.Web3Provider(window.xfi.ethereum)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    } 
    if (wallet.name == 'Safepal') {
      rawProvider = new ethers.providers.Web3Provider(window.safepalProvider)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }
    if (wallet.name == 'Tokenpocket') {
      rawProvider = new ethers.providers.Web3Provider(window.ethereum)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }
    if (wallet.name == 'Okx') {
      rawProvider = new ethers.providers.Web3Provider(window.okexchain)
      await rawProvider.send('eth_requestAccounts', [])
      connectedProvider = rawProvider;
    }

    if (wallet.name == 'Cosmostation') {
      cosmosAddresses = await getUserWallet(wallet.name);
    }
    
    if (wallet.name == 'keplr') {
      cosmosAddresses = await getUserWallet(wallet.name);
    }

    if (wallet.name == 'leap') {
      cosmosAddresses = await getUserWallet(wallet.name);
    }

    if (connectedProvider) {
      evmAddress = await connectedProvider.getSigner().getAddress();
      setAddress(evmAddress);
      setProvider(connectedProvider);
      walletconnectionStatus = true;
      currentWalletInfo.name = wallet.name;
      currentWalletInfo.evmAddress = evmAddress;
      currentWalletInfo.evmProvider = connectedProvider;
    }

    if (cosmosAddresses.length > 0) {
      setAddresses(cosmosAddresses);
      setWalletstatus(wallet.name);
      walletconnectionStatus = true;
      currentWalletInfo.name = wallet.name;
      currentWalletInfo.cosmosAddresses = cosmosAddresses;

    }
    setConnected(true);
    currentWalletsInfo.push(currentWalletInfo);
    setWalletsInfo(currentWalletsInfo);
    console.log("walletInfo", walletsInfo)
    return walletconnectionStatus;    
  }, [provider, connected,address, addresses, walletstatus]);//add web3 modeal

  const disconnect = useCallback(async (wallet) => {
    let currentWalletsInfo:Array<walletInfo> = walletsInfo;
    let leftWalletInfo: Array<walletInfo> = [];

    console.log("disconnect function on web3context", currentWalletsInfo)
    setConnected(false);
    leftWalletInfo = currentWalletsInfo.filter(walletInfo => walletInfo.name != wallet.name);
    
    setWalletsInfo(leftWalletInfo);
    return true;
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1);
  }, [provider, addresses, walletstatus, connected]);//add web3 modeal

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      switchEthereumChain,
      provider,
      connected,
      address,
      chainId,
      walletstatus,
      addresses,
      walletsInfo
    }),
    [connect, disconnect, provider, connected, address, chainId, walletstatus, addresses, walletsInfo],
  );

  return <Web3Context.Provider value={{onChainProvider}}>{children}</Web3Context.Provider>;
};
