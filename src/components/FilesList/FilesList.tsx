import Error from '../Error/Error';
import fetchFiles from '../../services/asyncThunks/fetchFiles';
import Loading from '../Loading/Loading';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { FileData, FilesState } from './types';
import { fileDeleted } from '../../slice/filesSlice';
import { FilesDispatch } from '../../store/store';
import { firestore, storage } from '../../services/firebase';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import './filesList.scss';

const FilesList = () => {
	const dispatch = useDispatch<FilesDispatch>();
	const files = useSelector((state: FilesState) => state.files.entities);
	const loadingStatus = useSelector((state: FilesState) => state.files.filesLoadingStatus);

    const dropdownRefs = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		dispatch(fetchFiles());
	}, [dispatch]);

    useEffect(() => {
        const handleDropdownPosition = () => {       
            if (dropdownRefs.current) {
                dropdownRefs.current.forEach((item) => {
                    if (item != null) {
                        const fromBottom = window.innerHeight - item.getBoundingClientRect().bottom;
                        if (fromBottom < 150) {
                            item.classList.add("top-position");
                        } else {
                            item.classList.remove("top-position");
                        }
                    }
                })
            }
        }
        handleDropdownPosition();

        window.addEventListener('scroll', handleDropdownPosition);
        return () => {
          window.removeEventListener('scroll', handleDropdownPosition);
        };
    }, [loadingStatus]);

    const handleIcon = (type: string) => {
        if (type) {
            let fileType = type.split("/")[0];
            switch (fileType) {
                case "image":
                    return "image.svg";
                case "text":
                case "application":
                    return "file.svg";
                case "video":
                    return "film.svg";
            }
        } else {
            return "default.svg";
        }
    }

    const downloadFile = (e: React.MouseEvent<HTMLAnchorElement>, url: string, fileName: string) => {
        e.preventDefault();
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        })
          .then(response => response.blob())
          .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          })
          .catch(err => console.error('Download failed', err));
      }

    const handleRemoveFile = (file: FileData, fileUrl: string) => {
        dispatch(fileDeleted(file.id));
        const storageRef = ref(storage, fileUrl);

        deleteObject(storageRef)
            .then(async () => {
                const collectionFiles = collection(firestore, "files");
                const q = query(
                    collectionFiles,
                    where("id", "==", file.id)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docRef = querySnapshot.docs[0].ref;
                    await deleteDoc(docRef);
                } else {
                    console.log(`No document found with ID ${file.id}.`);
                }
             })
            .catch(error => console.error("Error deleting document: ", error));
    }

    const sortFiles = () => {
        return Object.values<FileData>(files).sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
    }

	return (
		<div className="b-files">
			<div className="b-files_header">
				<div className="b-files_header-title">Files Uploaded</div>
				<Link to="/" className="button-link--dark">
					<img src="images/upload-icon.svg" alt="upload icon" />Upload
				</Link>
			</div>
			<div className="b-files">
				{loadingStatus === "loading" && <Loading/>}
				{loadingStatus === "error" && <Error/>}
				{loadingStatus === "idle" && (
					<div className="b-files_list">
                            <div className="b-files_item header">
                                <div className="b-files_title-header">File name</div>
                                <div className="b-files_size">File size</div>
                                <div className="b-files_date">Date Uploaded</div>
                            </div>
						{sortFiles().map((file, i) => (
							<div className="b-files_item" key={file.id}>
                                <div className="b-files_name">
                                    <div className="b-files_icon">
                                        <img src={`images/${handleIcon(file.type)}`} alt={file.name}/>
                                    </div>
                                    <div className="b-files_title">{file.name}</div>
                                    <span className="b-files_title-size">{file.size}</span>
                                </div>
                                <div className="b-files_size">{file.size}</div>
                                <div className="b-files_date">{file.uploadDate}</div>
                                <div className="b-files_actions">
                                    <button className="b-files_actions-button" ref={el => dropdownRefs.current[i] = el}></button>
                                    <div className="b-files_dropdown">
                                        <Link to="#" 
                                              className="b-files_link" 
                                              onClick={(e) => downloadFile(e, file.downloadURL, file.name)}>
                                                Download
                                        </Link>
                                        {["application", "image"].some((item) => item === file.type.split("/")[0]) && 
                                            <Link to={file.downloadURL} 
                                                  className="b-files_link" 
                                                  target="_blank">
                                                    Preview
                                            </Link>}
                                        <button className="b-files_remove" 
                                                onClick={() => handleRemoveFile(file, file.downloadURL)}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default FilesList;
