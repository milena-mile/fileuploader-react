import { Link } from "react-router-dom";
import "./notFound.scss";

const NotFound = () => {
    return (
        <div className="b-notfound">
            <img src="images/not-found.svg" className="b-notfound_image" alt="not found" />
            <span className="b-notfound_text">404 Page Not Found</span>
            <div className="b-notfound_links">
                <Link to="/" className="button-link--dark">Upload</Link>
                <Link to="list" className="button-link--dark">File List</Link>
            </div>
        </div>
    )
}

export default NotFound;