import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as StakingStaking } from "../abi/StakingStaking.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {fetchAccountSuccess, getBalances, loadAccountDetails} from "./AccountSlice";
import { error, info } from "./MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import {sleep} from "../helpers/Sleep";
import { act } from "@testing-library/react";

interface IUAData {
    address: string;
    value: string;
    approved: boolean;
    txHash: string | null;
    type: string | null;
}

function alreadyApprovedToken(token: string, stakeAllowance: BigNumber, unstakeAllowance: BigNumber) {
    // set defaults
    let bigZero = BigNumber.from("0");
    let applicableAllowance = bigZero;

    // determine which allowance to check
    if (token === "wsfhm") {
        applicableAllowance = stakeAllowance;
    } else if (token === "sfhm") {
        applicableAllowance = unstakeAllowance;
    }
    // check if allowance exists
    if (applicableAllowance.gt(bigZero)) return true;

    return false;
}

export const changeApproval = createAsyncThunk(
    "stake/changeApproval",
    async ({ token, provider, address, networkId }: IChangeApprovalAsyncThunk, { dispatch }) => {
        if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
        }

        const signer = provider.getSigner();
        const sohmContract = new ethers.Contract(addresses[networkId].SOHM_ADDRESS as string, ierc20Abi, signer);
        const wsohmContract = new ethers.Contract(addresses[networkId].WSOHM_ADDRESS as string, ierc20Abi, signer);
        let approveTx;
        let unstakeAllowance = await sohmContract.allowance(address, addresses[networkId].STAKING_ADDRESS);
        let stakeAllowance = await wsohmContract.allowance(address, addresses[networkId].STAKINGSTAKING_ADDRESS);

        // return early if approval has already happened
        if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance)) {
            dispatch(info("Approval completed."));
            return dispatch(
                fetchAccountSuccess({
                    staking: {
                        ohmStake: +stakeAllowance,
                        ohmUnstake: +unstakeAllowance,
                        wsohmStake: +stakeAllowance,
                    },
                }),
            );
        }

        try {
            if (token === "wsfhm") {
                approveTx = await wsohmContract.approve(
                    addresses[networkId].STAKINGSTAKING_ADDRESS,
                    ethers.utils.parseUnits("1000000000000000000", 18).toString(),
                );
            } else if (token === "sfhm") {
                approveTx = await sohmContract.approve(
                    addresses[networkId].STAKING_ADDRESS,
                    ethers.utils.parseUnits("1000000000", "gwei").toString(),
                );
            }

            const text = "Approve " + (token === "fhm" ||  token === "wsfhm" ? "Staking" : "Unstaking");
            const pendingTxnType = token === "fhm" ||  token === "wsfhm" ? "approve_staking" : "approve_unstaking";
            dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

            await approveTx.wait();
        } catch (e: unknown) {
            dispatch(error((e as IJsonRPCError).message));
            return;
        } finally {
            if (approveTx) {
                dispatch(clearPendingTxn(approveTx.hash));
            }
        }

        // go get fresh allowances
        stakeAllowance = await wsohmContract.allowance(address, addresses[networkId].STAKINGSTAKING_ADDRESS);
        unstakeAllowance = await sohmContract.allowance(address, addresses[networkId].STAKING_ADDRESS);

        return dispatch(
            fetchAccountSuccess({
                staking: {
                    ohmStake: 0,
                    ohmUnstake: +unstakeAllowance,
                    wsohmStake: +stakeAllowance,
                },
            }),
        );
    },
);

export const changeStake = createAsyncThunk(
    "stake/changeStake",
    async ({ action, value, provider, address, networkId }: IActionValueAsyncThunk, { dispatch }) => {
        if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
        }

        const signer = provider.getSigner();
        const stakingHelper = new ethers.Contract(
            addresses[networkId].STAKINGSTAKING_ADDRESS as string,
            StakingStaking,
            signer,
    );

        let stakeTx;
        let uaData: IUAData = {
            address: address,
            value: value,
            approved: true,
            txHash: null,
            type: null,
        };
        try {
            if (action === "stake") {
                uaData.type = "stake";
                stakeTx = await stakingHelper.deposit(address, ethers.utils.parseUnits(value, 18));
            } else {
                uaData.type = "unstake";
                stakeTx = await stakingHelper.withdraw(address, ethers.utils.parseUnits(value, 18), false);
            }
            const pendingTxnType = action === "stake" ? "staking" : "unstaking";
            uaData.txHash = stakeTx.hash;
            dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
            await stakeTx.wait();
        } catch (e: unknown) {
            uaData.approved = false;
            const rpcError = e as IJsonRPCError;
            if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
                dispatch(
                    error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
                );
            } else {
                dispatch(error(rpcError.message));
            }
            return;
        } finally {
            if (stakeTx) {
                await sleep(5);
                dispatch(clearPendingTxn(stakeTx.hash));
            }
        }
    },
);

export const changeClaim = createAsyncThunk(
    "stake/changeClaim",
    async ({ action, value, provider, address, networkId }: IActionValueAsyncThunk, { dispatch }) => {
        if (!provider) {
            dispatch(error("Please connect your wallet!"));
            return;
        }
        console.log(action)

        const signer = provider.getSigner();
        const stakingHelper = new ethers.Contract(
            addresses[networkId].STAKINGSTAKING_ADDRESS as string,
            StakingStaking,
            signer,
    );

        let claimTx;
        let uaData: IUAData = {
            address: address,
            value: value,
            approved: true,
            txHash: null,
            type: null,
        };
        try {
            uaData.type = "claim";
            claimTx = await stakingHelper.claim(1000);
       
            const pendingTxnType = "claiming";
            uaData.txHash = claimTx.hash;
            dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
            await claimTx.wait();
        } catch (e: unknown) {
            uaData.approved = false;
            const rpcError = e as IJsonRPCError;
            if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
                dispatch(
                    error("Claim failed! Error code: 32603. Message: ds-math-sub-underflow"),
                );
            } else {
                dispatch(error(rpcError.message));
            }
            return;
        } finally {
            if (claimTx) {
                segmentUA(uaData);
                await sleep(5);
                dispatch(clearPendingTxn(claimTx.hash));
            }
        }
    },
);
