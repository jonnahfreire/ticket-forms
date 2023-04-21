import { useEffect } from "react";
import { createContext, useState } from "react";
import { getTasks, sCreateTask, sDeleteTask, sEditTask, sToggleTaskDone } from "../services/TaskService";

export interface TaskProps {
    id?: string,
    done: boolean,
    text: string
}

interface TaskContextData {
    tasks: TaskProps[],
    tasksDone: number,
    tasksTodo: number,
    createTask: (text: string) => void,
    editTask: (task: TaskProps) => void
    deleteTask: (id: string) => void,
    getAllTasks: () => void
}

export const TaskContext = createContext<TaskContextData>({} as TaskContextData);

export const TasksProvider = ({ children }: any) => {
    const [tasks, setTasks] = useState<TaskProps[]>([])

    const tasksDone = tasks.filter(t => t.done).length
    const tasksTodo = tasks.length - tasksDone

    useEffect(() => {
        getAllTasks()
    }, [tasks])

    function createTask(text: string): void {
        sCreateTask({ text, done: false })
        getAllTasks()
    }

    async function getAllTasks() {
        const response = await getTasks()
        setTasks(response)
    }

    function editTask(task: TaskProps): void {
        sEditTask(task)
        getAllTasks()
    }

    function deleteTask(id: string): void {
        sDeleteTask(id)
        getAllTasks()
    }

    return <TaskContext.Provider value={{
        tasks,
        tasksDone,
        tasksTodo,
        createTask,
        editTask,
        deleteTask,
        getAllTasks
    }}>
        {children}
    </TaskContext.Provider>
}