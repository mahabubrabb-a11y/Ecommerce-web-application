import Preloader from "../helper/preloader";
import MasterLayout from "../layout/Masterlayout"
import DashboardOrder from "../components/DeshBordOrder"
const OrdersPage = () => {
  return (
    <>
      <MasterLayout>
        {/* Preloader */}
        <Preloader />

        {/* DashboardOrder */}
        <DashboardOrder />
      </MasterLayout>
    </>
  );
};

export default OrdersPage;