import { Modal, Box, Typography, Fade } from "@material-ui/core";
import { memo } from "react";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from '@material-ui/icons/Search';
import { swapNetworks } from "./data";
import "./dex.scss";
import { useState } from "react";


function NetworkModall(props) {
  const [searchvalue, SetsearchValue] = useState("");

  return (
    <Modal open={props.open} onClose={() => props.onClose(props.type, null)}>
      <Fade in={props.open}>
        <Box className="h-full flex items-center mx-auto max-w-[510px] w-full">
            <div className="max-w-[510px] w-[calc(100%-64px)] max-h-[calc(100%-64px)] flex flex-col 
                border-solid border-[2px] border-[#ffffff33] m-[32px]
                relative overflow-y-auto rounded-[1rem] text-[white] bg-[#1c1c1d]" role="dialog">
                <div className="relative flex h-[40rem] flex-col overflow-x-hidden pb-6">
                    <div className="flex flex-col items-end pb-4">
                        <div className="relative w-full">
                            <Typography variant="h6" className="w-full py-4 text-center ">Source Network</Typography>
                            <div className="absolute right-2 top-2">
                                  <button className="p-2" onClick={()=>props.onClose(props.type, null)}><CloseIcon className="text-[white]"/></button>  
                            </div>
                        </div>
                        <div className="w-full px-2">
                          <div className="flex flex-row items-center rounded-[8px] w-full border-[1px] border-gray-400 border-solid">
                            <SearchIcon className="text-[white] ml-2 mb-[1px]" fontSize={"small"}/>
                            <div className="ml-1 w-full">
                              <input type="text" value={searchvalue} onChange={(e)=>{SetsearchValue(e.target.value)}} 
                                  className="w-full py-2 bg-[#1c1c1d] text-[16px] rounded-[8px]">
                              </input>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className=" border-none h-[1px] w-full m-0 bg-[#ffffff12]">
                    </div>
                    <div className=" overflow-x-hidden">
                      <ul className="relative grid gap-2 px-2 py-4 sm:grid-cols-2 list-none">
                        {swapNetworks.map((network)=>{
                          let Svalue = searchvalue.toUpperCase();
                          return network.name.includes(Svalue) ? <li tabIndex={"0"} role="button" className="flex h-12 w-full cursor-pointer items-center
                            justify-start rounded-xl bg-gray-400 bg-opacity-20 text-lg hover:bg-opacity-30 
                            " style={{padding:"0.75rem 0px 0.75rem 0.75rem"}} key={network.blockchain} onClick={() => props.onClose(props.type, network)}>
                            <div className="w-6 mr-4">
                              <img src={network.logo}/>
                            </div>
                             <span className="text-sm sm:text-base">{network.name}</span>
                        </li>:<></>
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

export default memo(NetworkModall);