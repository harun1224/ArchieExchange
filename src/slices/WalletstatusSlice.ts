import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
        changeState:(state, action: PayloadAction<any>) =>{
            console.log("action", action)
            state.walletStatus = action.payload;
        },

        walletConnected:(state, action: PayloadAction<number>) => {
            
            state.walletStatus[action.payload].status = "connected";
        },
        walletDisconnected:(state, action: PayloadAction<number>) => {
            console.log("disconnected asdasdasd",)
            state.walletStatus[action.payload].status = "disconnected";
        }
    }
})

export const{ changeState, walletConnected, walletDisconnected } = WalletstatusSlice.actions;

export default WalletstatusSlice.reducer;
