import ProgressBar from '../ProgressBar/ProgressBar';
import uploadFiles from '../../services/asyncThunks/uploadFiles';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useProgressContext } from '../../context/progressContext';
import { FilesDispatch } from '../../store/store';
import './uploader.scss';

const Uploader = () => {
	const { setProgress } = useProgressContext();

	const [dragging, setDragging] = useState(false);
	const [message, setMessage] = useState<string[]>([]);
	const [errorMessage, setErrorMessage] = useState<string[]>([]);
	const [uploaded, setUploaded] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch<FilesDispatch>();

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
		const files = e.dataTransfer.files;
		for (let i = 0; i < Object.keys(files).length; i++) {
			handleAdd(files[i]);
		}
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files)	{
			const files = e.target.files;
			for (let i = 0; i < Object.keys(files).length; i++) {
				handleAdd(files[i]);
			}
		}
	};
	
	const handleAdd = async (file: File) => {
		setMessage([]);
		setErrorMessage([]);
		setUploaded(false);

		try {
            await dispatch(uploadFiles({ file, setProgress })).unwrap();
			setMessage((prevState: string[]) => [
				...prevState,
				`File "${file.name}" successfully uploaded.`
			])

        } catch (error) {
            if (error instanceof Error && error.message === "Upload failed") {
				setErrorMessage((prevState: string[]) => [
					...prevState,
					`File "${file.name}" already exists.`
				]);
			} else {
				setErrorMessage(["Something get wrong."]);
			}

        } finally {
			setUploaded(true);
		}
	};

	useEffect(() => {
        if (uploaded && errorMessage.length === 0) {
            navigate("/list");
        }
    }, [uploaded, errorMessage]);

	return (
		<div className="b-uploader">
			<h1 className="b-uploader_title">File Uploader</h1>
			<section className="b-uploader_info">
				<div
					className={`b-uploader_image ${dragging ? "dragging" : ""}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img src="images/upload-cloud.svg" alt="Upload here" />
				</div>
				<span className="b-uploader_info-title">Start by uploading a file</span>
				<span className="b-uploader_info-text">Any assets used in projects will live here.<br />Start creating by uploading your files.</span>
				<label className="b-uploader_button button-link--dark">
					<img src="images/upload-icon.svg" alt="upload icon" />
					Upload
					<input type="file" multiple onChange={(e) => handleInput(e)} />
				</label>
				<ProgressBar/>
			</section>
			<div className="b-uploader_messages">
				{errorMessage.length !== 0 && 
					<div className="b-uploader_message--error">{errorMessage.map((item, i) => {
						return(
							<span key={i}>{item}</span>
						)
					})}
					</div>}
				{message.length !== 0 &&
					<div className="b-uploader_message">{message.map((item, i) => {
							return(
								<span key={i}>{item}</span>
							)
						})}
					</div>}
				{errorMessage.length !== 0 &&
					<div className='b-uploader_list-link'>
						<Link to="/list" className="button-link">Files List</Link>
					</div>
				}
			</div>
		</div>
	);
};

export default Uploader;
