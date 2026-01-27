
export default function InnerPanelButton({
    name, 
    onClick,
}: {
    name: string; 
    onClick: () => void; 
}) {
    return (
        <button className='innerPanelButton'
            onClick={onClick}
            type='button'>
            {name}
        </button>
    ); 
}