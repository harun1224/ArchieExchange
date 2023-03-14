import { TransactionRequest } from "@ethersproject/abstract-provider/src.ts/index";
import {
  BestRouteResponse,
  EvmTransaction,
  CosmosTransaction,
  RangoClient,
} from "rango-sdk";
import { ethers } from "ethers";
import { sleep } from "./Sleep";
import { trim } from "./index";
import { NetworkIds } from "../networks";
import {cosmos} from "@keplr-wallet/cosmos";
import {Keplr} from "@keplr-wallet/types";
import {BroadcastMode, makeSignDoc, makeStdTx} from "@cosmjs/launchpad";
import {SigningStargateClient} from "@cosmjs/stargate";
import Long from 'long';
// eslint-disable-next-line
const SignMode = cosmos.tx.signing.v1beta1.SignMode;
declare let window: any

const STARGATE_CLIENT_OPTIONS = {
  gasLimits: {
    send: 80000,
    ibcTransfer: 500000,
    transfer: 250000,
    delegate: 250000,
    undelegate: 250000,
    redelegate: 250000,
    // The gas multiplication per rewards.
    withdrawRewards: 140000,
    govVote: 250000,
  },
}

export const getKeplr = async (status:any): Promise<Keplr | undefined> => {
  if (status == "Cosmostation") {
    if (window.cosmostation) {
      return window.cosmostation.providers.keplr;
    }

    if (document.readyState === "complete") {
        return window.cosmostation.providers.keplr;
    }

    return new Promise((resolve) => {
        const documentStateChange = (event: Event) => {
            if (
                event.target &&
                (event.target as Document).readyState === "complete"
            ) {
                resolve(window.cosmostation.providers.keplr);
                document.removeEventListener("readystatechange", documentStateChange);
            }
        };

        document.addEventListener("readystatechange", documentStateChange);
    });
  }
  if (status == "keplr") {
    if (window.keplr) {
      return window.keplr
    }
    if (document.readyState === "complete") {
      return window.keplr
    }
    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === "complete"
        ) {
          resolve(window.keplr)
          document.removeEventListener("readystatechange", documentStateChange);
        }
      }
      document.addEventListener("readystatechange", documentStateChange);
    });
  }
  if (status == 'leap') {
    if (window.leap) {
      return window.leap
    }
    if (document.readyState === "complete") {
      return window.leap
    }
    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === "complete"
        ) {
          resolve(window.leap)
          document.removeEventListener("readystatechange", documentStateChange);
        }
      }
      document.addEventListener("readystatechange", documentStateChange);
    });
  }  
   
}

