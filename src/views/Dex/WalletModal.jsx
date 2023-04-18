import { useState } from "react";
import { Modal, Box, Typography, Fade } from "@material-ui/core";
import { memo, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import detectEthereumProvider from '@metamask/detect-provider'
import { wallets } from "./walletsinfo";
import "./dex.scss";
import { useWeb3Context } from "../../hooks";

let walletInfo = JSON.parse(JSON.stringify(wallets));
function WalletModal(props) {

  const { connect, disconnect} = useWeb3Context();
  const [walletData, setWalletData] = useState([]);

  
  
  const checkWalletinstalled = async () => {
    console.log("checkWalletinstalled")
    const rawProvider = await detectEthereumProvider({ mustBeMetaMask: true });
    if(rawProvider) {
      walletInfo[0].status = "disconnected";
    }

    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.providers) {
        window.ethereum.providers.forEach(async (p) => {
          if (p.isExodus) {
            walletInfo[6].status = 'disconnected';
          }

          if (p.isTokenPocket) {
            walletInfo[11].status = 'disconnected';
          }
        });
      } else {
        if (window.ethereum.isExodus) {
          walletInfo[6].status = 'disconnected';
        } 
        if (window.ethereum.isTokenPocket) {
          walletInfo[11].status = 'disconnected'
        }

      } 
    }

    if ( typeof window.BinanceChain !== 'undefined') {
      walletInfo[2].status = 'disconnected';
    }

    if (typeof window.trustwallet !== 'undefined') {
      walletInfo[3].status = 'disconnected';
    }

    if (typeof window.coin98 !== 'undefined') {
      walletInfo[4].status = 'disconnected'
    }

    if (typeof window.CoinbaseWalletProvider !== 'undefined') {
      walletInfo[5].status = 'disconnected';
    }

    if ( window.frontier !== 'undefined') {
      walletInfo[7].status = "disconnected";
    }

    if (typeof window.clover !== 'undefined') {
      walletInfo[8].status = 'disconnected';
    }

    if (typeof window.xfi !== 'undefined') {
      walletInfo[9].status = 'disconnected';
    }

    if (typeof window.safepalProvider !== 'undefined') {
      walletInfo[10].status = 'disconnected';
    }

    if (typeof window.okexchain !== 'undefined') {
      walletInfo[12].status = 'disconnected';
    }

    if (typeof window.cosmostation !== 'undefined') {
      walletInfo[13].status = 'disconnected';
    }

    if (typeof window.keplr !== 'undefined') {
      walletInfo[14].status = 'disconnected';
    }

    if (typeof window.leap !== 'undefined') {
      walletInfo[15].status = 'disconnected';
    }

    setWalletData(walletInfo);
  }

  const walletConnect = async (wallet) => {

    if (wallet.status == "disconnected") {
      const walletconnetionStatus = await connect(wallet);
      console.log("walletStatus", walletconnetionStatus)
      if (walletconnetionStatus.evmWalletConnection == true || walletconnetionStatus.cosmosWalletconnection == true) {
        walletInfo[wallet.id].status = "connected"
        setWalletData(walletInfo);
        console.log('wallet connected');
      } else {
        alert(`You have already conneted other wallet`)
      } 
    } else if (wallet.status == "install") {
      alert(`You do not have ${wallet.name}, Please install`);
    } else {
      console.log("arrived to disconnect", walletInfo[wallet.id].name)
        const walletconnetionStatus = await disconnect(wallet);
        if (walletconnetionStatus) {
            walletInfo[wallet.id].status = "disconnected" 
            setWalletData(walletInfo)
            console.log("wallet status is disconnected")        
        }
    }
  }



  useEffect(() => {
    checkWalletinstalled();
    console.log("window.ethereum", window)
  }, []);

  return (
    <Modal open={props.open} onClose={() => props.onClose()}>
      <Fade in={props.open}>
        <Box className="h-full flex items-center mx-auto max-w-[640px] w-full">
            <div className="max-w-[640px] w-[calc(100%-64px)] max-h-[calc(100%-64px)] flex flex-col 
                border-solid border-[2px] border-[#ffffff33] m-[32px]
                relative overflow-y-auto rounded-[1rem] text-[white] bg-[#1c1c1d]" role="dialog">
                <div className="relative flex h-[40rem] flex-col overflow-x-hidden pb-6">
                    <div className="flex flex-col items-end pb-0">
                        <div className="relative w-full">
                            <Typography variant="h6" className="w-full py-4 text-center ">Connect Wallets</Typography>
                            <div className="absolute right-2 top-2">
                                  <button className="p-2" onClick={()=>props.onClose()}><CloseIcon className="text-[white]"/></button>  
                            </div>
                        </div>
                    </div>
                    <div className=" border-none h-[1px] w-full m-0 bg-[#ffffff12]">
                    </div>
                    <div className=" overflow-x-hidden">
                      <ul className="relative grid gap-2 px-2 py-4 grid-cols-2 sm:grid-cols-4 list-none">
                        {walletData.map((wallet) =>{
                          return(                           
                              <li className=" cursor-pointer relative mx-auto flex w-auto flex-col py-2 px-1" onClick={() => walletConnect(wallet)}>
                                <img src={wallet.logo} className="mx-auto mb-2 h-10 rounded-full md:h-15"/>
                                <Typography className="text-center font-bold">{wallet.name}</Typography>
                                <p className="text-[#ffffffb3] text-center">{wallet.status}</p>
                              </li>
                            )
                        })}
                      </ul>
                    </div>
                </div>            
            </div>    
        </Box>
      </Fade>
    </Modal>
  );
}

export default memo(WalletModal);