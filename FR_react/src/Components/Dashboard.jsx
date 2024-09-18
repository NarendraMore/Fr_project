import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/logo.png";
import "./Dashboard.css";

// NotificationComponent
// const NotificationComponent = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0); // Maintain notification count

//   useEffect(() => {
//     // WebSocket connection
//     const socket = new WebSocket("ws://localhost:8001");

//     socket.onopen = () => {
//       console.log("Connected to WebSocket server");
//     };

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("Notification received:", data);
//       setNotifications((prev) => [...prev, data]);
//       setNotificationCount((prevCount) => prevCount + 1); // Update count
//     };

//     socket.onerror = (error) => {
//       console.log("WebSocket error:", error);
//     };

//     // Fetch latest event from API when the component mounts
//     const fetchLatestEvent = async () => {
//       try {
//         const response = await fetch("http://192.168.1.10:8001/latest-event");
//         if (response.ok) {
//           const latestEvent = await response.json();
//           console.log("Latest event:", latestEvent);
//           // Optionally add it to notifications
//           setNotifications((prev) => [latestEvent, ...prev]);
//           setNotificationCount((prevCount) => prevCount + 1);
//         } else {
//           console.error("Failed to fetch latest event:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching latest event:", error);
//       }
//     };

//     fetchLatestEvent();

//     return () => {
//       socket.close();
//     };
//   }, []);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//     if (!isOpen) {
//       setNotificationCount(0); // Reset count when dropdown is opened
//     }
//   };

//   return (
//     <div className="notification-container" style={{ position: "relative" }}>
//       {/* Notification Icon */}
//       <button
//         className="btn btn-link text-white"
//         onClick={toggleDropdown}
//         style={{ position: "relative" }}
//       >
//         <i className="bi bi-bell" style={{ fontSize: "1.5rem" }}></i>
//         {/* Notification count badge */}
//         {notificationCount > 0 && (
//           <span
//             className="badge bg-danger"
//             style={{
//               position: "absolute",
//               top: "0",
//               right: "0",
//               borderRadius: "50%",
//             }}
//           >
//             {notificationCount}
//           </span>
//         )}
//       </button>

