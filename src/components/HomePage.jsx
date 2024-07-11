import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import ckt_logo from "../assets/ckt_logo.png";
import infotess_logo from "../assets/infotess_logo.png";

function HomePage() {
  const navigate = useNavigate();

  const handleLoginNavigation = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center m-auto  w-[600px] h-[600px]">
      <h2 className="text-center text-3xl font-bold text-blue-950 uppercase">
        Welcome to INFOTESS ELECTIONS SYSTEM
      </h2>
      <div className="logos flex space-x-2 h-[200px] w-[200px] items-center justify-between">
        <img src={ckt_logo} className=" h-[120px]" alt="" />
        <img src={infotess_logo} className=" h-[100px]" />
      </div>
      <Button
        type="primary"
        className="w-52 uppercase font-bold"
        onClick={handleLoginNavigation}
      >
        HOD Login
      </Button>
    </div>
  );
}

export default HomePage;
