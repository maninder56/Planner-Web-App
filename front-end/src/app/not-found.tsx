'use client'

import { AppRoute } from "@/Types/appRoutes";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";

export default function NotFound() {
    const dashboard: AppRoute = '/dashboard'; 
    const home: AppRoute = '/'; 

    return (
        <div className="pageNotFound">
            <div>
                <header>Page Not Found</header>
                <p>Sorry, We can not find the page you are looking for</p>
                <div className="pageNotFoundLinks">
                    <Link href={home} className="button red">Home</Link>
                    <Link href={dashboard} className="button red">Dashboard</Link>
                </div>
            </div>
        </div>
    ); 
}