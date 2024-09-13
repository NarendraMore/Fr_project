import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import "./Fight.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const Fight = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Existing useEffect for fetching data

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleDownload = () => {
    // Handle the download logic here
    console.log("Download report...");
    hideDialog();
  };

  return (
    <>
      <div className="px-5 mt-3">
        <div className="d-flex">
          <h3 className="justify-content-left">Fight Detection</h3>
        </div>
        <hr />
        <Button className="btn btn-success addCategory" onClick={showDialog}>
          <i className="bi bi-download"></i>&nbsp; Download Report
        </Button>
      </div>

      {/* Dialog for download form */}
      <Dialog
        header="Download Report"
        visible={dialogVisible}
        onHide={hideDialog}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} />
            <Button
              label="Download"
              icon="pi pi-check"
              onClick={handleDownload}
            />
          </div>
        }
        style={{ width: "90vw", maxWidth: "600px" }} // Adjust width as needed
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="reportFormat">Select Report Format</label>
            <InputText id="reportFormat" placeholder="e.g., PDF, CSV" />
          </div>
        </div>
      </Dialog>

      <div className="mt-7 ml-5 mr-5">
        <DataTable
          value={attendanceData}
          loading={loading}
          tableStyle={{ width: "100%" }}
          scrollable
          scrollHeight="400px" // Adjust as needed
          style={{ borderRadius: "2px", border: "1px solid #3d3d3d" }}
          size={"small"}
          showGridlines
          paginator
          rows={8}
          dataKey="id"
          rowHover
          className="custom-data-table"
        >
          <Column field="empid" header="Employee ID" />
          <Column field="name" header="Employee Name" />
          <Column field="date" header="Date" />
          <Column field="intime" header="Check-in" />
          <Column field="outtime" header="Check-out" />
          <Column field="breaktime" header="Break Time" />
          <Column field="totaltime" header="Total Time" />
        </DataTable>
      </div>
    </>
  );
};

export default Fight;
