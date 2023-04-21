import tw from 'tailwind-styled-components';

import Folder from '../../assets/dotted-folder.png'


const TaskListWrapperEmpty = tw.div`
    flex
    w-full
    h-[300px]
    min-h-full
    flex-col
    justify-center
    items-center

    mt-3
    p-2
    border border-[0.1rem]
    border-dashed 
    box-decoration-slice
    border-[#437EB1]
`
const ParagraphInfoUpper = tw.p`
    font-bold 
    text-[#437EB1] 
    uppercase 
    text-[.9rem] 
    text-center
`
const ParagraphInfoNormal = tw(ParagraphInfoUpper)`
    font-normal    
    normal-case
`

export const EmptyTasksInfo = () => {
    return (
        <TaskListWrapperEmpty>
            <img src={Folder} alt='folder' width={40} />
            <ParagraphInfoUpper>
                A sua lista de tarefas está vazia
            </ParagraphInfoUpper>
            <ParagraphInfoNormal>
                Adicione uma nova tarefa e comece a organizar o seu dia
            </ParagraphInfoNormal>
        </TaskListWrapperEmpty>
    );
}