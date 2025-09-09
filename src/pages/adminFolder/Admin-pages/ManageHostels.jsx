
import Sidebar from "../components/Sidebar";
import Topbar from "../components/topbar";
import HostelTable from "../components/HostelTable";
import "../../../styles/admin.css"; 

const hostels = [
  { name: "Hostel A", totalRooms: 30, available: 10, occupied: 20 },
  { name: "Hostel B", totalRooms: 20, available: 5, occupied: 15 },
];

const ManageHostels = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Topbar adminName="Admin" />
      <div className="p-6 admin-section">
        <h2>Manage Hostels</h2>
        <HostelTable hostels={hostels} />
      </div>
    </div>
  </div>
);

export default ManageHostels;

