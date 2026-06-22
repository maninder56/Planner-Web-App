

import styles from './manageBoardMembersOptionsSkeleton.module.css'; 


export default function ManageBoardMembersOptionsSkeleton() {
    return (
        <div className={styles.wrapper}>
            <ul>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
            </ul>
        </div>
    ); 
}