//       {/* Notification Dropdown */}
//       {isOpen && (
//         <div
//           className="notification-dropdown bg-dark text-white p-2"
//           style={{
//             position: "absolute",
//             top: "2rem",
//             right: "0",
//             width: "300px",
//             maxHeight: "300px",
//             overflowY: "auto",
//             borderRadius: "5px",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//           }}
//         >
//           <h6>Notifications</h6>
//           <ul className="list-unstyled">
//             {notifications.length > 0 ? (
//               notifications.map((notification, index) => (
//                 <li key={index} className="p-1 border-bottom">
//                   {notification.event} -{" "}
//                   {new Date(notification.timestamp).toLocaleTimeString()}
//                 </li>
//               ))
//             ) : (
//               <li className="text-muted">No notifications</li>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };
const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [uncheckedCount, setUncheckedCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(savedNotifications);
    setUncheckedCount(savedNotifications.filter((n) => !n.checked).length);
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8001");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Notification received:", data);

      const newNotification = {
        ...data,
        checked: false,
      };

      setNotifications((prev) => {
        const updatedNotifications = [...prev, newNotification];
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });

      setUncheckedCount((prevCount) => prevCount + 1);
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    const fetchLatestEvent = async () => {
      try {
        // const apiUrl = process.env.REACT_APP_API_URL; 
        // console.log('api url',apiUrl);
        const response = await fetch(`http://192.168.1.10:8001/latest-event`);
        console.log('response',response);
        if (response.ok) {
          const latestEvent = await response.json();
          console.log("Latest event:", latestEvent);

          const newNotification = {
            ...latestEvent,
            checked: false,
          };

          setNotifications((prev) => {
            const updatedNotifications = [newNotification, ...prev];
            localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
            return updatedNotifications;
          });

          setUncheckedCount((prevCount) => prevCount + 1);
        } else {
          console.error("Failed to fetch latest event:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching latest event:", error);
      }
    };

    fetchLatestEvent();

    return () => {
      socket.close();
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (index) => {
    const clickedNotification = notifications[index];
    setSelectedNotification(clickedNotification);

    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    if (!clickedNotification.checked) {
      setUncheckedCount((prevCount) => prevCount - 1);
    }
  };

  const closePreview = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="notification-container" style={{ position: "relative" }}>
      <button
        className="btn btn-link text-white"
        onClick={toggleDropdown}
        style={{ position: "relative" }}
      >
        <i className="bi bi-bell" style={{ fontSize: "1.5rem" }}></i>
        {uncheckedCount > 0 && (
          <span
            className="badge bg-danger"
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              borderRadius: "50%",
            }}
          >
            {uncheckedCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="notification-dropdown bg-dark text-white p-2"
          style={{
            position: "absolute",
            top: "2rem",
            right: "0",
            width: "300px",
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h6>Notifications</h6>
          <ul className="list-unstyled">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li
                  key={index}
                  className={`p-1 border-bottom ${notification.checked ? "text-muted" : ""}`}
                  onClick={() => handleNotificationClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  {notification.event} -{" "}
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </li>
              ))
            ) : (
              <li className="text-muted">No notifications</li>
            )}
          </ul>
        </div>
      )}

      {selectedNotification && (
        <div
          className="notification-preview bg-light text-dark p-3"
          style={{
            position: "fixed",
            top: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5>Notification Preview</h5>
            <button
              onClick={closePreview}
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              <i className="bi bi-x" style={{ fontSize: "1.25rem", color: "black" }}></i>
            </button>
          </div>
          <p>{selectedNotification.event}</p>
          <p>{new Date(selectedNotification.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};



// Dashboard component
// const Dashboard = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     navigate("/");
//   };

//   return (
//     <div className="container-fluid" style={{ overflow: "hidden" }}>
//       <div className="row flex-nowrap">
//         <div className="col-auto col-md-3 col-xl-2 px-sm-1 px-0 bg-dark">
//           <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 sticky-top">
//             <Link
//               to="/dashboard"
//               className="d-flex align-items-center pb-1 mb-md-1 mt-md-2 me-md-auto text-white text-decoration-none align-middle"
//             >
//               <img src={logo} alt="profile" className="logo-img" />
//               <span className="fs-6 fw-bolder d-none d-sm-inline align-items-sm-start mb-4">
//                 Anemoi Technologies
//               </span>
//             </Link>
//             <ul
//               className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
//               id="menu"
//             >
//               <li className="w-100">
//                 <Link
//                   to="/dashboard"
//                   className="nav-link text-white px-0 align-middle"
//                 >
//                   <i className="fs-4 bi-speedometer2 ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">Dashboard</span>
//                 </Link>
//               </li>
//               <li className="w-100">
//                 <Link
//                   to="/dashboard/employee"
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-people ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">
//                     Manage Employees
//                   </span>
//                 </Link>
//               </li>
//               <li className="w-100">
//                 <Link
//                   to="/dashboard/visiter"
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-person-fill-add ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">
//                     Manage Visitor
//                   </span>
//                 </Link>
//               </li>
//               <li className="w-100">
//                 <Link
//                   to="/dashboard/category"
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-clipboard2-data ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">
//                     Attendance Report
//                   </span>
//                 </Link>
//               </li>
//               <li className="w-100">
//                 <Link
//                   to="/dashboard/category"
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-clipboard2-data ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">
//                     Public Safety
//                   </span>
//                 </Link>
//               </li>
//               <li className="w-100" onClick={handleLogout}>
//                 <Link
//                   to="/dashboard"
//                   className="nav-link px-0 align-middle text-white"
//                 >
//                   <i className="fs-4 bi-power ms-2"></i>
//                   <span className="ms-2 d-none d-sm-inline">Logout</span>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//         <div className="col p-0 m-0">
//           <div
//             className="p-2 d-flex justify-content-between align-items-center bg-dark text-white sticky-top projectTitle"
//             style={{ position: "relative" }}
//           >
//             <h4
//               style={{
//                 position: "absolute",
//                 left: "50%",
//                 transform: "translateX(-50%)",
//               }}
//             >
//               Employee Attendance System
//             </h4>
//             <div className="notification" style={{ marginLeft: "auto" }}>
//               <NotificationComponent />
//             </div>
//           </div>

//           <div className="OutletDiv">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
const Dashboard = () => {
  const [isPublicSafetyOpen, setIsPublicSafetyOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const togglePublicSafety = () => {
    setIsPublicSafetyOpen(!isPublicSafetyOpen);
  };

  return (
    <div className="container-fluid" style={{ overflow: "hidden" }}>
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-1 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 sticky-top">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-1 mb-4 md-1 mt-md-1 me-md-auto text-white text-decoration-none align-middle"
            >
              <img src={logo} alt="profile" className="logo-img mt-1" />
              <span className="fs-6 fw-bolder d-none d-sm-inline align-items-sm-start nav-link-custom">
                Anemoi Tech
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline navName">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/employee"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline navName">
                    Manage Employees
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/visiter"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-person-fill-add ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline navName">
                    Manage Visitor
                  </span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/category"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-clipboard2-data ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline navName">
                    Attendance Report
                  </span>
                </Link>
              </li>
              <div className="w-100">
                <button
                  className="nav-link px-0 align-middle text-white"
                  onClick={togglePublicSafety}
                >
                  <i className="fs-4 bi-shield-check ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline navName">Public Safety</span>
                </button>
                {isPublicSafetyOpen && (
                 <ul className="nav flex-column ms-2">
                 <li className="nav-item">
                   <Link
                     to="/dashboard/weapon"
                     className="nav-link text-white nav-link-custom"
                   >
                     Weapon Detection
                   </Link>
                 </li>
                 <li className="nav-item">
                   <Link
                     to="/dashboard/fight"
                     className="nav-link text-white nav-link-custom"
                   >
                     Fight Detection
                   </Link>
                 </li>
                 <li className="nav-item">
                   <Link
                     to="/dashboard/fire"
                     className="nav-link text-white nav-link-custom"
                   >
                     Fire Detection
                   </Link>
                 </li>
               </ul>
               
                )}
              </div>
              <li className="w-100" onClick={handleLogout}>
                <Link
                  to="/dashboard"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline navName">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div
            className="p-2 d-flex justify-content-between align-items-center bg-dark text-white sticky-top projectTitle"
            style={{ position: "relative" }}
          >
            <h4
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              className="nav-link-custom"
            >
              Employee Attendance System
            </h4>
            <div className="notification" style={{ marginLeft: "auto" }}>
              <NotificationComponent />
            </div>
          </div>

          <div className="OutletDiv">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;