export async function executeCosmosTransaction(cosmosTx: CosmosTransaction, status:any): Promise<string> {
  const keplr = await getKeplr(status)
  if (!keplr) throw new Error("keplr wallet is undefined!")

  const {memo, sequence, account_number, chainId, msgs, fee, signType, rpcUrl} = cosmosTx.data

  if (!chainId) throw Error("ChainId is undefined from server")
  if (!account_number) throw Error("account_number is undefined from server")
  if (!sequence) throw Error("Sequence is undefined from server")

  function manipulateMsg(m: any): any {
    if (!m.__type) return m
    if (m.__type === 'DirectCosmosIBCTransferMessage') {
      const result = {...m} as any
      if (result.value.timeoutTimestamp)
        result.value.timeoutTimestamp = Long.fromString(result.value.timeoutTimestamp) as any
      if (!!result.value.timeoutHeight?.revisionHeight)
        result.value.timeoutHeight.revisionHeight = Long.fromString(result.value.timeoutHeight.revisionHeight) as any
      if (!!result.value.timeoutHeight?.revisionNumber)
        result.value.timeoutHeight.revisionNumber = Long.fromString(result.value.timeoutHeight.revisionNumber) as any
      return result
    }
    return {...m}
  }

  const msgsWithoutType = msgs.map((m) => ({
    ...manipulateMsg(m),
    __type: undefined,
  }))

  if (signType === 'AMINO') {
    const signDoc = makeSignDoc(msgsWithoutType as any, fee as any, chainId, memo || undefined, account_number, sequence)
    const signResponse = await keplr.signAmino(chainId, cosmosTx.fromWalletAddress, signDoc)

    let signedTx;
    if (cosmosTx.data.protoMsgs.length > 0) {
      signedTx = cosmos.tx.v1beta1.TxRaw.encode({
        bodyBytes: cosmos.tx.v1beta1.TxBody.encode({
          messages: cosmosTx.data.protoMsgs.map(m => ({type_url: m.type_url, value: new Uint8Array(m.value)})),
          memo: signResponse.signed.memo,
        }).finish(),
        authInfoBytes: cosmos.tx.v1beta1.AuthInfo.encode({
          signerInfos: [
            {
              publicKey: {
                type_url: "/cosmos.crypto.secp256k1.PubKey",
                value: cosmos.crypto.secp256k1.PubKey.encode({
                  key: Buffer.from(
                    signResponse.signature.pub_key.value,
                    "base64"
                  ),
                }).finish(),
              },
              modeInfo: {
                single: {
                  mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
                },
              },
              sequence: Long.fromString(signResponse.signed.sequence),
            },
          ],
          fee: {
            amount: signResponse.signed.fee.amount as any[],
            gasLimit: Long.fromString(signResponse.signed.fee.gas),
          },
        }).finish(),
        signatures: [Buffer.from(signResponse.signature.signature, "base64")],
      }).finish()
    } else {
      signedTx = makeStdTx(signResponse.signed, signResponse.signature);
    }
    const result = await keplr.sendTx(chainId, signedTx, BroadcastMode.Async)
    return uint8ArrayToHex(result)
  } else if (signType === 'DIRECT') {
    if (!rpcUrl) throw Error("rpc url is undefined from server")

    const sendingSigner = keplr?.getOfflineSigner(chainId)
    const sendingStargateClient = await SigningStargateClient?.connectWithSigner(
      rpcUrl,
      sendingSigner,
      STARGATE_CLIENT_OPTIONS,
    )
    const feeArray = !!(fee?.amount[0]) ? [{denom: fee.amount[0].denom, amount: fee?.amount[0].amount}] : []

    let isIbcTx = cosmosTx.data.msgs.filter(k => k.__type === "DirectCosmosIBCTransferMessage").length > 0
    let tmpGas = isIbcTx ? STARGATE_CLIENT_OPTIONS.gasLimits.ibcTransfer : STARGATE_CLIENT_OPTIONS.gasLimits.transfer

    const broadcastTxRes = await sendingStargateClient.signAndBroadcast(
      cosmosTx.fromWalletAddress,
      msgs as any,
      { gas: tmpGas.toString(), amount: feeArray },
    )
    return broadcastTxRes.transactionHash
  } else {
    throw Error(`Sign type for cosmos not supported, type: ${signType}`)
  }

}

const uint8ArrayToHex = (buffer: Uint8Array): string => {
  // @ts-ignore
  return [...buffer]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}

export const prepareEvmTransaction = (evmTransaction: EvmTransaction): TransactionRequest => {
  const manipulatedTx = {
    ...evmTransaction,
    gasPrice: !!evmTransaction.gasPrice ? "0x" + parseInt(evmTransaction.gasPrice).toString(16) : null,
  };

  let tx = {};
  if (!!manipulatedTx.from)
    tx = {...tx, from: manipulatedTx.from};
  if (!!manipulatedTx.to)
    tx = {...tx, to: manipulatedTx.to};
  if (!!manipulatedTx.data)
    tx = {...tx, data: manipulatedTx.data};
  if (!!manipulatedTx.value)
    tx = {...tx, value: manipulatedTx.value};
  if (!!manipulatedTx.gasLimit)
    tx = {...tx, gasLimit: manipulatedTx.gasLimit};
  if (!!manipulatedTx.gasPrice)
    tx = {...tx, gasPrice: manipulatedTx.gasPrice};
  if (!!manipulatedTx.nonce)
    tx = {...tx, nonce: manipulatedTx.nonce};

  return tx;
}

