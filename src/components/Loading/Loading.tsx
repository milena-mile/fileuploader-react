import "./loading.scss";

const Loading = () => {
    return (
        <div className="b-loading">
            <img className="b-loading_files" src="images/files.svg" alt="files" />
            <img className="b-loading_load" src="images/loading.svg" alt="loading" />
        </div>
    )
}

export default Loading;