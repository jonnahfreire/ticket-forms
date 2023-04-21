import tw from 'tailwind-styled-components';


const TaskInfoWrapper = tw.div`
    flex flex-row
    justify-end
    items-center
    mt-2
    h-[1rem]
`
const TodoTasksWrapper = tw.div`
    ml-3
    flex flex-row
    font-bold
    text-[.6rem]
`
const TodoTasksCounter = tw.div`
    px-1 
    rounded-sm 
    bg-[#437EB1] 
    ml-1 
    font-bold text-white
`
const DoneTasksCounter = tw(TodoTasksCounter)`
    bg-[#038B00]
`

interface TaskInfoProps {
    todo: number,
    done: number,
    total: number
}

export const TasksInfo = (tasks: TaskInfoProps) => {
    return (
        <TaskInfoWrapper>
            <TodoTasksWrapper className='text-[#69C5E0]'>
                TAREFAS A FAZER
                <TodoTasksCounter>{ tasks.todo }</TodoTasksCounter>
            </TodoTasksWrapper>
            <TodoTasksWrapper className='text-[#038B00]'>
                CONCLUÍDAS
                <DoneTasksCounter>{ tasks.done } de { tasks.total }</DoneTasksCounter>
            </TodoTasksWrapper>
        </TaskInfoWrapper>
    );
}