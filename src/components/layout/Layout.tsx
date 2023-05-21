import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import ResponsiveAppBar from '../NavBar/NavBar.tsx';

function Layout() {
    return (
        <>
            <ResponsiveAppBar />
            <Container maxWidth="lg">
                <Outlet />
            </Container>
        </>
    );
}

export default Layout;
