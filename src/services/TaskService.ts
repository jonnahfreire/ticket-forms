import { TaskProps } from "../contexts/TaskContext";

const API = import.meta.env.VITE_API_URL || "https://worrisome-toga-deer.cyclic.app";

export async function getTasks(): Promise<TaskProps[]> {
    const response = await fetch(`${API}/tasks`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    return await response.json();
}

export async function sCreateTask(task: TaskProps): Promise<void> {
    const response = await fetch(`${API}/task`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: task.text, done: task.done })
    })

    return await response.json();
}

export async function sEditTask(task: TaskProps): Promise<void> { 
    const response = await fetch(`${API}/task/${task.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: task.text, done: task.done })
    })

    return await response.json();
}

export async function sToggleTaskDone(task: TaskProps): Promise<void> {
    return await sEditTask(task);
}

export async function sDeleteTask(id: string): Promise<void> { 
    const response = await fetch(`${API}/task/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

    return await response.json();
}