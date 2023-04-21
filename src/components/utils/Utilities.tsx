import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Toast from '@radix-ui/react-toast';

import './alert.css';
import './toast.css';

import Delete from '../../assets/Trash.png'

interface DeletetionProps {
    onDeleteTask: () => void
}

export const DeletionAlert = ({ onDeleteTask }: DeletetionProps) => {

    return (
        < AlertDialog.Root >
            <AlertDialog.Trigger asChild>
                <button className='outline-0'>
                    <img src={Delete} alt='action-button' width={20} height={20} />
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="AlertDialogOverlay" />
                <AlertDialog.Content className="AlertDialogContent">
                    <AlertDialog.Title className="AlertDialogTitle">Tem certeza?</AlertDialog.Title>
                    <AlertDialog.Description className="AlertDialogDescription">
                        Essa ação não pode ser desfeita. Isso irá deletar permanentemente a tarefa selecionada.
                    </AlertDialog.Description>
                    <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
                        <AlertDialog.Cancel asChild>
                            <button className="Button mauve">Cancelar</button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <button className="Button red" onClick={() => onDeleteTask()}> Sim, deletar tarefa</button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root >
    );
}

interface ToastProps {
    isOpen: boolean | false,
    handleOpen: () => void,
    handleClose: () => void,
    description?: string
}

export const ToastDialog = ({ isOpen, handleOpen, handleClose, description }: ToastProps) => {

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Root className="ToastRoot" open={isOpen} onOpenChange={handleOpen}>
                <Toast.Title className="ToastTitle">Tarefa criada com sucesso!</Toast.Title>
                {description !== undefined && <Toast.Description asChild>
                    <span className='ToastDescription'>{description}</span>
                </Toast.Description>}
                <Toast.Action className="ToastAction" asChild altText="confirm">
                    <button className="Button small green" onClick={handleClose}>OK</button>
                </Toast.Action>
            </Toast.Root>
            <Toast.Viewport className="ToastViewport" />
        </Toast.Provider>
    );
};