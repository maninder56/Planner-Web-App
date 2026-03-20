
import styles from './searchBar.module.css'; 

export default function SearchBar({
    placeHolder, 
    value, 
    setValue,
}: {
    placeHolder?: string; 
    value: string; 
    setValue: (newValue: string) => void; 
}) {
    return (
        <div className={styles.wrapper}>
            <svg fill="none" viewBox="4.75 4.25 15.5 15.5">
                <path clip-rule="evenodd" d="M5.5 10.766a5.765 5.765 0 1 1 11.53 0 5.765 5.765 0 0 1-11.53 0" 
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.029 16.53 19.5 19" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input 
                type='text'
                placeholder={placeHolder === undefined ? 'Search': placeHolder}
                value={value}
                onChange={e => setValue(e.target.value)} />
        </div>
    ); 
}