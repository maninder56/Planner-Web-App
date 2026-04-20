
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import styles from './listMenuOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import Button from '@/Components/Buttons/button';
import { ListId, useBoardStore } from '@/app/dashboard/Store/boardStore';


export default function ListMenuOptions({
    currentOpenListMenuId, 
}: {
    currentOpenListMenuId?: ListId;  
}) {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel);
    
    async function handleDeleteButton() {
        if (currentOpenListMenuId === undefined) {
            return; 
        }
    }

    return (
        <HoverOptionsPanel title='List Menu' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.wrapper}>
                <div className={styles.deleteButtonContainer}>
                    <Button name='Delete' color='red' disabled={false} onClick={handleDeleteButton} />
                </div>
            </div>
        </HoverOptionsPanel>
    ); 
}