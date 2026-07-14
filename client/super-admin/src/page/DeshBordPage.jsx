import DashboardInner from "../components/DeshBoardIneer"
import Preloader from "../helper/preloader";
import MasterLayout from "../layout/Masterlayout"

const DashboardPage = () => {
  return (
    <>
      <MasterLayout>
        {/* Preloader */}
        <Preloader />

        {/* DashboardInner */}
        <DashboardInner />
      </MasterLayout>
    </>
  );
};

export default DashboardPage;