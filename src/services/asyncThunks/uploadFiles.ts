
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FileData } from '../../components/FilesList/types';
import { firestore, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface UploadFileArgs {
	file: File;
	setProgress: (progress: number) => void;
}

const uploadFiles = createAsyncThunk<FileData, UploadFileArgs>(
	"files/uploadFiles",
	async ({ file, setProgress }: UploadFileArgs) => {
		const date = new Date();
		const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
		const formattedDate = date.toLocaleDateString("en-US", options);

		const size =
			file.size > 1048576
				? `${(file.size / 1048576).toFixed(2)} MB`
				: `${(file.size / 1024).toFixed(0)} KB`;

		const newFile: FileData = {
			id: uuidv4(),
			name: file.name,
			size: size,
			type: file.type,
			uploadDate: formattedDate,
			downloadURL: "",
		};
		const storageRef = ref(storage, "uploads/" + newFile.name);
		const uploadTask = uploadBytesResumable(storageRef, file);

		return new Promise<FileData>(async (resolve, reject) => {
				setProgress(1);

				const collectionFiles = collection(firestore, "files");
				const q = query(
					collectionFiles,
					where("name", "==", newFile.name)
				);

				setProgress(10);
				const querySnapshot = await getDocs(q);
				
				if (querySnapshot.empty) {
					setProgress(15); 

					uploadTask.on(
						"state_changed",
						(snapshot) => {
							const progress = 20 + (snapshot.bytesTransferred / snapshot.totalBytes) * 70;
							setProgress(progress);
						},
						(error) => {
							reject(error);
						},
						async () => {
							const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
							newFile.downloadURL = downloadURL;
							setProgress(95);
		
							try {
								await addDoc(collectionFiles, {
									id: newFile.id,
									name: newFile.name,
									size: newFile.size,
									type: newFile.type,
									uploadDate: newFile.uploadDate,
									downloadURL: newFile.downloadURL,
								});
	
								setProgress(100);
								resolve(newFile);
	
							} catch (error) {
								reject(error);
							}
						}
					);
				} else {
					reject("Upload failed");
				}
		});
	}
);

export default uploadFiles;
