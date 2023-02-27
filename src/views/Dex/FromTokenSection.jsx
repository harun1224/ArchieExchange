
  import { memo } from "react";
  import ReactLoading from "react-loading";
  
  import { formatCurrency } from "../../helpers";
  import { formatAmount } from "../../helpers/Dex";
  import { modalType } from "./data";
  import "./dex.scss";
  import { useSelector } from "react-redux";


  function FromTokenSection(props) {
    const darkmodeStatus = useSelector(state => state.darkmode.DarkState);
    return (
        <div className="mb-1 flex w-full flex-col rounded-xl bg-opacity-20 px-0 pt-4 pb-3">
        <div className="relative mt-4 sm:mt-0">
          <div className="">
          <div className="ml-[6px] mr-[4px] flex items-center">
                <div className="mr-2 w-12">
                    <p className={` ${darkmodeStatus ? 'text-white' : 'text-black'} m-0 MuiTypography-body1 text-[14px]`}>From</p>
                </div>
                <button className="custom-select-button bg-gray-swap min-w-44" onClick={ () => props?.opeNetworkModal(modalType.from) }>
                    <div className="absolute left-2 flex flex-grow	text-left">
                        <div className={`${darkmodeStatus ? 'text-white' : 'text-black'} flex items-center text-sm`}>
                            <div className="w-[20px] mr-2"> <img src ={props?.fromNetwork && props?.fromNetwork?.logo} /></div>
                            { props?.fromNetwork?.name }
                        </div>
                    </div>
                    <p className="m-0 absolute right-1 top-1/2 -translate-y-1/2 transform MuiTypography-body1">
                        <svg className={`${darkmodeStatus ? 'text-white' : 'text-black'} MuiSvgIcon-root text-[1.25rem]`} focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>
                    </p>
                </button>
                {  props?.fromUpdateTokenLoading ? (
                    <ReactLoading type="spinningBubbles" color="#fff" width={35} height={35}/>
                  ):(
                  <div className=" mr-[12px] cursor-pointer absolute bottom-[135px] right-0 sm:bottom-auto flex flex-row">
                    <p className="text-[#FBBF04] font-medium text-[0.875rem] leading-[1.43]">Max: {" "}</p>
                    { props?.fromToken && <p style={{color:`${darkmodeStatus ? 'white':'black'}`}} className="ml-1 text-[0.875rem] leading-[1.43]"> 
                    { formatAmount(props?.fromToken?.amount, props?.fromToken?.decimals, 2, props?.fromToken?.symbol) }{" "}
                    { props?.fromToken?.symbol}</p>}
                  </div>
                  )
                }
            </div>



            <div className="bg-gray-swap mt-2 flex h-20 w-full flex-row justify-between rounded-lg bg-opacity-10">
              <div className="flex w-3/5 flex-col justify-center pl-3 text-left sm:w-2/3">
                <div>
                  <div className="MuiFormControl-root">
                    <div className="MuiInputBase-root">
                      <input placeholder="0" type="number" min="0" className={`MuiInputBase-input text-left text-[30px] font-bold`} 
                        value={props?.fromTokenAmount}
                        onChange={e => props?.setFromTokenAmount(e.target.value)}
                        style={{color:`${darkmodeStatus ? 'white' : 'black'}`, fontSize:"25px"}}/>
                    </div>
                    <div>
                      <p className={` ${darkmodeStatus ? 'text-white' : 'text-black'} text-[1rem] leading-[1.5] font-normal tracking-[.00938em]`}>
                       ≈ {formatCurrency(props?.fromTokenAmount * (props?.fromToken?.usdPrice || 0), 2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-2/5 items-center sm:w-1/3">
              {
              props?.fromUpdateTokenLoading ? (
                <ReactLoading type="spinningBubbles" color="#fff" width={35} height={35}/>
              ) : (
                <div className="custom-select-button h-full w-full" onClick={ () => props?.openTokenModal(modalType.from) }>
                  <div className="flex flex-grow text-left ">
                    <div className="text-md flex items-center">
                      <img src={props?.fromToken?.image} className="mr-2 h-8 rounded-full md:h-10" alt={props?.fromToken?.symbol}/>
                      <p className={`${darkmodeStatus ? 'text-white' : 'text-[#333]'} text-[0.75rem] sm:text-[0.875rem] m-0`}>
                        { props?.fromToken?.symbol}
                      </p>
                    </div>
                  </div>
                  <p className="absolute right-2 top-1/2 -translate-y-1/2 transform m-0 text-[1rem] leading-[1.5] text-[#333]">
                    <svg className={` ${darkmodeStatus ? 'text-white' : 'text-black'} MuiSvgIcon-root`} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                    </svg>
                  </p>
                </div>
              )
            }
              </div>
            </div>
          </div>
        </div>
      </div>    
    );
  }
  
  export default memo(FromTokenSection);