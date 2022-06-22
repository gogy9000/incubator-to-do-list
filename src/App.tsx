import React, {useEffect} from 'react';
import './App.css';
import {TodoContainer} from "./ToDo/TodoContainer";
import {Grid} from "@mui/material";
import {PrimarySearchAppBar} from "./AppBar/AppBar";
import {useDispatch, useSelector} from "react-redux";
import {thunks} from "./Redux/ToDoReducer";
import {AppDispatchType, AppStateType, AppThunk,} from "./Redux/ReduxStore";
import {Dispatch} from "redux";

export const useAppDispatch = () => useDispatch()

export const App = React.memo(() => {
        const state = useSelector((state: AppStateType) => state.stateTodo)
        const dispatch = useDispatch()

        useEffect(() => {
            // @ts-ignore
            dispatch(thunks.getTodolistAndTasks())
        }, [])
        useEffect(() => {

           if (!state.offlineMode){
               // @ts-ignore
            dispatch(thunks.synchronizeTodo())
           }
        }, [state.offlineMode])


        return (

            <>
                <PrimarySearchAppBar/>
                <Grid container direction='column' justifyContent='end' spacing={1} pl={3} pr={3}>
                    <TodoContainer/>
                </Grid>
            </>
        )
            ;
    }
)




