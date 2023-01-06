import { Spinner } from "react-bootstrap";
const ProgressIndicator = () => {
    return (
        <div className="d-flex flex-column" style={{height:'100vh'}}>
            <Spinner animation="border" role="status" className="my-3">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <div>Processing, please wait...</div>
        </div>
    );
};
export default ProgressIndicator;