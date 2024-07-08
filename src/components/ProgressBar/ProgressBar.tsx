import "./progressbar.scss";
import { useProgressContext } from "../../context/progressContext";

const ProgressBar = () => {
    const {progress} = useProgressContext();

    return (
        <div className={`b-progress ${progress === 0 || progress === 100 ? "hide" : ""}`}>
            <div className="b-progress_back"></div>
            <div className="b-progress_info">
                <span className="b-progress_title">Uploading...</span>
                <div className="b-progress_block">
                    <div className="b-progress_bar" style={{width: progress + "%"}}></div>
                </div>
            </div>
        </div>
    )
}

export default ProgressBar;