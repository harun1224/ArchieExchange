import { Modal, Box, Typography, OutlinedInput, Fade, FormControl, InputLabel } from "@material-ui/core";
import { useState, memo } from "react";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from '@material-ui/icons/Search';
import InfiniteScroll from "react-infinite-scroller";
import ReactLoading from "react-loading";

import { formatAmount } from "../../helpers/Dex";
import "./dex.scss";

function TokenModal(props) {
  const [tokenName, setTokenName] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [showedIndex, setShowedIndex] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMoreData = () => {
    if (showedIndex>=props?.tokenCount) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setShowedIndex(showedIndex + 20);
    }, 1000);
  };

  return (
    <Modal open={ props?.open } onClose={ () => props?.onClose(props?.type, null) }>
      <Fade in={ props?.open }>
      <Box className="h-full flex items-center mx-auto max-w-[510px] w-full">
            <div className="max-w-[510px] w-[calc(100%-64px)] max-h-[calc(100%-64px)] flex flex-col 
                border-solid border-[2px] border-[#ffffff33] m-[32px]
                relative overflow-y-auto rounded-[1rem] text-[white] bg-[#1c1c1d]" role="dialog">
                <div className="relative flex h-[40rem] flex-col overflow-x-hidden pb-6">
                    <div className="flex flex-col items-end pb-4">
                        <div className="relative w-full">
                            <Typography variant="h6" className="w-full py-4 text-center ">Select {props?.type =='from' ? "Source": "Destination" } Token</Typography>
                            <div className="absolute right-2 top-2">
                                  <button className="p-2" onClick={()=>props?.onClose(props?.type, null)}><CloseIcon className="text-[white]"/></button>  
                            </div>
                        </div>
                        <div className="w-full px-2">
                          <div className="flex flex-row items-center rounded-[8px] w-full border-[1px] border-gray-400 border-solid">
                            <SearchIcon className="text-[white] ml-2 mb-[1px]" fontSize={"small"}/>
                            <div className="ml-1 w-full">
                              <input type="text" value={tokenName} 
                                    onChange={ e => {
                                        setTokenName(e.target.value);
                                        props?.onChange(e.target.value, props?.type);
                                    } }
                                  className="w-full py-2 bg-[#1c1c1d] text-[16px] rounded-[8px] border-none focus:outline-none">
                              </input>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className=" border-none h-[1px] w-full m-0 bg-[#ffffff12]">
                    </div>
                    <div className=" overflow-x-hidden">
                      <ul className="relative grid gap-2 px-2 py-4 grid-cols-1 list-none">
                      {
                        <InfiniteScroll
                            dataLength={ props?.tokenList.length }
                            loadMore={ fetchMoreData }
                            loader={ <Box display="flex" justifyContent="center" key={0}><ReactLoading type="spin" color="white" height={ 30 } width="35px" delay={ 100 } /></Box> }
                            hasMore={ hasMore }
                            useWindow={ false }
                        >
                            {
                            props?.tokenList.slice(0, showedIndex).map((token, index) => {
                                return (
                                <li className="w-full flex items-center justify-center h-[72px]">
                                    <div tabIndex={"0"} role="button" className="flex h-16 w-full cursor-pointer items-center
                                        justify-start rounded-xl bg-gray-400 bg-opacity-20 text-lg hover:bg-opacity-30 
                                        " style={{padding:"0.75rem 0px 0.75rem 0.75rem"}} key={`token_${ index }_${ token?.symbol }`} onClick={() => props?.onClose(props?.type, token)}>
                                        <div className="my-auto mr-4">
                                            <img style={ { width: "35px", height: "35px" } } src={ token?.image } alt={ token?.symbol } />
                                        </div>
                                        <div className="flex flex-col py-2 ml-2">
                                            <h6 className="text-white text-[14px] text-left font-bold p-0 leading-[1.3rem]">{ token?.symbol }</h6>
                                            <p className="text-white text-[12px] text-[#ffffffb3] p-0 leading-[1rem]">{ token?.name }</p>
                                        </div>
                                    </div>
                                </li>
                                );
                            })
                            }
                        </InfiniteScroll>
                        }
                      </ul>
                    </div>
                </div>            
            </div>    
        </Box>
      </Fade>
    </Modal>
  );
}

export default memo(TokenModal);