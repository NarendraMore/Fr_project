import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import "./Fight.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const Fight = () => {
  const [fightData, setfightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchFightData = async () => {
      try {
        const event = "fighting";
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/events/${event}`
        );
        const data = await response.json();
        console.log("event data", data);
        setfightData(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fight data:", error);
        setLoading(false); // In case of an error, stop loading
      }
    };

    fetchFightData(); // Call the function to fetch the data
  }, []); // Empty dependency array ensures it runs once when component mounts

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const handleDownload = () => {
    console.log("Download report...");
    hideDialog();
  };
  const onIconClick = (rowData) => {
    setSelectedImage(rowData.imageUrl); // Set image to be shown
    setVisible(true); // Open dialog
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
            <Button
              label="Cancel"
              className="cancelButton2"
              icon="pi pi-times"
              onClick={hideDialog}
            />
            <Button
              className="downloadButton2"
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
          value={fightData} // Data from API
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
          <Column
            field="empid"
            header="Sr.No"
            body={(rowData, options) => options.rowIndex + 1} // Dynamic serial number
          />
          <Column field="event" header="Event" />
          <Column field="date" header="Date" />
          <Column field="time" header="Time" />
          <Column field="cameratype" header="Camera" />
          <Column field="location" header="Location" />
          <Column
            header="Action"
            body={(rowData) => (
              <Button
                icon="pi pi-image"
                className="p-button-text"
                onClick={() => onIconClick(rowData)}
              />
            )}
          />
        </DataTable>
      </div>
      <Dialog
        header="Image Preview"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        {selectedImage && (
          <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />
        )}{" "}
      </Dialog>
    </>
  );
};

export default Fight;
