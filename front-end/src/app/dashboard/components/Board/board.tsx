
import { useEffect } from 'react';
import { LastUsedBoardRequest } from '../../Services/boardService';
import { useBoardStore } from '../../Store/boardStore';
import { NormaliseBoardData } from '../../Utilities/boardData';
import styles from './board.module.css'; 
import BoardContent from './BoardContent/boardContent';
import BoardHeaderBar from './BoardHeader/boardHeaderBar';

export default function Board() {
    const hydrateBoard = useBoardStore((state) => state.hydrateBoard); 
    const setBoardLoading = useBoardStore((state) => state.setBoardLoading); 


    useEffect(() => {
        const fetchData = async () => {
            const dataRequest = await LastUsedBoardRequest(); 
            if (dataRequest.ok && dataRequest.data !== undefined) {
                hydrateBoard(NormaliseBoardData(dataRequest.data)); 
            }

            setBoardLoading(false); 
        }; 

        fetchData(); 
    }, []); 


    return (
        <main className={styles.mainContent}>
            <section>
                <BoardHeaderBar />
            </section>
            <section>
                <BoardContent />
            </section>
        </main>
    ); 
}