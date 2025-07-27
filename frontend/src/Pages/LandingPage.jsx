import Navbar from "../Components/Navbar";
import Main from "../Components/Main";
import SelectRide from "../Components/SelectRide";
import Services from "../Components/Services";
import Download from "../Components/Download";
import Help from "../Components/Help";
import Footer from "../Components/Footer";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <Navbar />
      <Main />
      {user && user.userRole === "user" && (
        <>
          {" "}
          <SelectRide />
          <Services />
        </>
      )}

      <Download />
      <Help />
      <Footer />
    </>
  );
};

export default LandingPage;
