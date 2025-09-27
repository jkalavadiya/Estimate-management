import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Estimate from './Features/estimate/Estimate';
import NotFound from './Features/NotFound';
import Index from './Features/dashboard/Index';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/estimate' element={<Estimate />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    </BrowserRouter>
);

export default App;
