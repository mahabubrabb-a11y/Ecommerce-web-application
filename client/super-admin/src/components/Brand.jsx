import { baseURLFile } from "../helper/config"
import Paginate from "../helper/Paginate"
import { useNavigate, useSearchParams } from "react-router-dom";
import brandStore from "../store/brandStore";
import { useEffect, useState } from "react";
import { DeleteAlert, ErrorToast, IsEmpty } from "../helper/Helper"
import Skeleton from "react-loading-skeleton"; 

const Brand = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const per_page = 6;
  const page_no = searchParams.get("page_no") || 1;

  let {
    createBrandRequest,
    allBrandRequest,
    allBrand,
    totalBrand,
    deleteBrandRequest,
    singleBrandRequest,
    updateBrandRequest,
  } = brandStore();

  let [data, setData] = useState({
    brand_name: "",
    brand_img: "",
  });

  // Validation rules
  const validations = [
    { field: data.brand_name, message: "Brand name is required!" },
    { field: data.brand_img, message: "Brand image is required!" },
  ];

  let brandSubmit = async () => {
    for (const { field, message } of validations) {
      if (IsEmpty(field)) {
        return ErrorToast(message);
      }
    }
    let success = await createBrandRequest(data);
    if(success) {
      await allBrandRequest(per_page, Number(page_no));
    }
  };

  // all Brand
  useEffect(() => {
    (async () => {
      await allBrandRequest(per_page, Number(page_no));
    })();
  }, [allBrandRequest, page_no]);

  //! pagination function - FIX: Added /super-admin path prefix
  const handelPageClick = async (event) => {
    let selectedPage = event.selected + 1;
    await allBrandRequest(per_page, Number(selectedPage));
    navigate(`/super-admin/brand?page_no=${selectedPage}`);
  };

  // delete Brand
  let deleteBrand = async (_id) => {
    let res = await DeleteAlert(deleteBrandRequest, _id);
    if (res) {
      await allBrandRequest(per_page, Number(page_no));
    }
  };

  // read single Brand
  let [_id, setId] = useState("");
  let readSingleBrand = async (_id) => {
    let res = await singleBrandRequest(_id);
    if (res) {
      setId(res?._id);
      setData({
        brand_name: res?.brand_name,
        brand_img: res?.brand_img,
      });
    }
  };

  // update Brand
  let updateBrand = async () => {
    let res = await updateBrandRequest(_id, data);
    if (res) {
      await allBrandRequest(per_page, Number(page_no));
    }
  };

  return (
    <>
      {/* Cover Photo Start */}
      <div className='cover-photo overflow-hidden'>
        <div className='avatar-upload p-5 mb-5'>
          <h2>Supper Admin</h2>
          <h5>Create Brand</h5>
        </div>
      </div>
      {/* Cover Photo End */}
      
      <div className='dashboard-body__content profile-content-wrapper z-index-1 position-relative mt--100 pt-2'>
        <div className='profile'>
          <div className='row gy-4'>
            <div className='col-12 '>
              <div className='dashboard-card'>
                <div className='profile-info-content'>
                  <div className='tab-content' id='pills-tabContent'>
                    <div className='tab-pane fade show active'>
                      <div>
                        <div className='row gy-4'>
                          <div className='col-md-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Brand name
                            </label>
                            <input
                              value={data.brand_name}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  brand_name: e.target.value,
                                })
                              }
                              type='text'
                              className='common-input border'
                            />
                          </div>
                          <div className='col-md-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Image Single
                            </label>
                            <input
                              value={data.brand_img}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  brand_img: e.target.value,
                                })
                              }
                              type='text'
                              className='common-input border'
                            />
                          </div>

                          <div className='col-sm-12 text-end'>
                            <button
                              onClick={brandSubmit}
                              className='btn btn-main btn-lg pill mt-4 '
                            >
                              Create Brand
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className='col-12 '>
              <div className='card common-card border border-gray-five'>
                <div className='card-body'>
                  <div className='table-responsive'>
                    <table className='table text-body '>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Brand Name</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* FIX 1: Handled valid table nesting for empty state */}
                        {allBrand?.length === 0 && (
                          <tr>
                            <td colSpan="3" className="text-center">No data found!</td>
                          </tr>
                        )}
                        
                        {allBrand === null ? (
                          <>
                            {/* FIX 2: Added unique key to skeleton loops */}
                            {[...Array(4)].map((_, idx) => (
                              <tr key={`skeleton-${idx}`}>
                                <td className='Skeleton'><Skeleton count={1} /></td>
                                <td className='Skeleton'><Skeleton count={1} /></td>
                                <td className='Skeleton'><Skeleton count={1} /></td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <>
                            {allBrand?.map((item, index) => (
                              <tr key={item?._id || index}>
                                <td>
                                  <div className='img-100'>
                                    <img
                                      src={`${baseURLFile}/${item?.brand_img}`}
                                      alt={item?.brand_name}
                                      onError={(e) => { e.target.src = 'https://placehold.co/100' }}
                                    />
                                  </div>
                                </td>
                                <td>{item?.brand_name}</td>
                                <td>
                                  <div className='d-flex justify-content-end gap-2'>
                                    <button
                                      onClick={() => readSingleBrand(item?._id)}
                                      className='btn btn-success'
                                      data-bs-toggle='modal'
                                      data-bs-target='#exampleModal_brand'
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deleteBrand(item?._id)}
                                      className='btn btn-danger'
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                    
                    <div className='flx-between justify-content-end gap-2 mt-4'>
                      <nav aria-label='Page navigation example'>
                        <div>
                          {allBrand?.length > 0 && (
                            <Paginate
                              handelPageClick={handelPageClick}
                              page_no={Number(page_no)}
                              per_page={per_page}
                              totalCount={totalBrand}
                            />
                          )}
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand update modal section */}
      <div
        className='modal fade'
        id='exampleModal_brand'
        tabIndex={-1}
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h6 className='modal-title fs-5' id='exampleModalLabel'>Update Brand</h6>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
            </div>
            <div className='modal-body'>
              <div className='dashboard-card'>
                <div className='profile-info-content'>
                  <div className='row gy-4'>
                    <div className='col-md-6'>
                      <label className='form-label mb-2 font-18 font-heading fw-600'>Brand name</label>
                      <input
                        onChange={(e) => setData({ ...data, brand_name: e.target.value })}
                        value={data.brand_name}
                        type='text'
                        className='common-input border'
                      />
                    </div>
                    <div className='col-md-6'>
                      <label className='form-label mb-2 font-18 font-heading fw-600'>Image Single</label>
                      <input
                        onChange={(e) => setData({ ...data, brand_img: e.target.value })}
                        value={data.brand_img}
                        type='text'
                        className='common-input border'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
              <button onClick={updateBrand} type='button' className='btn btn-primary' data-bs-with-dismiss='modal' data-bs-dismiss='modal'>
                Update Brand
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Brand;