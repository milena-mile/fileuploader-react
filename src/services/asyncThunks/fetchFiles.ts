import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import { FileData } from '../../components/FilesList/types';

export const fetchFiles = createAsyncThunk(
    'files/fetchFiles',
    async () => {
        try {
            const fetchedFiles = await getDocs(collection(firestore, 'files'));
            const files: FileData[] = [];
            fetchedFiles.forEach(doc => {
                files.push({id: doc.id, ...doc.data()} as FileData);
            })

            return files;

        } catch(error) {
            throw new Error('Failed to fetch files');
        }
    }
)

export default fetchFiles;