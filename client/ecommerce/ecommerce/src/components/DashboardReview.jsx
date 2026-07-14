import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ReactStars from "react-stars";
import Paginate from "../helper/Paginate";
import reviewStore from "../store/reviewStore";
import invoiceStore from "../store/invoiceStore";
import { useEffect, useState } from "react";
import { baseURLFile } from "../helper/config";
import { ErrorToast, formatDate, IsEmpty } from "../helper/helper";

const DashboardReview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const per_page = 6;
  const page_no = searchParams.get("page_no") || 1;

  let { createReviewRequest } = reviewStore();
  let {
    readInvoiceProductListSingleUserRequest,
    readInvoiceProductListSingleUser,
    totalInvoiceProduct,
  } = invoiceStore();

  useEffect(() => {
    readInvoiceProductListSingleUserRequest(per_page, page_no);
  }, [readInvoiceProductListSingleUserRequest, page_no, per_page]);

  //! pagination function
  const handelPageClick = async (event) => {
    let page_no = event.selected;
    await readInvoiceProductListSingleUserRequest(per_page, page_no + 1);

    navigate(`/dashboard-review?page_no=${page_no + 1}`);
  };

  // For Rating work start
  let [rating, setRating] = useState(3);
  let [data, setData] = useState({
    des: "",
    rating: "",
    product_id: "",
    invoice_id: "",
  });
  const ratingChanged = (newRating) => {
    setRating(newRating);
    setData({
      ...data,
      rating: newRating,
    });
  };

  // Validation rules
  const validations = [
    { field: data.des, message: "Description is required!" },
    { field: data.rating, message: "Rating is required!" },
  ];

  let submitReview = () => {
    // setData({ ...data, invoice_id, product_id });
    // setData({ ...data, product_id });
    for (const { field, message } of validations) {
      if (IsEmpty(field)) {
        return ErrorToast(message);
      }
    }
    createReviewRequest(data);
  };

  return (
    <div className='dashboard-body__content'>
      point
      {/* ===================== Review Section Start ========================== */}
      <div className='card common-card border border-gray-five'>
        <div className='card-body'>
          <div className='table-responsive'>
            <table className='table text-body mt--24'>
              <thead>
                <tr>
                  <th>Product | Date</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>QTY</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {readInvoiceProductListSingleUser?.length < 1 && (
                  <p>No data found!</p>
                )}
                {readInvoiceProductListSingleUser?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className='review-product d-flex align-items-center gap-2'>
                        <div className='review-product__thumb flex-shrink-0'>
                          <img
                            src={`${baseURLFile}/${item?.product?.images?.[0]}`}
                            alt='review product'
                          />
                        </div>
                        <div className='review-product__content'>
                          <h6 className='review-product__name font-15 fw-500 mb-0'>
                            <Link
                              target='_blank'
                              to={`/product-details?product_id=${item?.product?._id}`}
                              className='link'
                            >
                              {item?.product_name}
                            </Link>
                          </h6>
                          <span className='review-product__date font-12'>
                            {formatDate(item?.createdAt)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className='product-user font-16'>
                        <strong className='fw-600 badge bg-dark text-capitalize'>
                          {item?.color}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <div className='product-user font-16'>
                        <strong className='fw-600 badge bg-dark text-uppercase'>
                          {item?.size}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <div className='product-user font-16'>
                        <strong className='fw-600 badge bg-dark'>
                          {item?.qty}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <div className='product-user font-16'>
                        <strong className='fw-600 badge bg-danger '>
                          {item?.price}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <button
                        data-bs-toggle='modal'
                        data-bs-target={`#exampleModal_1`}
                        className='btn btn-main'
                        onClick={() =>
                          setData({
                            ...data,
                            invoice_id: item?._id,
                            product_id: item?.product?._id,
                          })
                        }
                      >
                        Make a review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flx-between justify-content-end gap-2'>
              <nav aria-label='Page navigation example'>
                <Paginate
                  handelPageClick={handelPageClick}
                  page_no={page_no}
                  per_page={per_page}
                  totalCount={totalInvoiceProduct}
                />
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* ===================== Review Section End ========================== */}
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
                  Product Review
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
                      <div className='dashboard-card'>
                        <div className='profile-info-content'>
                          <div className='tab-content' id='pills-tabContent'>
                            <div className='tab-pane fade show active'>
                              <form action='#' autoComplete='off'>
                                <div className='row gy-4'>
                                  <div className='col-12'>
                                    <label className='form-label mb-2 font-18 font-heading fw-600'>
                                      Add Feedback
                                    </label>
                                    <textarea
                                      onChange={(e) =>
                                        setData({
                                          ...data,
                                          des: e.target.value,
                                        })
                                      }
                                      className='common-input border'
                                    ></textarea>
                                  </div>
                                  <div className='col-12'>
                                    <label className='form-label mb-2 font-18 font-heading fw-600'>
                                      Add Review
                                    </label>
                                    <ReactStars
                                      count={5}
                                      size={34}
                                      color2={"#ffd700"}
                                      value={rating}
                                      half={false}
                                      onChange={ratingChanged}
                                    />
                                  </div>
                                </div>
                              </form>
                            </div>
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
                  onClick={() => submitReview()}
                  data-bs-dismiss='modal'
                  className='btn btn-primary'
                >
                  Submit review
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default DashboardReview;
