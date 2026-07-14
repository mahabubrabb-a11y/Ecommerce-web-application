import { useCallback, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToWords } from "to-words";
import Paginate from "../helper/Paginate";
import invoiceStore from "../store/invoiceStore";
import { formatDate } from "../helper/helper";

const DashboardOrder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const per_page = 6;
  const page_no = searchParams.get("page_no") || 1;
  let {
    readAllInvoiceSingleUser,
    allInvoiceSingleUserRequest,
    readSingleInvoiceSingleUser,
    singleInvoiceSingleUserRequest,
    totalInvoiceSingleUser,
  } = invoiceStore();

  useEffect(() => {
    (async () => {
      await allInvoiceSingleUserRequest(per_page, page_no);
    })();
  }, [allInvoiceSingleUserRequest, page_no]);

  const componentRef = useRef(null);

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  let viewOrder = (id) => {
    singleInvoiceSingleUserRequest(id);
  };

  //! pagination function
  const handelPageClick = async (event) => {
    let page_no = event.selected;
    await allInvoiceSingleUserRequest(per_page, page_no + 1);

    navigate(`/dashboard-all-orders?page_no=${page_no + 1}`);
  };

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

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
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

  return (
    <div className='dashboard-body__content'>
      {/* ========================= Statement section start =========================== */}
      <div className='row gy-4'>
        <div className='col-12'>
          <div className='card common-card border border-gray-five'>
            <div className='card-body'>
              <div className='table-responsive'>
                <table className='table text-body mt--24'>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transaction ID</th>
                      <th>Order ID</th>
                      <th>Deliver status</th>
                      <th>Payment status</th>
                      <th>Total Payable</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readAllInvoiceSingleUser?.length < 1 && (
                      <p>No data found!</p>
                    )}

                    {readAllInvoiceSingleUser?.map((item, index) => (
                      <tr key={index}>
                        <td>{formatDate(item?.createdAt)}</td>
                        <td>{item?.tran_id}</td>
                        <td>
                          <span>{item?._id}</span>
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
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
                          <span
                            className={`badge rounded-pill ${
                              item?.payment_status === "success"
                                ? "bg-success"
                                : item?.payment_status === "pending"
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            {item?.payment_status}
                          </span>{" "}
                        </td>
                        <td>
                          <p> {item?.payable}</p>
                        </td>
                        <td>
                          <button
                            onClick={() => viewOrder(item?._id)}
                            className='btn btn-success'
                            data-bs-toggle='modal'
                            data-bs-target={`#exampleModal_1`}
                          >
                            View order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='flx-between justify-content-end gap-2'>
                <nav aria-label='Page navigation example'>
                  <Paginate
                    handelPageClick={handelPageClick}
                    page_no={page_no}
                    per_page={per_page}
                    totalCount={totalInvoiceSingleUser}
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ========================= Statement section End =========================== */}

      {/*  */}
      <>
        <div
          className='modal fade order_item'
          id={`exampleModal_1`}
          tabIndex={-1}
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h6 className='modal-title fs-5' id='exampleModalLabel'>
                  Update Product
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
                      <div className='container my-5' ref={componentRef}>
                        {/* Invoice Content */}
                        <div className='p-5 bg-white'>
                          {/* Header */}
                          <div className='row mb-4 border-bottom pb-3'>
                            <div className='col-sm-6'>
                              <h2 className='fw-bold'>INVOICE</h2>
                              <p className='mb-0'>
                                #INV no: {readSingleInvoiceSingleUser?._id}
                              </p>
                              <p className='mb-0'>
                                #TRA no: {readSingleInvoiceSingleUser?.tran_id}
                              </p>
                              <small>Date: Dec 1, 2020</small>
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
                              <p className='mb-0'>
                                {
                                  readSingleInvoiceSingleUser?.cus_details?.[0]
                                    ?.Name
                                }
                              </p>

                              <p className='mb-0'>
                                {
                                  readSingleInvoiceSingleUser?.cus_details?.[0]
                                    ?.Email
                                }
                              </p>
                              <p className='mb-0'>
                                {
                                  readSingleInvoiceSingleUser?.cus_details?.[0]
                                    ?.Phone
                                }
                              </p>
                              <p className='mb-0'>
                                {
                                  readSingleInvoiceSingleUser?.cus_details?.[0]
                                    ?.Address
                                }
                              </p>
                            </div>
                            <div className='col-sm-6 text-end'>
                              <h6 className='fw-bold'>Payment information: </h6>
                              <p className='mb-1'>
                                Payment Status:{" "}
                                <span
                                  className={`fw-bold text-uppercase ${
                                    readSingleInvoiceSingleUser?.payment_status ===
                                    "success"
                                      ? "text-success"
                                      : readSingleInvoiceSingleUser?.payment_status ===
                                        "pending"
                                      ? "text-warning"
                                      : "text-danger"
                                  }`}
                                >
                                  {readSingleInvoiceSingleUser?.payment_status}
                                </span>
                              </p>
                              <p className='mb-1'>
                                Deliver Status:{" "}
                                <span
                                  className={`fw-bold text-uppercase ${
                                    readSingleInvoiceSingleUser?.deliver_status ===
                                    "delivered"
                                      ? "text-success"
                                      : readSingleInvoiceSingleUser?.deliver_status ===
                                        "pending"
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
                            <table className='table  align-middle'>
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
                                {readSingleInvoiceSingleUser?.invoiceProducts?.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <td className='text-start'>
                                        {item?.product_name}
                                      </td>

                                      <td>{item?.color}</td>
                                      <td>{item?.size}</td>
                                      <td>{item?.qty}</td>
                                      <td>{item?.price} Tk.</td>
                                      <td className='text-end'>
                                        {item?.qty * item?.price} Tk.
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Summary */}
                          <div className='row justify-content-end'>
                            <div className='col-8'>
                              <p className='text-danger small fst-italic'>
                                {toWords.convert(
                                  Number(
                                    readSingleInvoiceSingleUser?.payable || 0
                                  )
                                )}
                              </p>
                            </div>
                            <div className='col-4'>
                              <ul className='list-unstyled'>
                                <li className='d-flex justify-content-between mb-2'>
                                  <span>Subtotal:</span>{" "}
                                  <span>
                                    {readSingleInvoiceSingleUser?.total} Tk.
                                  </span>
                                </li>
                                <li className='d-flex justify-content-between mb-2'>
                                  <span>Vat (15%):</span>{" "}
                                  <span>
                                    {readSingleInvoiceSingleUser?.vat} Tk.
                                  </span>
                                </li>
                                <li className='d-flex justify-content-between mb-2'>
                                  <span>Shipping cost:</span>{" "}
                                  <span>75 Tk.</span>
                                </li>
                                <li className='d-flex justify-content-between border-top pt-2 fw-bold'>
                                  <span>Total:</span>{" "}
                                  <span>
                                    {readSingleInvoiceSingleUser?.payable} Tk.
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className='text-center mt-5 text-muted small'>
                            <p className='mb-1'>Thank you for your purchase!</p>
                            <p>
                              This invoice was generated electronically and is
                              valid without a signature.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                >
                  Close
                </button>
                <button
                  onClick={printFn}
                  type='button'
                  className='btn btn-primary'
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default DashboardOrder;