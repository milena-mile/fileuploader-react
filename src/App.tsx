import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Uploader from './components/Uploader/Uploader';
import FilesList from './components/FilesList/FilesList';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Uploader/>}/>
      <Route path="/list" element={<FilesList/>}/>
    </Routes>
  )
}

export default App;
