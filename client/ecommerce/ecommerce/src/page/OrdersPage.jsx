import Preloader from "../helper/Preloader";
import MasterLayout from "../layout/MasterLayout";
import DashboardOrder from "../components/DashboardOrder";
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