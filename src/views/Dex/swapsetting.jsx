import { Modal, Box, Typography, Fade } from "@material-ui/core";
import { memo } from "react";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from '@material-ui/icons/Search';
import { swapNetworks } from "./data";
import "./dex.scss";
import { useState } from "react";
import { slippageList } from "./data";

function SwapSettingmodal(props) {
  const [searchvalue, SetsearchValue] = useState("");

  return (
    <Modal open={props.open} onClose={() => props.onClose()}>
      <Fade in={props.open}>
        <Box className="h-full flex items-center mx-auto max-w-[530px] w-full">
            <div className="max-w-[530px] w-[calc(100%-64px)] max-h-[calc(100%-64px)] flex flex-col 
                border-solid border-[2px] border-[#ffffff33] m-[32px]
                relative top-[-143px] overflow-y-auto rounded-[1rem] text-[white] bg-[#1c1c1d]" role="dialog">
                <div className="relative flex flex-col overflow-x-hidden pb-6">
                    <div className="flex flex-col items-end pb-4">
                        <div className="relative w-full">
                            <Typography variant="h6" style={{fontWeight:500}} className="w-full py-4 pl-2 text-left font-bold">Swap Setting</Typography>
                            <div className="absolute right-2 top-2">
                                  <button className="p-2" onClick={()=>props.onClose()}><CloseIcon className="text-[white]"/></button>  
                            </div>
                        </div>
                    </div>
                    <div className=" border-none h-[1px] w-full m-0 bg-[#ffffff12]">
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <div className="pl-2">
                        <p className="text-gray-400 font-medium tracking-wide"> Slippage tolerance per Swap </p>
                      </div>
                      <div>
                        <svg width={25} height={25} fill="yellow">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                        </svg>
                      </div>
                    </div>
                      <div className="flex flex-row flex-wrap">
                        {slippageList.map((item, index)=>{
                          return (
                            <button key={ `swap_${ index }` } style={{backgroundColor:`${props?.slippage === item ? '#FBBF04':'' }`}} className="inline-flex border-[1px] border-[#ffffff3b] border-solid 
                              justify-center items-center cursor-pointer w-[3.6rem] my-[0.25rem] rounded-[1.5rem] mx-2 py-1"
                              onClick={() => props?.handleSwapSetting(item)}>
                              <span className=" text-white text-ellipsis font-medium">{item} %</span>
                            </button>
                          )
                        })}
                    </div>
                </div>            
            </div>    
        </Box>
      </Fade>
    </Modal>
  );
}

export default memo(SwapSettingmodal);