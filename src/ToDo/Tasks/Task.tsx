import {TaskType} from "../../Types";
import React, {useCallback, useState} from "react";
import {thunks} from '../../Redux/ToDoReducer';
import {Box, Card, CardContent, Checkbox, IconButton, LinearProgress, Typography} from "@mui/material";
import {CheckCircleOutline, Clear, Create, RadioButtonUnchecked} from "@mui/icons-material";
import {CustomEditSpan} from "../../CustomComponent/CustomEditSpan";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useDispatchApp, useSelectorApp} from "../../App";
import {CollapsedButtons} from "../../common/CollapsedButtons";

export type TaskPropsType = {
    todoId: string
    task: TaskType
}

export const Task: React.FC<TaskPropsType> = React.memo(({task, todoId}) => {


        const [taskValue, setTaskValue] = useState<string>(task.title)
        const [error, setError] = useState<string>('')
        const [editModeControlled, setEditModeControlled] = useState<boolean>(false)

        const dispatch = useDispatchApp()
        const isWaitingId = useSelectorApp(store => store.appReducer.waitingList[task.id])


        const checkTask = useCallback(() => {
            dispatch(thunks.updateTask({...task, status: task.status === 0 ? 1 : 0}))
        }, [dispatch, task])


        const updateTask = useCallback(() => {

            if (!taskValue.trim()) {
                setEditModeControlled(true)
                setError('todo empty')
                return
            }

            dispatch(thunks.updateTask({...task, title: taskValue.trim()}))
            if (error !== '') {
                setError('')
            }
            setEditModeControlled(false)

        }, [dispatch, task, taskValue, error])

        const deleteTask = useCallback(() => {
            dispatch(thunks.deleteTask(todoId, task))

        }, [dispatch, task.id, todoId])

        const onEditMode = () => {
            setEditModeControlled(true)
        }

        return (
            <Card variant={"outlined"}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: "flex-end",
                    backgroundColor: (task.isASynchronizedTask ? 'whitesmoke' : 'lightgrey'),
                    opacity: (task.status === 1 ? 0.5 : 1)
                }}>

                    <CardContent>
                        <Typography component={'div'} variant="body2" color="text.primary">
                            <CustomEditSpan value={taskValue}
                                            variant='standard'
                                            error={!!error}
                                            onEnter={updateTask}
                                            label="update task"
                                            onChangeText={setTaskValue}
                                            editModeControlled={editModeControlled}
                                            setEditModeControlled={setEditModeControlled}
                                            spanProps={{children: !task.title ? undefined : task.title}}
                            />
                        </Typography>
                    </CardContent>
                    <CollapsedButtons expandIcon={<ExpandMoreIcon/>}>

                        <IconButton onClick={deleteTask}>
                            <Clear/>
                        </IconButton>
                        {
                            !editModeControlled
                            ?
                            <IconButton onClick={onEditMode}>
                                <Create/>
                            </IconButton>
                            :
                            <IconButton onClick={updateTask}>
                                <Create color='primary'/>
                            </IconButton>
                        }

                        <Checkbox
                            checked={task.status === 1}
                            inputProps={{'aria-label': 'controlled'}}
                            icon={<RadioButtonUnchecked/>}
                            checkedIcon={<CheckCircleOutline/>}
                            onChange={checkTask}
                        />

                    </CollapsedButtons>
                </Box>
                {isWaitingId && <LinearProgress/>}
            </Card>
        )
    }
)

