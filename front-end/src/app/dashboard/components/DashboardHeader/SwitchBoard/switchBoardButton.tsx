
import { useActivePanel } from '@/app/dashboard/Hooks/ActivePanel/ActivePanelContext';
import styles from './switchBoardButton.module.css'; 
import Image from 'next/image';
import SwitchBoardOptions from './switchBoardOptions';
import { useBoardUIStore } from '@/app/dashboard/Store/boardUIStore';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';


export default function SwitchBoardButton() {
    const isBoardLoading = useBoardStore((state) => state.isBoardLoading); 
    const isSwitchBoardOptionsOpen = useBoardUIStore((state) => state.activePanel === 'switchBoardOptions'); 
    const setActivePanel = useBoardUIStore((state) => state.setActivePanel); 

    return (
        <div className={styles.wrapper} onClick={e => { e.stopPropagation(); }}>
            <button className={styles.mainButton}
                disabled={isBoardLoading}
                onClick={e => {
                    e.stopPropagation(); 
                    setActivePanel(isSwitchBoardOptionsOpen ? 'none' : 'switchBoardOptions'); 
                }}>
                <svg height="20" width="20" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" 
                    clipRule="evenodd"  strokeLinejoin="round" strokeMiterlimit="2">
                    <path d="M685.929 83.57c25.864 0 50.669 10.349 68.959 28.77 18.289 18.422 28.563 43.406 28.563 69.457v291.546c0 26.052-10.274 51.036-28.563 69.457s-43.095 28.77-68.959 28.77H261.418c-25.864 0-50.67-10.349-68.959-28.77s-28.563-43.405-28.563-69.457V181.797c0-26.051 10.274-51.035 28.563-69.457s43.095-28.77 68.959-28.77z" 
                        fill="#767676" transform="matrix(1.0254 0 0 1.01805 -168.06 128.19)"/>
                    <path d="M685.929 83.57c25.864 0 50.669 10.349 68.959 28.77 18.289 18.422 28.563 43.406 28.563 69.457v291.546c0 26.052-10.274 51.036-28.563 69.457s-43.095 28.77-68.959 28.77H261.418c-25.864 0-50.67-10.349-68.959-28.77s-28.563-43.405-28.563-69.457V181.797c0-26.051 10.274-51.035 28.563-69.457s43.095-28.77 68.959-28.77z"
                        fill="#383838" transform="matrix(1.0254 0 0 1.01805 -3.353 4.845)"/>
                </svg>
                <span>Switch Board</span>
            </button>
        </div>
    ); 
}