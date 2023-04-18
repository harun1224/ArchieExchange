import { createSlice } from "@reduxjs/toolkit";
import { wallets } from "../views/Dex/walletsinfo";
export interface WalletState{
    walletStatus: any
}

const initialState: WalletState = {
    walletStatus: wallets,
}

export const WalletstatusSlice = createSlice({
    name:'walletStatus',
    initialState,
    reducers:{
        changeState:(state,walletinfo) =>{
            state.walletStatus = walletinfo;
        }
    }
})

export const{ changeState } = WalletstatusSlice.actions;

export default WalletstatusSlice.reducer;
