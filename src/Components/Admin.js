import "../Components/Admin.css";
export function Admin() {
  return (
    <>
      <div className="admin-page">
        <div className="admin-page-wrapper">
          <div className="admin-header">
            <div className="admin-title">Admin DashBoard</div>
          </div>
          <div className="admin-sidebar">
            <div className="admin-task-box">
                <div className="list-company-name">Hussme</div>
                <div className="list-company-task-title">Summer Offer</div>
                <button className='list-company-button'> View</button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
