import { useState,useEffect } from "react";
import adminStore from "../store/adminStore"
import { ErrorToast, IsEmpty } from "../helper/Helper"

const ProfileInner = () => {
  let { adminUpdateLoading, adminUpdateRequest, admin } = adminStore();
  let [data, setData] = useState({ email: "", password: "" });

  // Validation rules
  const validations = [
    { field: data.email, message: "Email is required!" },
    { field: data.password, message: "Password is required!" },
  ];

    useEffect(() => {
    if (admin) {
      setData({ email: admin?.email || "", password: "" });
    }
  }, [admin]);

  let adminSubmit = async () => {
    for (const { field, message } of validations) {
      if (IsEmpty(field)) {
        return ErrorToast(message);
      }
    }

    await adminUpdateRequest(data);
  };

  return (
    <>
      {/* Cover Photo Start */}
      <div className='cover-photo  overflow-hidden'>
        <div className='avatar-upload p-5'>
          <h2>Supper Admin</h2>
        </div>
      </div>
      {/* Cover Photo End */}
      <div className='dashboard-body__content profile-content-wrapper z-index-1 position-relative mt--150'>
        {/* Profile Content Start */}
        <div className='profile'>
          <div className='row gy-4'>
            <div className='col-12'>
              <div className='dashboard-card'>
                <div className='dashboard-card__header pb-0'>
                  <ul className=' tab-bordered '>
                    <li className='nav-item'>
                      <button className='nav-link font-18 font-heading'>
                        Change Password
                      </button>
                    </li>
                  </ul>
                </div>
                <div className='profile-info-content'>
                  <div>
                    <div>
                      <div>
                        <div className='row gy-4'>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Email
                            </label>
                            <div className='position-relative'>
                              <input
                                onChange={(e) =>
                                  setData({ ...data, email: e.target.value })
                                }
                                value={data.email}
                                placeholder="Enter your email"
                                type='email'
                                className='common-input common-input--bg common-input--withIcon common-input--withLeftIcon '
                              />
                              <span className='input-icon input-icon--left'>
                                <img
                                  src='/super-admin/assets/images/icons/profile-info-icon2.svg'
                                  alt=''
                                />
                              </span>
                            </div>
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label
                              htmlFor='new-password'
                              className='form-label mb-2 font-18 font-heading fw-600'
                            >
                              New Password
                            </label>
                            <div className='position-relative'>
                              <input
                                onChange={(e) =>
                                  setData({ ...data, password: e.target.value })
                                }
                                type='password'
                                placeholder="Enter your password"
                                className='common-input common-input--bg common-input--withIcon common-input--withLeftIcon'
                                id='new-password'
                              />
                            </div>
                          </div>

                          <div className='col-sm-12 text-end'>
                            <button
                              onClick={adminSubmit}
                              disabled={adminUpdateLoading}
                              className='btn btn-main btn-lg  pill'
                            >
                              {adminUpdateLoading
                                ? "🛻 Loading..."
                                : "Update Profile"}
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

export default ProfileInner;