import FilesList from './components/FilesList/FilesList';
import NotFound from './components/NotFount/NotFound';
import Uploader from './components/Uploader/Uploader';
import { Route, Routes } from 'react-router-dom';
import './App.scss';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Uploader/>}/>
      <Route path="/list" element={<FilesList/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;