export const checkApprovalSync = async (bestRoute: BestRouteResponse, rangoClient: RangoClient) => {
  while (true) {
    const approvalResponse = await rangoClient.checkApproval(bestRoute.requestId);
    if (approvalResponse.isApproved) {
      return true;
    }
    await sleep(3);
  }
}

export const sortTokenList = (network: any, tokenList: any[]) => {
  if (network.chainId === NetworkIds.FantomOpera) {
    const daiIndex = tokenList.findIndex(token => token.symbol === "DAI");
    if (daiIndex >= 0) {
      let temp = tokenList[0];
      tokenList[0] = tokenList[daiIndex]
      tokenList[daiIndex] = temp;
    }
    const wFtmIndex = tokenList.findIndex(token => token.symbol === "WFTM");
    if (wFtmIndex >= 0) {
      let temp = tokenList[1];
      tokenList[1] = tokenList[wFtmIndex]
      tokenList[wFtmIndex] = temp;
    }
    const ftmIndex = tokenList.findIndex(token => token.symbol === "FTM");
    if (ftmIndex >= 0) {
      let temp = tokenList[2];
      tokenList[2] = tokenList[ftmIndex]
      tokenList[ftmIndex] = temp;
    }
    const fhmIndex = tokenList.findIndex(token => token.symbol === "FHM");
    if (fhmIndex >= 0) {
      let temp = tokenList[3];
      tokenList[3] = tokenList[fhmIndex]
      tokenList[fhmIndex] = temp;
    }

  }
};

export const truncateDecimals = (number: any, digits = 2) => {
  const multiplier = Math.pow(10, digits);
  const adjustedNum = number * multiplier;
  const truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);
  return truncatedNum / multiplier;
};

export const scientificToDecimal = (num: any) => {
  const sign = Math.sign(num);
  //if the number is in scientific notation remove it
  if(/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    const zero = '0';
    const parts = String(num).toLowerCase().split('e'); //split into coeff and exponent
    const e = parts.pop(); //store the exponential part
    let l = Math.abs(Number(e)); //get the number of zeros
    const direction = Number(e)/l; // use to determine the zeroes on the left or right
    const coeffArray = parts[0].split('.');

    if (direction === -1) {
      coeffArray[0] = String(Math.abs(Number(coeffArray[0])));
      num = zero + '.' + new Array(l).join(zero) + coeffArray.join('');
    }
    else {
      const dec = coeffArray[1];
      if (dec) l = l - dec.length;
      num = coeffArray.join('') + new Array(l+1).join(zero);
    }
  }

  if (sign < 0) {
    num = -num;
  }

  return num;
}

export const formatAmount = (amount: any, decimals: any, length = 2, symbol:string="") => {
  if (!amount || !decimals) {
    return 0;
  }

  // workaround for well known decimals
  if (["BTC", "BCH", "LTC"].indexOf(symbol) >= 0) length = Math.min(decimals, 8);
  else if (["ETH", "BNB", "MATIC", "AVAX", "FTM"].indexOf(symbol) >= 0) length = Math.min(decimals, 9);

  const result = ethers.utils.formatUnits(scientificToDecimal(amount).toString(), decimals);
  return truncateDecimals(result, length);
};

export const requireAssetMessage = (requireAssets: any) => {
  if (!requireAssets || !requireAssets.length) {
    return [];
  }
  const result: string[] = [];
  requireAssets.forEach((item: any) => {
    if (!item.ok) {
      result.push(`Needs ≈ ${formatAmount(item.requiredAmount.amount, item.requiredAmount.decimals, 5)} ${item.asset.symbol} for ${item.reason == "FEE" ? "network fee" : "swap"} but you have ${formatAmount(item.currentAmount.amount, item.currentAmount.decimals, 5)} ${item.asset.symbol}`);
    }
  });
  return result;
};

