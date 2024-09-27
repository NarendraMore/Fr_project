import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import "./Fire.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Calendar } from "primereact/calendar";
const Fire = () => {
  const [fireData, setfireData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedFireImage, setSelectedFireImage] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [endTimestamp, setEndTimestamp] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = "fire";
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/events/${event}`
        );
        console.log(
          "url",
          `${import.meta.env.VITE_APP_API_URL}/events/${event}`
        );
        const data = await response.json();
        setfireData(Array.isArray(data) ? data : []);
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchData();
  }, []);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    resetValues();
  };

  const handleDownload = () => {
    // Ensure startTimestamp and endTimestamp are available
    if (!startTimestamp || !endTimestamp) {
      alert("Please select both start and end timestamps.");
      return;
    }

    // Adjust to local time before formatting to ISO string
    const formattedStartTimestamp = new Date(
      startTimestamp.getTime() - startTimestamp.getTimezoneOffset() * 60000
    ).toISOString();

    const formattedEndTimestamp = new Date(
      endTimestamp.getTime() - endTimestamp.getTimezoneOffset() * 60000
    ).toISOString();

    // Construct the URL for the API call
    const event ='fire';
    const apiUrl = `${
      import.meta.env.VITE_APP_API_URL
    }/event_csv?startTimestamp=${formattedStartTimestamp}&endTimestamp=${formattedEndTimestamp}&event=${event}`;

    // Make the GET request to the API
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.blob(); // If response is a file, get it as a blob
        } else {
          throw new Error("Failed to download report.");
        }
      })
      .then((blob) => {
        // Create a link element to download the file
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Fire report.csv"); // or any file name with extension based on format
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link); // Cleanup after the download
      })
      .catch((error) => {
        console.error("Download error:", error);
      });
      resetValues();
      setDialogVisible(false);
  };

  const onIconClick = async (rowData) => {
    setVisible(true);
    setSelectedFireImage(
      `${import.meta.env.VITE_APP_API_URL}/getImage/${rowData._id}`
    );
  };
  const resetValues = () => {
    setStartTimestamp(null);
    setEndTimestamp(null);
  };
  return (
    <>
      <div className="px-5 mt-3">
        <div className="d-flex">
          <h3 className="justify-content-left">Fire Detection</h3>
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
          <div className="grid-container">
            {/* Start Timestamp */}
            <div className="p-field">
              <label htmlFor="startTimestamp">Start Timestamp</label>
              <Calendar
                id="startTimestamp"
                value={startTimestamp}
                onChange={(e) => setStartTimestamp(e.value)}
                showTime
                showSeconds
                placeholder="Select start timestamp"
                className="custom-calendar"
              />
            </div>

            {/* End Timestamp */}
            <div className="p-field">
              <label htmlFor="endTimestamp">End Timestamp</label>
              <Calendar
                id="endTimestamp"
                value={endTimestamp}
                onChange={(e) => setEndTimestamp(e.value)}
                showTime
                showSeconds
                placeholder="Select end timestamp"
              />
            </div>
          </div>
        </div>
      </Dialog>

      <div className="mt-7 ml-5 mr-5">
        <DataTable
          value={fireData}
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
            className="imageButton"
            header="Action"
            body={(rowData) => (
              <Button
                icon="pi pi-image"
                className="p-button-text "
                onClick={() => onIconClick(rowData)}
              />
            )}
          />
        </DataTable>
      </div>
      <Dialog
        header="Fire Detection"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        {selectedFireImage ? (
          <img
            src={selectedFireImage}
            alt="Preview"
            style={{ width: "100%", height: "400px" }}
          />
        ) : (
          <p>Loading image...</p>
        )}
      </Dialog>
    </>
  );
};

export default Fire;
