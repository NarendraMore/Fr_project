import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import "./Weapon.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

const Fight = () => {
  const [weaponData, setweaponData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [endTimestamp, setEndTimestamp] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchFightData = async () => {
      try {
        const event = "weapon";
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/events/${event}`
        );
        const data = await response.json();
        console.log("latest data ", data); // Check the structure of the data
        setweaponData(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fight data:", error);
        setLoading(false);
      }
    };

    fetchFightData();
  }, []);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  // const handleDownload = () => {
  //   console.log("Download report...");
  //   hideDialog();
  // };
  const onIconClick = (rowData) => {
    setSelectedImage(rowData.imageUrl); // Set image to be shown
    setVisible(true); // Open dialog
  };
  const handleDownload = () => {
    // Ensure startTimestamp and endTimestamp are available
    if (!startTimestamp || !endTimestamp) {
      alert("Please select both start and end timestamps.");
      return;
    }

    // Construct the timestamp in ISO format (without any unwanted encoding)
    const formattedStartTimestamp = startTimestamp.toISOString();
    const formattedEndTimestamp = endTimestamp.toISOString();

    // Construct the URL for the API call
    const apiUrl = `${import.meta.env.VITE_APP_API_URL}/event_csv?startTimestamp=${formattedStartTimestamp}&endTimestamp=${formattedEndTimestamp}`;

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
        link.setAttribute("download", "report.csv"); // or any file name with extension based on format
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link); // Cleanup after the download
      })
      .catch((error) => {
        console.error("Download error:", error);
      });
  };

  return (
    <>
      <div className="px-5 mt-3">
        <div className="d-flex">
          <h3 className="justify-content-left">Weapon Detection</h3>
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
            {/* Dropdown for selecting report format */}
            {/* <div className="p-field">
              <label htmlFor="reportFormat">Select Report Format</label>
              <Dropdown
                id="reportFormat"
                value={selectedFormat}
                options={[
                  { label: "PDF", value: "PDF" },
                  { label: "CSV", value: "CSV" },
                  { label: "Excel", value: "Excel" },
                ]}
                onChange={(e) => setSelectedFormat(e.value)}
                placeholder="Select a format"
              />
            </div> */}

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

            {/* Weapon Field (static value) */}
            {/* <div className="p-field">
              <label htmlFor="weapon">Weapon</label>
              <InputText id="weapon" value="Weapon" readOnly />
            </div> */}
          </div>
        </div>
      </Dialog>

      <div className="mt-7 ml-5 mr-5">
        <DataTable
          value={weaponData} // Data from API
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
