export default function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <main>
                <p>lay out of both log in and sign up</p>
                {children}
            </main>
        </div>
    ); 
}