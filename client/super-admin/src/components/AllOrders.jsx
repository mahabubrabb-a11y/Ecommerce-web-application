import { useNavigate, useSearchParams } from "react-router-dom";
import Paginate from "../helper/Paginate";
import { ToWords } from "to-words";
import { useCallback, useEffect, useRef, useState } from "react";
import invoiceStore from "../store/invoiceStore";
import Skeleton from "react-loading-skeleton";
import { ErrorToast, formatDate } from "../helper/Helper";
import { baseURL } from "../helper/config";
import { useReactToPrint } from "react-to-print";

const AllOrders = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const per_page = 6;
  const page_no = searchParams.get("page_no") || 1;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  let {
    allOrderListRequest,
    totalAllOrderList,
    allOrderList,
    readSingleInvoiceSingleUser,
    singleInvoiceSingleUserRequest,
    updateInvoiceRequest,
  } = invoiceStore();

  useEffect(() => {
    (async () => {
      await allOrderListRequest(per_page, page_no, fromDate, toDate);
    })();
  }, [allOrderListRequest, fromDate, page_no, toDate]);

  //! pagination function
  const handelPageClick = async (event) => {
    let page_no = event.selected;
    await allOrderListRequest(per_page, page_no + 1, fromDate, toDate);

    navigate(`/all-orders?page_no=${page_no + 1}`);
  };

  const handleDownload = () => {
    try {
      let url = baseURL + "/export-csv";
      // If user gives dates, add them as query
      if (fromDate && toDate) {
        url += `?from=${fromDate}&to=${toDate}`;
      }
      // 📥 Open link (it will download automatically)
      window.open(url, "_self");
    } catch (error) {
      console.log(error);
      ErrorToast("Something went wrong!");
    }
  };

  let viewOrder = (id) => {
    singleInvoiceSingleUserRequest(id);
  };

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Taka",
        plural: "Taka",
        symbol: "Tk.",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paisa",
          symbol: "",
        },
      },
    },
  });

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);
  const componentRef = useRef(null);
  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "AwesomeFileName",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
    copyStyles: true, // 👈 copies styles from your app into print iframe
    pageStyle: `
    @page {
      size: A4;
      margin: 4mm;
    }
    body {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      font-family: Arial, sans-serif;
      padding: 0px;
    }
    table {
      border-collapse: collapse !important;
      width: 100%;
    }
    th, td {
      border: 1px solid #ccc !important;
      padding: 6px !important;
    }
  `,
  });

  // update invoice
  let updateInvoice = async (_id, user_id, deliver_status) => {
    let res = await updateInvoiceRequest({ _id, user_id, deliver_status });
    if (res) {
      await allOrderListRequest(per_page, page_no, fromDate, toDate);
    }
  };

  return (
    <div className='dashboard-body__content'>
      {/* ========================= Statement section start =========================== */}
      <div className='card shadow-sm p-3 mb-4'>
        <div className='row g-3 align-items-end'>
          <div className='col-md-3'>
            <label className='form-label fw-semibold'>From Date</label>
            <input
              type='date'
              className='form-control'
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className='col-md-3'>
            <label className='form-label fw-semibold'>To Date</label>
            <input
              type='date'
              className='form-control'
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className='col-md-3 text-center'>
            <button
              onClick={handleDownload}
              className='btn d-block btn-primary px-4 mt-2'
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>
      <div className='row gy-4'>
        <div className='col-12'>
          <div className='card common-card border border-gray-five'>
            <div className='card-body'>
              <div className='table-responsive'>
                <table className='table text-body mt--24'>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer name</th>
                      <th>Order ID</th>
                      <th>Payment status</th>
                      <th>Deliver status</th>
                      <th>Deliver Action</th>
                      <th>Total Payable</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* ✅ ফিক্সড: সরাসরি <p> এর বদলে <tr><td> ব্যবহার করা হয়েছে */}
                    {allOrderList !== null && allOrderList?.length < 1 && (
                      <tr>
                        <td colSpan="8" className="text-center text-danger fw-bold py-3">
                          No data found!
                        </td>
                      </tr>
                    )}

                    {allOrderList === null ? (
                      // ✅ ফিক্সড: ডুপ্লিকেট ফ্র্যাগমেন্ট রিমুভড এবং লুপে ইউনিক key অ্যাড করা হয়েছে
                      [...Array(6)].map((_, idx) => (
                        <tr key={`skeleton-${idx}`} className='super_admin_all-product'>
                          <td className='Skeleton'><Skeleton count={1} /></td>
                          <td className='Skeleton'><Skeleton count={1} /></td>
                          <td className='Skeleton'><Skeleton count={1} /></td>
                          <td className='Skeleton'><Skeleton count={1} /></td>
                          <td className='Skeleton'><Skeleton count={1} /></td>
                          <td className='Skeleton'><Skeleton count={1} /></td>
                          <td className='Skeleton'><Skeleton count={1} /></td>
                          <td className='Skeleton'><Skeleton count={1} /></td>
                        </tr>
                      ))
                    ) : (
                      allOrderList?.map((item, index) => (
                        // ✅ ফিক্সড: ডাটা লুপের ক্ষেত্রে item._id বা index কে key হিসেবে ব্যবহার করা হয়েছে
                        <tr key={item?._id || index}>
                          <td>{formatDate(item?.createdAt)}</td>
                          <td>{item?.cus_details?.[0]?.Name || "N/A"}</td>
                          <td><span>{item?._id}</span></td>
                          <td>
                            <span
                              className={`badge text-capitalize rounded-pill ${
                                item?.payment_status === "success"
                                  ? "bg-success"
                                  : item?.payment_status === "pending"
                                  ? "bg-warning"
                                  : "bg-danger"
                              }`}
                            >
                              {item?.payment_status}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge text-capitalize rounded-pill ${
                                item?.deliver_status === "delivered"
                                  ? "bg-success"
                                  : item?.deliver_status === "pending"
                                  ? "bg-warning"
                                  : "bg-danger"
                              }`}
                            >
                              {item?.deliver_status}
                            </span>
                          </td>
                          <td>
                            <button className="border-0 bg-transparent">
                              <select
                                onChange={(e) =>
                                  updateInvoice(
                                    item?._id,
                                    item?.user_id,
                                    e.target.value
                                  )
                                }
                                className='common-input border custom'
                                defaultValue={item?.deliver_status}
                              >
                                <option value={"pending"}>Pending</option>
                                <option value={"delivered"}>Delivered</option>
                                <option value={"cancel"}>Cancel</option>
                              </select>
                            </button>
                          </td>
                          <td><p className="mb-0">{item?.payable} Tk.</p></td>
                          <td>
                            <button
                              className='btn btn-success btn-sm'
                              data-bs-toggle='modal'
                              data-bs-target={`#exampleModal_1`}
                              onClick={() => viewOrder(item?._id)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className='flx-between justify-content-end gap-2'>
                <nav aria-label='Page navigation example'>
                  <div>
                    {allOrderList?.length > 0 && (
                      <Paginate
                        handelPageClick={handelPageClick}
                        page_no={page_no}
                        per_page={per_page}
                        totalCount={totalAllOrderList}
                      />
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ========================= Statement section End =========================== */}

      {/* Invoice Modal */}
      <div
        className='modal fade order_item'
        id={`exampleModal_1`}
        tabIndex={-1}
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h6 className='modal-title fs-5' id='exampleModalLabel'>
                Super Admin Invoice View
              </h6>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              />
            </div>
            <div className='modal-body'>
              <div className='profile'>
                <div className='row gy-4'>
                  <div className='col-12'>
                    <div className='container my-3'>
                      <div className='p-5 bg-white border' ref={componentRef}>
                        {/* Header */}
                        <div className='row mb-4 border-bottom pb-3'>
                          <div className='col-sm-6'>
                            <h2 className='fw-bold'>INVOICE</h2>
                            <p className='mb-0'>#INV no: {readSingleInvoiceSingleUser?._id}</p>
                            <p className='mb-0'>#TRA no: {readSingleInvoiceSingleUser?.tran_id}</p>
                            <small>Date: {formatDate(readSingleInvoiceSingleUser?.createdAt)}</small>
                          </div>
                          <div className='col-sm-6 text-end'>
                            <h5 className='fw-bold'>PixBO</h5>
                            <p className='mb-0'>123 Street, Chittagong</p>
                            <p className='mb-0'>support@pixbo.com</p>
                            <p className='mb-0'>+880 1234 567 890</p>
                          </div>
                        </div>

                        {/* Billing Details */}
                        <div className='row mb-4'>
                          <div className='col-sm-6'>
                            <h6 className='fw-bold'>Bill To:</h6>
                            <p className='mb-0'>{readSingleInvoiceSingleUser?.cus_details?.[0]?.Name}</p>
                            <p className='mb-0'>{readSingleInvoiceSingleUser?.cus_details?.[0]?.Email}</p>
                            <p className='mb-0'>{readSingleInvoiceSingleUser?.cus_details?.[0]?.Phone}</p>
                            <p className='mb-0'>{readSingleInvoiceSingleUser?.cus_details?.[0]?.Address}</p>
                          </div>
                          <div className='col-sm-6 text-end'>
                            <h6 className='fw-bold'>Payment information:</h6>
                            <p className='mb-1'>
                              Payment Status:{" "}
                              <span
                                className={`fw-bold text-capitalize ${
                                  readSingleInvoiceSingleUser?.payment_status === "success"
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {readSingleInvoiceSingleUser?.payment_status}
                              </span>
                            </p>
                            <p className='mb-1'>
                              Deliver Status:{" "}
                              <span
                                className={`fw-bold text-capitalize ${
                                  readSingleInvoiceSingleUser?.deliver_status === "delivered"
                                    ? "text-success"
                                    : readSingleInvoiceSingleUser?.deliver_status === "pending"
                                    ? "text-warning"
                                    : "text-danger"
                                }`}
                              >
                                {readSingleInvoiceSingleUser?.deliver_status}
                              </span>
                            </p>
                            <p className='mb-0'>
                              Total payable:{" "}
                              <span className='fw-bold text-uppercase'>
                                {readSingleInvoiceSingleUser?.payable} tk.
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Table */}
                        <div className='table-responsive invoice mb-4'>
                          <table className='table align-middle'>
                            <thead className='table-light'>
                              <tr>
                                <th>Product</th>
                                <th className='text-center'>Color</th>
                                <th className='text-center'>Size</th>
                                <th className='text-center'>Quantity</th>
                                <th className='text-center'>Price</th>
                                <th className='text-end'>Total</th>
                              </tr>
                            </thead>
                            <tbody className='text-dark'>
                              {readSingleInvoiceSingleUser?.invoiceProducts?.map((item, index) => (
                                <tr key={`prod-${index}`}>
                                  <td className='text-start'>{item?.product_name}</td>
                                  <td className='text-center'>{item?.color}</td>
                                  <td className='text-center'>{item?.size}</td>
                                  <td className='text-center'>{item?.qty}</td>
                                  <td className='text-center'>{item?.price} Tk.</td>
                                  <td className='text-end'>{item?.qty * item?.price} Tk.</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary */}
                        <div className='row justify-content-end'>
                          <div className='col-8'>
                            <p className='text-danger small fst-italic'>
                              {toWords.convert(Number(readSingleInvoiceSingleUser?.payable || 0))}
                            </p>
                          </div>
                          <div className='col-4'>
                            <ul className='list-unstyled'>
                              <li className='d-flex justify-content-between mb-2'>
                                <span>Subtotal:</span>
                                <span>{readSingleInvoiceSingleUser?.total} Tk.</span>
                              </li>
                              <li className='d-flex justify-content-between mb-2'>
                                <span>Vat (15%):</span>
                                <span>{readSingleInvoiceSingleUser?.vat} Tk.</span>
                              </li>
                              <li className='d-flex justify-content-between mb-2'>
                                <span>Shipping cost:</span>
                                <span>75 Tk.</span>
                              </li>
                              <li className='d-flex justify-content-between border-top pt-2 fw-bold'>
                                <span>Total:</span>
                                <span>{readSingleInvoiceSingleUser?.payable} Tk.</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className='text-center mt-5 text-muted small'>
                          <p className='mb-1'>Thank you for your purchase!</p>
                          <p>This invoice was generated electronically and is valid without a signature.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                Close
              </button>
              <button onClick={printFn} type='button' className='btn btn-primary'>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
