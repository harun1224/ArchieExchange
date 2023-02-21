import { Modal, Box, Typography, Fade } from "@material-ui/core";
import { memo } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { wallets } from "./walletsinfo";
import "./dex.scss";
import detectEthereumProvider from '@metamask/detect-provider';



const walletConnection = () => {
  
} 

function WalletModal(props) {

  

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
                        {/* {swapNetworks.map((network)=>{
                          return <li tabIndex={"0"} role="button" className="flex h-12 w-full cursor-pointer items-center
                            justify-start rounded-xl bg-gray-400 bg-opacity-20 text-lg hover:bg-opacity-30 
                            " style={{padding:"0.75rem 0px 0.75rem 0.75rem"}} key={network.blockchain} onClick={() => props.onClose(props.type, network)}>
                            <div className="w-6 mr-4">{network.logo}</div>
                             <span className="text-sm sm:text-base">{network.name}</span>
                        </li>
                        })} */}
                        {wallets.map((wallet) =>{
                          return(                           
                              <li className=" cursor-pointer relative mx-auto flex w-auto flex-col py-2 px-1" onClick={() => walletConnection()}>
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