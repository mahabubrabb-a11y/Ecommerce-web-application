import ReactQuill from "react-quill-new";
import { Link } from "react-router-dom";
import { formats, modules } from "../helper/Helper";
import Paginate from "../helper/Paginate";

const AllProducts = () => {
  return (
    <>
      {/* Cover Photo Start */}
      <div className="cover-photo  overflow-hidden">
        <div className="avatar-upload p-5">
          <h2>Supper Admin</h2>
          <h5>All Product</h5>
        </div>
      </div>
      <div className="dashboard-body__content mt-0">
        {/* ========================= Statement section start =========================== */}
        <div className="row gy-4">
          <div className="col-12">
            <div className="card common-card border border-gray-five">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table text-body ">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Is Discount</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="super_admin_all-product">
                        <td>
                          <img
                            src={`https://placehold.co/60x60`}
                            alt=""
                            className="cover-img"
                          />
                        </td>
                        <td>
                          {" "}
                          <h6 className="product-item__title">
                            <Link
                              to={`http://localhost:3001/super-admin/product-details?product_id=1`}
                              className="link"
                            >
                              Baby Toy Car
                            </Link>
                          </h6>
                        </td>
                        <td>
                          <div className="flx-align justify-content-center gap-2">
                            <h6 className="product-item__price mb-0">৳900</h6>
                            <span className="product-item__prevPrice font-12 text-danger text-decoration-line-through">
                              ৳900
                            </span>
                          </div>{" "}
                        </td>
                        <td> Yes</td>
                        <td> 100</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              className="btn btn-success"
                              data-bs-toggle="modal"
                              data-bs-target={`#exampleModal_${1}`}
                              onClick={() => readSingleProduct(item?._id)}
                            >
                              Edit
                            </button>
                            <button className="btn btn-danger">Delete</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flx-between justify-content-end gap-2">
                    <nav aria-label="Page navigation example">
                      <div>
                        <Paginate page_no={1} per_page={5} totalCount={10} />
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ========================= Statement section End =========================== */}
      </div>

      {/*  */}
      <>
        <div
          className="modal fade"
          id={`exampleModal_${1}`}
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title fs-5" id="exampleModalLabel">
                  Update Product
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="profile">
                  <div className="row gy-4">
                    <div className="col-12">
                      <div className="dashboard-card">
                        <div className="profile-info-content">
                          <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active">
                              <div>
                                <div className="row gy-4">
                                  <div className="col-sm-6 col-xs-6">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Title
                                    </label>
                                    <input
                                      value={"Baby Toy Car"}
                                      type="text"
                                      className="common-input border"
                                    />
                                  </div>
                                  <div className="col-sm-6 col-xs-6">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Short Description
                                    </label>
                                    <input
                                      value={
                                        "A fun and safe toy car for babies."
                                      }
                                      type="text"
                                      className="common-input border"
                                    />
                                  </div>
                                  <div className="col-12">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Image (Use comma for multi images. Ex:
                                      image_1.png, image_2.jpg, image_3.png)
                                    </label>
                                    <textarea
                                      value={
                                        "image_1.png, image_2.jpg, image_3.png"
                                      }
                                      name=""
                                      id=""
                                      className="common-input border"
                                    ></textarea>
                                  </div>
                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Price
                                    </label>
                                    <input
                                      value={1000}
                                      type="number"
                                      className="common-input border"
                                    />
                                  </div>
                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Is Discount?
                                    </label>
                                    <div className="select-has-icon">
                                      <select
                                        className="common-input border"
                                        value={true}
                                      >
                                        <option value={true}>True</option>
                                        <option value={false}>False</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Discount Price
                                    </label>
                                    <input
                                      value={500}
                                      type="number"
                                      className="common-input border"
                                    />
                                  </div>

                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Category
                                    </label>
                                    <div className="select-has-icon">
                                      <select
                                        className="common-input border"
                                        value={"Baby"}
                                      >
                                        <option value={""}>
                                          Please Select A Category **
                                        </option>
                                        <option value={123}>Laptop</option>
                                        <option value={123}>Baby</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Brand
                                    </label>
                                    <div className="select-has-icon">
                                      <select
                                        className="common-input border"
                                        value={"Walton"}
                                      >
                                        <option value={""}>
                                          Please Select A Brand **
                                        </option>
                                        <option value={123}>Waltop</option>
                                        <option value={123}>Squaire</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Remark (Ex: New)
                                    </label>
                                    <input
                                      value={"New"}
                                      type="text"
                                      className="common-input border"
                                    />
                                  </div>
                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Stock
                                    </label>
                                    <input
                                      value={50}
                                      type="number"
                                      className="common-input border"
                                    />
                                  </div>
                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Color (Ex: Red, Green, Blue)
                                    </label>
                                    <input
                                      value={"Red, Green, Blue"}
                                      type="text"
                                      className="common-input border"
                                    />
                                  </div>

                                  <div className="col-sm-4 col-xs-4">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Size (Ex: XXL, XL, X)
                                    </label>
                                    <input
                                      value={"XXL, XL, X"}
                                      type="text"
                                      className="common-input border"
                                    />
                                  </div>

                                  <div className="col-12">
                                    <label className="form-label mb-2 font-18 font-heading fw-600">
                                      Description
                                    </label>

                                    <ReactQuill
                                      theme="snow"
                                      modules={modules}
                                      formats={formats}
                                      value={"This is a sample description."}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  data-bs-dismiss="modal"
                  type="button"
                  className="btn btn-primary"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default AllProducts;