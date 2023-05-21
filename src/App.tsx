import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { CssBaseline } from '@mui/material';

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <CssBaseline />
        </>
    );
}

export default App;
