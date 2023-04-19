import { useState } from "react";
import { Modal, Box, Typography, Fade } from "@material-ui/core";
import { memo, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import detectEthereumProvider from '@metamask/detect-provider'
import { wallets } from "./walletsinfo";
import "./dex.scss";
import { useWeb3Context } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { walletConnected, walletDisconnected } from "src/slices/WalletstatusSlice";
const walletInfo = JSON.parse(JSON.stringify(wallets));
function WalletModal(props) {
  
  const { connect, disconnect} = useWeb3Context();
  const dispatch = useDispatch();
  const walletStatus = useSelector(state => state.walletStatus.walletStatus);
  
  const checkWalletinstalled = async () => {
    console.log("checkWalletinstalled")
    const rawProvider = await detectEthereumProvider({ mustBeMetaMask: true });
    if(rawProvider) {
      dispatch(walletDisconnected(0))
    }

    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.providers) {
        window.ethereum.providers.forEach(async (p) => {
          if (p.isExodus) {
            dispatch(walletDisconnected(6))
          }

          if (p.isTokenPocket) {
            dispatch(walletDisconnected(11))
          }
        });
      } else {
        if (window.ethereum.isExodus) {
          dispatch(walletDisconnected(6))
        } 
        if (window.ethereum.isTokenPocket) {
          dispatch(walletDisconnected(11))
        }

      } 
    }

    if ( typeof window.BinanceChain !== 'undefined') {
      dispatch(walletDisconnected(2))
    }

    if (typeof window.trustwallet !== 'undefined') {
      dispatch(walletDisconnected(3))
    }

    if (typeof window.coin98 !== 'undefined') {
      dispatch(walletDisconnected(4))
    }

    if (typeof window.CoinbaseWalletProvider !== 'undefined') {
      dispatch(walletDisconnected(5))
    }

    if ( window.frontier !== 'undefined') {
      dispatch(walletDisconnected(7))
    }

    if (typeof window.clover !== 'undefined') {
      dispatch(walletDisconnected(8))
    }

    if (typeof window.xfi !== 'undefined') {
      dispatch(walletDisconnected(9))
    }

    if (typeof window.safepalProvider !== 'undefined') {
      dispatch(walletDisconnected(10))
    }

    if (typeof window.okexchain !== 'undefined') {
      dispatch(walletDisconnected(12))
    }

    if (typeof window.cosmostation !== 'undefined') {
      dispatch(walletDisconnected(13))
    }

    if (typeof window.keplr !== 'undefined') {
      dispatch(walletDisconnected(14))
    }

    if (typeof window.leap !== 'undefined') {
      dispatch(walletDisconnected(15))
    }
  }

  const walletConnect = async (wallet) => {
    console.log("adasdf", wallet)
    if (wallet.status == "disconnected") {
      const walletconnetionStatus = await connect(wallet);
      if (walletconnetionStatus) {
        dispatch(walletConnected(wallet.id))
      }
    } 
    else if (wallet.status == "install") {
      alert(`You do not have ${wallet.name}, Please install`);
    } else {
      console.log("arrived disconnect function on WalletModal")
        const walletconnetionStatus = await disconnect(wallet);
        console.log("return value after calling  disconnect function on WalletModal", walletconnetionStatus)
        if (walletconnetionStatus) {
            dispatch(walletDisconnected(wallet.id))       
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
                        {walletStatus.map((wallet) =>{
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