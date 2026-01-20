
import styles from '@/app/components/appFeaturesTabbedNavigation.module.css'; 
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface tabInterface {
    tabId: number;
    tabTitle: string;
    imageSrc: string;
    description: string; 
}

export default function AppFeaturesTabbedNavigation() {
    const tabs = [
        {
            tabId: 0,
            tabTitle: 'Manage To-Dos', 
            imageSrc: '/mockImage.jpg', 
            description: 'See all of your to-dos of a project in one place, Drag and drop to-dos from one category to another, Create new lists to manage as the projects grows.'
        }, 
        {
            tabId: 1,
            tabTitle: 'Multiple Projects', 
            imageSrc: '/mockImage.jpg', 
            description: 'Want to keep track of other projects not just the main one? then create new board for those project.'
        }, 
        {
            tabId: 2,
            tabTitle: 'Colaborate', 
            imageSrc: '/mockImage.jpg', 
            description: 'Invite your friends to your project to work on it together.'
        }, 
        {
            tabId: 3,
            tabTitle: 'Customise', 
            imageSrc: '/mockImage.jpg', 
            description: 'Choose the colours that fit your style and make your dashboard personal.'
        }
    ]; 

    const [currentTab, setCurrentTab] = useState<tabInterface>(tabs[0]); 
    const scrollTargetRef = useRef<null | HTMLDivElement>(null); 
    
    return (
        <div className={styles.container} ref={scrollTargetRef} >
            <div>
                <div className={styles.headerContainer}>
                    {tabs.map((content) => 
                        <button key={content.tabId}
                            onClick={() => {
                                setCurrentTab(content); 
                                scrollTargetRef.current?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest' }); 
                            }}
                            className={content.tabId === currentTab.tabId ? styles.active : undefined}>
                            {content.tabTitle}
                        </button>
                    )}
                </div>
                <div className={styles.contentContainer}>
                    <div>
                        <div className={styles.feature} key={currentTab.tabId}>
                            <Image src={currentTab.imageSrc}  alt={`${currentTab.tabTitle} image`} width={640} height={400} loading='eager' />
                            <p>{currentTab.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}