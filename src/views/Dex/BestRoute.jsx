import {
  Popper,
  Box,
  Typography,
  SvgIcon,
  Fade,
} from "@material-ui/core";
import { memo, useState } from "react";
import ReactLoading from "react-loading";

import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import { formatCurrency } from "../../helpers";
import { ReactComponent as ArrowRightIcon } from "../../assets/icons/arrow-right.svg";
import {ReactComponent as ArrowRightBlackIcon} from "../../assets/svg/arrow-right.svg";
import "./dex.scss";

import {
  expectSwapErrors,
  feeCalculator,
  formatSwapTime,
  getSwapPath,
  getTotalFee,
  getTotalSwapTime, requireAssetMessage,
} from "../../helpers/Dex";
import { slippageList } from "./data";
import "./dex.scss";
import { useSelector } from "react-redux";

function BestRoute(props) {

  const [anchorEl, setAnchorEl] = useState(null);

  const settingPopperOpen = Boolean(anchorEl);

  const darkmodeStatus = useSelector(state => state.darkmode.DarkState);

  const openSetting = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  }
  return (
    <Box position="relative" minHeight="330px" p="15px" display="flex" flexDirection="column" alignItems="center"
         justifyContent="center" className="dash-border bestRoute border-2 border-gray-400 border-dashed rounded-lg mt-5">
      { props?.routeLoading ? <ReactLoading type="spinningBubbles" color={darkmodeStatus? "#FFFFFF" : "#000000"} /> : (
        <>
          {/* <Box position="absolute" top="10px" right="10px" onMouseEnter={e => openSetting(e)}
               onMouseLeave={e => openSetting(e)}>
            <SvgIcon color="primary" component={ SettingsIcon } />
            <Popper open={ settingPopperOpen } anchorEl={ anchorEl } placement="bottom-end" transition>
              { ({ TransitionProps }) => {
                return (
                  <Fade { ...TransitionProps } timeout={ 100 }>
                    <Box bgcolor="#3a3d52" borderRadius="5px" py="15px" px="20px" display="flex"
                         flexDirection={ {xs: "column", lg: "row" } } justifyContent="space-between">
                      <Box display="flex" flexDirection="column" mr="20px">
                        <Box mb={{xs: "10px", lg: 0}}>
                          <Typography style={ { fontSize: "18px" } } className="font-weight-bolder">Swap
                            Settings</Typography>
                          <Typography style={ { fontSize: "10px" } }>Slippage tolerance per Swap</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center">
                        {
                          slippageList.map((item, index) => {
                            return (
                              <Box className="cursor-pointer font-weight-bolder" key={ `swap_${ index }` }
                                   color={ item === props?.slippage ? "#000" : "#FCFCFC" }
                                   bgcolor={ item === props?.slippage ? "#f6c777" : "#2b2d3e" } borderRadius="3px" p="10px"
                                   mr={ index<slippageList.length - 1 ? "5px" : "" }
                                   onClick={ () => props?.setSlippage(item) }>
                                { item }%
                              </Box>
                            );
                          })
                        }
                      </Box>
                    </Box>
                  </Fade>
                );
              } }
            </Popper>
          </Box> */}
          <div className={`absolute top-0 left-0 ppx-2 py-1 cursor-pointer border-dotted
              bg-gray-swap flex flex-row items-center`}>
              <div className="pr-[7px] flex flex-row items-center">
                <svg fill={`${darkmodeStatus ? 'white' : 'black'}`} width="25" height="25">
                  <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path>
                </svg>
                <p className={`ml-1 text-[14px] ${darkmodeStatus ? 'text-gray-300' : 'text-black'} `}>{
                    formatCurrency(getTotalFee(props?.bestRoute?.result?.swaps, props?.metaData),2)                       
                  }                
                </p>
              </div>
              <div className="flex flex-row pr-[7px] items-center border-l-2 border-solid border-gray-600
                pl-1">
                <svg fill={`${darkmodeStatus ? 'white' : 'black'}`} width="25" height="25">
                  <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
                </svg>
                <p className={`ml-1 text-[14px] ${darkmodeStatus ? 'text-gray-300' : 'text-black'}`}>
                  { formatSwapTime(getTotalSwapTime(props?.bestRoute?.result?.swaps)) }
                </p>
              </div>
          </div>
          
          { !props?.bestRoute?.result ? (<Typography
            variant="h4" style={{color:`${darkmodeStatus ? 'white' : 'black'}`}}>{ (!props?.fromTokenAmount || props?.fromTokenAmount === 0) ? "Enter amount to find routes" : "No routes found" }</Typography>) : (<>
            <Box display="flex" justifyContent="center" flexWrap="wrap" style={{marginTop:"24px"}}>
              {
                props?.bestRoute?.result?.swaps?.length>0 && props?.bestRoute?.result?.swaps?.map((swap, index) => {
                  return (
                    <Box width="80px" borderRadius="5px" bgcolor={`${!darkmodeStatus ? '#C9CDD2' : '#46485f'}`} key={ `route_${ index }` }
                         mr={ index<props?.bestRoute?.result?.swaps?.length - 1 ? "10px" : "0" } p="5px">
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <img style={ { width: "25px" } } src={ swap?.logo } alt={ swap?.swapperId } />
                        <Typography noWrap style={ { fontSize: "10px" } } align="center"
                                    className={`${darkmodeStatus ? 'text-white' : 'text-black'} w-full`}>{ swap.swapperId }</Typography>
                      </Box>
                      <Box mt="10px" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Typography noWrap style={ { fontSize: "10px" } } className={`${darkmodeStatus ? 'text-white' : 'text-black'} w-full font-medium`}>Fee
                          ≈ { formatCurrency(feeCalculator(swap.fee, props?.metaData), 3)}</Typography>
                        <Typography noWrap style={ { fontSize: "10px" } } className={`${darkmodeStatus ? 'text-white' : 'text-black'} w-full font-medium`}>Time
                          ≈ { formatSwapTime(swap.timeStat.avg) }</Typography>
                      </Box>
                    </Box>
                  );
                })
              }
            </Box>
            <Box display="flex" className="justify-center w-full" mt="20px">
              {
                getSwapPath(props?.bestRoute?.result?.swaps).map((item, index) => {
                  return (
                    <Box display="flex" alignItems="center" key={ `token_${ index }` }>
                      <Box display="flex" flexDirection="column" alignItems="center"
                           justifyContent="center" className="w-[45px] min-[400px]:w-[60px]">
                        <img style={ { width: "35px", height: "35px" } } src={ item?.logo } alt={ item?.symbol } />
                        <Typography variant="h6" className={`${darkmodeStatus ? 'text-white' : 'text-black'}`}>{ item?.symbol?.toUpperCase() }</Typography>
                        <Typography style={ { fontSize: "10px" } } className={`${darkmodeStatus ? 'text-white' : 'text-black'}`}>{ item?.blockchain }</Typography>
                      </Box>
                      { index<getSwapPath(props?.bestRoute?.result?.swaps).length - 1 && (
                        <SvgIcon component={ darkmodeStatus ? ArrowRightIcon : ArrowRightBlackIcon} fontSize="large"
                          className={`mb-[35px] ${darkmodeStatus ? 'text-white' : 'text-black'} `}/>
                      )
                      }
                    </Box>
                  );
                })
              }
            </Box>
            {
              expectSwapErrors(props?.bestRoute?.result?.swaps)?.length>0 && (
                <Box display="flex" justifyContent="center" mt="10px">
                  <Box bgcolor="#3c434ecc" maxWidth="180px" borderRadius="5px" px="5px" py="3px" display="flex"
                       flexDirection="column" justifyContent="center">
                    {
                      expectSwapErrors(props?.bestRoute?.result?.swaps)?.map((item, index) => {
                        return (
                          <Box display="flex" flexDirection="column" key={ `error_${ index }` } alignItems="center"
                               mb="10px">
                            <Typography noWrap variant="h6" className="w-full">{ item?.title }</Typography>
                            <Typography noWrap style={ { fontSize: "10px" } }
                                        className="w-full">{ item?.required }</Typography>
                            <Typography noWrap style={ { fontSize: "10px" } }
                                        className="w-full">{ item?.yours }</Typography>
                          </Box>
                        );
                      })
                    }
                  </Box>
                </Box>
              )
            }
            {
              // props?.bestRoute?.result && (
                // <Box mt="10px" className="w-full" display="flex" flexDirection="column">
                //   {/* <Box display="flex" justifyContent="space-between" alignItems="center">
                //     <Typography
                //       variant="h6">1 { props?.fromToken?.symbol } = { (props?.toTokenAmount / props?.fromTokenAmount).toFixed(4) } { props?.toToken?.symbol }</Typography>
                //     <Typography variant="h6">Total Fee:
                //       ≈ { formatCurrency(getTotalFee(props?.bestRoute?.result?.swaps, props?.metaData), 4) }</Typography>
                //   </Box> */}
                //   <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                //     <Typography className={`${darkmodeStatus ? 'text-white' : 'text-black'} font-bold`}
                //       variant="h6">1 { props?.toToken?.symbol } = { (props?.fromTokenAmount / props?.toTokenAmount).toFixed(4) } { props?.fromToken?.symbol }</Typography>
                //     <Typography variant="h6" className={`${darkmodeStatus ? 'text-white' : 'text-black'} font-bold`}>Estimated Arrival Time
                //       ≈ { formatSwapTime(getTotalSwapTime(props?.bestRoute?.result?.swaps)) }</Typography>
                //   </Box>
                // </Box>
              // )
            }
            {
              requireAssetMessage(props?.requiredAssets).length>0 && (
                <Box mt="20px" display="flex" flexDirection="column" bgcolor={darkmodeStatus? "#3c434ecc" : "#e5e7eb"} p="10px" borderRadius="5px">
                  {
                    requireAssetMessage(props?.requiredAssets).map((item, index) => {
                      return (
                        <Typography variant="h6" className={`${darkmodeStatus ? 'text-white' : 'text-black'} font-weight-bolder`} key={`requiredAssets_${index}`}>{ item }</Typography>
                      );
                    })
                  }
                </Box>
              )
            }
          </>) }
        </>
      ) }
    </Box>
  );
}

export default memo(BestRoute);