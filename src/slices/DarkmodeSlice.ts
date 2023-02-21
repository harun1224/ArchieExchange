import { createSlice } from "@reduxjs/toolkit";

export interface DarkModeState{
    DarkState:boolean
}

const initialState:DarkModeState = {
    DarkState: true,
}

export const DarkmodeSlice = createSlice({
    name:'darkmode',
    initialState,
    reducers:{
        changeMode:(state) =>{
            state.DarkState = !state.DarkState;
        }
    }
})

export const{ changeMode } = DarkmodeSlice.actions;

export default DarkmodeSlice.reducer;
