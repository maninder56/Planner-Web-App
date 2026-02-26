
import HoverOptionsPanel from '@/Components/HoverPanels/HoverOptionsPanel/hoverOptionsPanel';
import styles from './listMenuOptions.module.css'; 
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';


export default function ListMenuOptions() {
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel);
    
    return (
        <HoverOptionsPanel title='List Menu' onCloseClick={() => setActivePanel('none')} offsetZeroTo='right'>
            <div className={styles.wrapper}>
                <div>
                    <span>Order by</span>
                    <select>
                        <option value='new'>New to old</option>
                        <option value='old'>New to old</option>
                        <option value='due'>New to old</option>
                        <option value='date'>New to old</option>
                    </select>
                </div>
                <button>
                    Delete List
                </button>
            </div>
        </HoverOptionsPanel>
    ); 
}