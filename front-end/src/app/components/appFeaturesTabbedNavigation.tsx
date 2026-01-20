
import styles from '@/app/components/appFeaturesTabbedNavigation.module.css'; 
import Image from 'next/image';
import { useState } from 'react';

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
            description: 'Description one'
        }, 
        {
            tabId: 1,
            tabTitle: 'Multiple Projects', 
            imageSrc: '/mockImage.jpg', 
            description: 'two '
        }, 
        {
            tabId: 2,
            tabTitle: 'Colaborate', 
            imageSrc: '/mockImage.jpg', 
            description: 'three'
        }, 
        {
            tabId: 3,
            tabTitle: 'Customise', 
            imageSrc: '/mockImage.jpg', 
            description: 'four'
        }
    ]; 

    const [currentTab, setCurrentTab] = useState<tabInterface>(tabs[0]); 

    function getCurrentTab() {
        return (
            <div>
                <Image src={currentTab.imageSrc}  alt={`${currentTab.tabTitle} image`} width={640} height={400} loading='eager' />
                <p>{currentTab.description}</p>
            </div>
        ); 
    }
    

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.headerContainer}>
                    {tabs.map((content) => 
                        <button key={content.tabId}
                            onClick={() => setCurrentTab(content)}>
                            {content.tabTitle}
                        </button>
                    )}
                </div>
                <div className={styles.contentContainer}>
                    <div>
                        {getCurrentTab()}
                    </div>
                </div>
            </div>
        </div>
    ); 
}