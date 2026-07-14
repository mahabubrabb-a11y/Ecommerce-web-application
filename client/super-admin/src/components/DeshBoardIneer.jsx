import { useEffect } from "react";
import dashboardStore from "../store/dashBoardStore"

const DashboardInner = () => {
  let { dashboardRequest, dashboard } = dashboardStore();

  useEffect(() => {
    (async () => {
      await dashboardRequest();
    })();
  }, [dashboardRequest]);

  console.log(dashboard);

  return (
    <section className='p-5'>
      <div className='row g-4'>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Users</h6>
              <h2 className='number fw-bold mb-1'>{dashboard?.totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Products</h6>
              <h2 className='number fw-bold mb-1'>
                {dashboard?.totalProducts}
              </h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Categories</h6>
              <h2 className='number fw-bold mb-1'>
                {dashboard?.totalCategories}
              </h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Brands</h6>
              <h2 className='number fw-bold mb-1'>{dashboard?.totalBrands}</h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Orders</h6>
              <h2 className='number fw-bold mb-1'>{dashboard?.totalOrders}</h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Income</h6>
              <h2 className='number fw-bold mb-1'>{dashboard?.totalIncome}</h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Pending Deliver</h6>
              <h2 className='number fw-bold mb-1'>
                {dashboard?.pendingDeliver}
              </h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Delivered Orders</h6>
              <h2 className='number fw-bold mb-1'>
                {dashboard?.deliveredOrders}
              </h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total canceled Orders</h6>
              <h2 className='number fw-bold mb-1'>
                {dashboard?.canceledOrders}
              </h2>
            </div>
          </div>
        </div>
        <div className='col-xxl-3 col-xl-4 col-md-6'>
          <div className='card user-card shadow-sm border-0 p-3'>
            <div className='card-body text-center'>
              <h6 className='text-secondary mb-2'>Total Reviews</h6>
              <h2 className='number fw-bold mb-1'>{dashboard?.totalReviews}</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardInner;
