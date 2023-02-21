import {
    Box,
    Typography,
    FormControl, OutlinedInput, InputAdornment,
  } from "@material-ui/core";
  import { memo } from "react";
  import ReactLoading from "react-loading";
  
  import { formatCurrency } from "../../helpers";
  import { formatAmount, getDownRate } from "../../helpers/Dex";
  import { modalType } from "./data";
  import "./dex.scss";
  import { useSelector } from "react-redux";
  
  function ToTokenSection(props) {
  
    const darkmodeStatus = useSelector(state => state.darkmode.DarkState);
    return (
        <div className="swap-box-destination mt-1 flex flex-col rounded-xl bg-opacity-20 px-2 pb-4 pt-6">
            <div className="mr-4 flex items-center">
                <div className="mr-2 w-12">
                    <p className={`${darkmodeStatus ? 'text-white' : 'text-black'} m-0 MuiTypography-body1 text-[14px]`}>To</p>
                </div>
                <button className="custom-select-button swap-input min-w-44" onClick={ () => props?.opeNetworkModal(modalType.to) }>
                    <div className="absolute left-2 flex flex-grow	text-left">
                        <div className={`${darkmodeStatus ? 'text-white' : 'text-black'} flex items-center text-sm`}>
                            <div className="w-[20px] mr-2"><img src ={props?.toNetwork && props?.toNetwork?.logo} /></div>
                            { props?.toNetwork?.name }
                        </div>
                    </div>
                    <p className="m-0 absolute right-1 top-1/2 -translate-y-1/2 transform MuiTypography-body1">
                        <svg className={`${darkmodeStatus ? 'text-white' : 'text-black'} MuiSvgIcon-root text-[1.25rem]`} focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>
                    </p>
                </button>
            </div>
            <div className="swap-input mt-2 flex h-20 w-full justify-between rounded-lg bg-opacity-10 pl-3 text-left">
                    <div className="flex flex-col justify-center">
                        <div className="flex flex-col mb-[14px] pt-[12px]">
                            <h5 className={`${darkmodeStatus ? 'text-white' : 'text-[#333]'} text-[22px] m-0 pt-1`}>≈ { props?.toTokenAmount }</h5>
                        </div>
                        <div className="flex flex-row align-middle">
                            <p className={`${darkmodeStatus ? 'text-white' : 'text-black'} m-0 MuiTypography-body1`}
                                style={{fontSize:"1rem"}}>
                            ≈ { formatCurrency(props?.toTokenAmount * (props?.toToken?.usdPrice || 0), 2) }
                            </p>{" "}
                            <div className="m-0 text-[0.75rem] font-normal tracking-[.03333em] self-center">
                                <div className={`m-0 ${darkmodeStatus ? 'text-red-500' : 'text-[#ff0000] font-[500]'}`}>
                                {    
                                    getDownRate(props?.fromToken, props?.toToken, props?.fromTokenAmount, props?.toTokenAmount) &&
                                    <span class="">&nbsp; ({ getDownRate(props?.fromToken, props?.toToken, props?.fromTokenAmount, props?.toTokenAmount).toFixed(2) }%)</span>
                                }
                                </div>
                            </div>
                        </div>

                    </div>
                    {props?.toUpdateTokenLoading ? (
                            <ReactLoading type="spinningBubbles" color="#fff" width={ 35 } height={ 35 } />
                        ) : (
                    <div className="flex w-2/5 items-center sm:w-1/3">
                    
                        <button className="custom-select-button select-token-button h-full w-full" onClick={ () => props?.openTokenModal(modalType.to) }>
                            <div className="flex flex-grow text-left ">
                                <div className="text-md flex items-center">
                                    <img src={props?.toToken?.image} className="mr-2 h-8 rounded-full md:h-10" alt={ props?.toToken?.symbol }/>
                                    <p className={`${darkmodeStatus ? 'text-white' : 'text-[#333]'} m-0 text-[0.75rem] font-bold MuiTypography-body1`}>{ props?.toToken?.symbol }</p>
                                </div>
                            </div>
                            <p className="m-0 absolute right-2 top-1/2 -translate-y-1/2 transform MuiTypography-body1">
                                <svg className={`${darkmodeStatus ? 'text-white' : 'text-black'} MuiSvgIcon-root`} focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>
                            </p>
                        </button>
                    </div>
                    )
                }
                </div>
        </div>
    );
  }
  
  export default memo(ToTokenSection);