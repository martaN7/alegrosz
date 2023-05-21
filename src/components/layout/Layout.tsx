import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <>
            <div>Navbar</div>
            <Outlet />
        </>
    );
}

export default Layout;