export const expectSwapErrors = (swaps: any) => {
  if (!swaps || !swaps.length) {
    return [];
  }
  const result: any[] = [];
  swaps.forEach((swap: any) => {
    if (!swap?.fromAmountMinValue || !swap?.fromAmountMaxValue) {
      return;
    }
    const title = `${swap.swapperId} Limit`;
    const yours = `Yours: ${new Intl.NumberFormat("en-US").format(swap.fromAmount)} ${swap.from.symbol}`
    let required;
    if (Number(swap?.fromAmountMinValue) > Number(swap?.fromAmount)) {
      required = `Required: >= ${new Intl.NumberFormat("en-US").format(swap?.fromAmountMinValue)} ${swap.from.symbol}`;
    }
    if (Number(swap?.fromAmount) > Number(swap?.fromAmountMaxValue)) {
      required = `Required: <= ${new Intl.NumberFormat("en-US").format(swap?.fromAmountMaxValue)} ${swap.from.symbol}`;
    }
    if (required) {
      result.push(
        {
          title,
          required,
          yours
        }
      );
    }
  });
  return result;
};

export const feeCalculator = (fee: any, metaData: any) => {
  if (!fee || !fee.length || !metaData) {
    return 0;
  }
  let result = 0;
  fee.forEach((item: any) => {
    const token = metaData.tokens.find((token: any) => token.address == item?.asset?.address && token.blockchain == item?.asset?.blockchain);
    if (token) {
      result += Number(item.amount) * Number(token.usdPrice);
    }
  });
  return result;
};


export const getTotalFee = (swaps: any, metaData: any) => {
  if (!swaps || !swaps.length || !metaData) {
    return 0;
  }
  let result = 0;
  swaps.forEach((swap: any) => {
    result += Number(feeCalculator(swap.fee, metaData));
  });
  return result;
};

export const getTotalSwapTime = (swaps: any) => {
  if (!swaps || !swaps.length) {
    return 0;
  }
  let result = 0;
  swaps.forEach((swap: any) => {
    result += Number(swap.timeStat.avg);
  });
  return result;
};

export const getSwapPath = (swaps: any) => {
  if (!swaps || !swaps.length) {
    return [];
  }
  let path: any[] = [];
  swaps.forEach((swap: any, index: number) => {
    path.push(swap.from);
    if (index == swaps.length -1) {
      path.push(swap.to);
    }
  });
  return path;
};

export const formatSwapTime = (duration: number) => {
  const hrs = parseInt((duration / 3600).toString(), 10);
  const mins = parseInt(((duration % 3600) / 60).toString(), 10);
  const secs = duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let result = "";
  if (hrs > 0) {
    result += "" + (hrs < 10 ? "0" + hrs : hrs) + ":";
  }
  result += "" + (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
  return result;
};

export const getDownRate = (fromToken: any, toToken: any, fromTokenAmount: number, toTokenAmount: number) => {
  if (fromTokenAmount == 0 || toTokenAmount == 0 || !fromToken || !toToken) {
    return null;
  }
  const to = toTokenAmount * toToken.usdPrice;
  const from = fromTokenAmount * fromToken.usdPrice;
  return (to / from * 100 - 100);
};

export const isDexPage = () => {
  return window.location.hash.indexOf('dex') >= 0;
}

export const setIsDexLoading = (value: string) => {
  window.localStorage.setItem("is-dex-loading", value);
}

export const isDexLoading = () => {
  return window.localStorage && window.localStorage.getItem("is-dex-loading") === 'true';
}

export const sliceList = (data: any[], length: number) => {
  return data.slice(0, length);
}
