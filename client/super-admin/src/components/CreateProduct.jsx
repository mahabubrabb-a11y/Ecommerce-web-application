import ReactQuill from "react-quill-new";
import { formats, modules } from "../helper/Helper"

const CreateProduct = () => {
  return (
    <>
      {/* Cover Photo Start */}
      <div className="cover-photo  overflow-hidden">
        <div className="avatar-upload p-5 mb-5">
          <h2>Supper Admin</h2>
          <h5>Create Product</h5>
        </div>
      </div>
      {/* Cover Photo End */}
      <div className="dashboard-body__content profile-content-wrapper z-index-1 position-relative mt--100 pt-2">
        {/* Profile Content Start */}
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
                              type="text"
                              className="common-input border"
                            />
                          </div>
                          <div className="col-sm-6 col-xs-6">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Short Description
                            </label>
                            <input
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
                              type="number"
                              className="common-input border"
                            />
                          </div>
                          <div className="col-sm-4 col-xs-4">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Is Discount?
                            </label>
                            <div className="select-has-icon">
                              <select className="common-input border">
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
                              type="number"
                              className="common-input border"
                            />
                          </div>

                          <div className="col-sm-4 col-xs-4">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Category
                            </label>
                            <div className="select-has-icon">
                              <select className="common-input border">
                                <option value={""}>
                                  Please Select A Category **
                                </option>
                                <option>Laptop</option>
                                <option>Baby</option>
                                <option>Women</option>
                                <option>Man</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-4 col-xs-4">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Brand
                            </label>
                            <div className="select-has-icon">
                              <select className="common-input border">
                                <option value={""}>
                                  Please Select A Brand **
                                </option>
                                <option>HP</option>
                                <option>Walton</option>
                                <option>LG</option>
                                <option>Apple</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-sm-4 col-xs-4">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Remark (Ex: New)
                            </label>
                            <input
                              type="text"
                              className="common-input border"
                            />
                          </div>
                          <div className="col-sm-4 col-xs-4">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Stock
                            </label>
                            <input
                              type="number"
                              className="common-input border"
                            />
                          </div>
                          <div className="col-sm-4 col-xs-4">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Color (Ex: Red, Green, Blue)
                            </label>
                            <input
                              type="text"
                              className="common-input border"
                            />
                          </div>

                          <div className="col-sm-4 col-xs-4">
                            <label className="form-label mb-2 font-18 font-heading fw-600">
                              Size (Ex: XXL, XL, X)
                            </label>
                            <input
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
                              value={""}
                            />
                          </div>

                          <div className="col-sm-12 text-end">
                            <button className="btn btn-main btn-lg pill mt-4">
                              Create Product
                            </button>
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
        {/* Profile Content End */}
      </div>
    </>
  );
};

export default CreateProduct;
