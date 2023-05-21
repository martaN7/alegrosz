import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <h1>Alegrosz</h1>
        </>
    );
}

export default App;
