import { baseURLFile } from "../helper/config"
import Paginate from "../helper/Paginate"

const Category = () => {
  return (
    <>
      {/* Cover Photo Start */}
      <div className="cover-photo  overflow-hidden">
        <div className="avatar-upload p-5 mb-5">
          <h2>Supper Admin</h2>
          <h5>Create Category</h5>
        </div>
      </div>
      {/* Cover Photo End */}
      <div className="dashboard-body__content profile-content-wrapper z-index-1 position-relative mt--100 pt-2">
        {/* Profile Content Start */}
        <div className="profile">
          <div className="row gy-4">
            <div className="col-12 ">
              <div className="dashboard-card">
                <div className="profile-info-content">
                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active">
                      <div>
                        <div className="row gy-4">
                          <div className="col-md-6">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Category name
                            </label>
                            <input
                              type="text"
                              className="common-input border"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Image Single
                            </label>
                            <input
                              type="text"
                              className="common-input border"
                            />
                          </div>

                          <div className="col-sm-12 text-end">
                            <button className="btn btn-main btn-lg pill mt-4 ">
                              Create Category
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 ">
              <div className="card common-card border border-gray-five">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table text-body ">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Category Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="img-100">
                              <img
                                src={`https://placehold.co/60x60`}
                                alt=""
                              />
                            </div>
                          </td>
                          <td>Baby Collection</td>
                          <td>
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                className="btn btn-success"
                                data-bs-toggle="modal"
                                data-bs-target={`#exampleModal_${1}`}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="flx-between justify-content-end gap-2">
                      <nav aria-label="Page navigation example">
                        <div>
                            <Paginate
                              page_no={1}
                              per_page={5}
                              totalCount={10}
                            />
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Profile Content End */}
      </div>

      {/* Category update section */}
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
                  Update Category
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="dashboard-card">
                  <div className="profile-info-content">
                    <div className="tab-content" id="pills-tabContent">
                      <div className="tab-pane fade show active">
                        <div>
                          <div className="row gy-4">
                            <div className="col-md-6">
                              <label className="form-label mb-2 font-18 font-heading fw-600">
                                Category name
                              </label>
                              <input
                                value="Baby Collection"
                                type="text"
                                className="common-input border"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label mb-2 font-18 font-heading fw-600">
                                Image Single
                              </label>
                              <input
                                value="https://placehold.co/60x60"
                                type="text"
                                className="common-input border"
                              />
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
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Update Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Category;
