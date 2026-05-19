


import styles from './inboxOptionsLoadingSkeleton.module.css'; 

export default function InboxOptionsLoadingSkeleton() {
    return (
        <div className={[styles.wrapper, 'skeletonBackground'].join(' ')}>
            <ul>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
                <li className='skeletonElement'></li>
            </ul>
        </div>
    ); 
}