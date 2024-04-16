import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    name:'',
    user:''
}

export const CurrentDBSlice = createSlice({
    name:'currentDatabase',
    initialState,
    reducers:{
        setCurrentDB:(state,action)=>{
            state.name = action.payload
        },
        setUser:(state,action)=>{
            state.user = action.payload
        }
    }

})

export const { setCurrentDB, setUser } = CurrentDBSlice.actions
export default CurrentDBSlice.reducer
export const SelectCurrent = (state:any) => state.currentDatabase.name
export const SelectUser = (state:any) => state.currentDatabase.user

