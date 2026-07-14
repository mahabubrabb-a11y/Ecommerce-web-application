import { useEffect, useState } from "react";
import userStore from "../store/userStore";
import { ErrorToast, formatDate, IsEmpty } from "../helper/helper";

const ProfileInner = () => {
  let { user, userRequest, userUpdateLoading, userUpdateRequest } = userStore();
  let [data, setData] = useState({
    cus_name: "",
    password: "",
    cus_add: "",
    cus_city: "",
    cus_country: "",
    cus_fax: "",
    cus_phone: "",
    cus_postcode: "",
    cus_state: "",
    ship_add: "",
    ship_city: "",
    ship_country: "",
    ship_name: "",
    ship_phone: "",
    ship_postcode: "",
    ship_state: "",
  });

  useEffect(() => {
    if (user) {
      setData({
        cus_add: user?.cus_add || "",
        password: "",
        cus_city: user?.cus_city || "",
        cus_country: user?.cus_country || "",
        cus_fax: user?.cus_fax || "",
        cus_name: user?.cus_name || "",
        cus_phone: user?.cus_phone || "",
        cus_postcode: user?.cus_postcode || "",
        cus_state: user?.cus_state || "",
        ship_add: user?.ship_add || "",
        ship_city: user?.ship_city || "",
        ship_country: user?.ship_country || "",
        ship_name: user?.ship_name || "",
        ship_phone: user?.ship_phone || "",
        ship_postcode: user?.ship_postcode || "",
        ship_state: user?.ship_state || "",
      });
    }
  }, [user]);

  // Validation rules
  const validations = [
    { field: data.cus_name, message: "Customer name is required!" },
    { field: data.password, message: "Password is required!" },
    { field: data.cus_add, message: "Customer address is required!" },
    { field: data.cus_city, message: "Customer city is required!" },
    { field: data.cus_country, message: "Customer country is required!" },
    { field: data.cus_phone, message: "Customer phone is required!" },
    { field: data.cus_postcode, message: "Customer postcode is required!" },
    { field: data.cus_state, message: "Customer state is required!" },
    { field: data.ship_add, message: "Shipping address is required!" },
    { field: data.ship_city, message: "Shipping city is required!" },
    { field: data.ship_country, message: "Shipping country is required!" },
    { field: data.ship_name, message: "Shipping name is required!" },
    { field: data.ship_phone, message: "Shipping phone is required!" },
    { field: data.ship_postcode, message: "Shipping postcode is required!" },
    { field: data.ship_state, message: "Shipping state is required!" },
  ];

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  let userSubmit = async () => {
    for (const { field, message } of validations) {
      if (IsEmpty(field)) {
        return ErrorToast(message);
      }
    }

    await userUpdateRequest(data);
    await userRequest();
  };

  return (
    <>
      {/* Cover Photo Start */}
      <div className='cover-photo position-relative z-index-1 overflow-hidden'>
        <div className='avatar-upload'>
          <div className='avatar-preview'>
            <div id='imagePreviewTwo'></div>
          </div>
        </div>
      </div>
      {/* Cover Photo End */}
      <div className='dashboard-body__content profile-content-wrapper z-index-1 position-relative mt--100'>
        {/* Profile Content Start */}
        <div className='profile'>
          <div className='row gy-4'>
            <div className='col-xxl-3 col-xl-4'>
              <div className='profile-info'>
                <div className='profile-info__inner mb-40 text-center'>
                  <h5 className='profile-info__name mb-1'>{user?.cus_name}</h5>
                  <span className='profile-info__designation font-14'>
                    Exclusive Author
                  </span>
                </div>
                <ul className='profile-info-list'>
                  <li className='profile-info-list__item'>
                    <span className='profile-info-list__content flx-align flex-nowrap gap-2'>
                      <img
                        src='assets/images/icons/profile-info-icon2.svg'
                        alt=''
                        className='icon'
                      />
                      <span className='text text-heading fw-500'>Email</span>
                    </span>
                    <span className='profile-info-list__info'>
                      {user?.email}
                    </span>
                  </li>
                  <li className='profile-info-list__item'>
                    <span className='profile-info-list__content flx-align flex-nowrap gap-2'>
                      <img
                        src='assets/images/icons/profile-info-icon3.svg'
                        alt=''
                        className='icon'
                      />
                      <span className='text text-heading fw-500'>Phone</span>
                    </span>
                    <span className='profile-info-list__info'>
                      {user?.cus_phone}
                    </span>
                  </li>
                  <li className='profile-info-list__item'>
                    <span className='profile-info-list__content flx-align flex-nowrap gap-2'>
                      <img
                        src='assets/images/icons/profile-info-icon4.svg'
                        alt=''
                        className='icon'
                      />
                      <span className='text text-heading fw-500'>Country</span>
                    </span>
                    <span className='profile-info-list__info'>
                      {" "}
                      {user?.cus_country}
                    </span>
                  </li>

                  <li className='profile-info-list__item'>
                    <span className='profile-info-list__content flx-align flex-nowrap gap-2'>
                      <img
                        src='assets/images/icons/profile-info-icon6.svg'
                        alt=''
                        className='icon'
                      />
                      <span className='text text-heading fw-500'>
                        Member Since
                      </span>
                    </span>
                    <span className='profile-info-list__info'>
                      {formatDate(user?.createdAt)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-xxl-9 col-xl-8'>
              <div className='dashboard-card'>
                <div className='profile-info-content'>
                  <div className='tab-content' id='pills-tabContent'>
                    <div className='tab-pane fade show active'>
                      <div>
                        <div className='row gy-4'>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Customer Name
                            </label>
                            <input
                              onChange={handleChange}
                              value={data?.cus_name}
                              required
                              name='cus_name'
                              type='text'
                              className='common-input border'
                              placeholder='Customer Name'
                            />
                          </div>

                          <div className='col-sm-6 col-xs-6'>
                            <label
                              htmlFor='confirm-password'
                              className='form-label mb-2 font-18 font-heading fw-600'
                            >
                              Password
                            </label>
                            <div className='position-relative'>
                              <input
                                onChange={handleChange}
                                value={data?.password}
                                name='password'
                                type='password'
                                className='common-input common-input--withIcon common-input--withLeftIcon '
                              />
                              <span className='input-icon input-icon--left'>
                                <img
                                  src='assets/images/icons/lock-two.svg'
                                  alt=''
                                />
                              </span>
                            </div>
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Customer address
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.cus_add}
                              name='cus_add'
                              type='text'
                              className='common-input border'
                              placeholder='Customer address'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Customer city
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.cus_city}
                              name='cus_city'
                              type='text'
                              className='common-input border'
                              placeholder='Customer city'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Customer country
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.cus_country}
                              name='cus_country'
                              type='text'
                              className='common-input border'
                              placeholder='Customer country'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Customer fax
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.cus_fax}
                              name='cus_fax'
                              type='text'
                              className='common-input border'
                              placeholder='Customer fax'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Customer phone
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.cus_phone}
                              name='cus_phone'
                              type='text'
                              className='common-input border'
                              placeholder='Customer phone'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Customer postcode
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.cus_postcode}
                              name='cus_postcode'
                              type='text'
                              className='common-input border'
                              placeholder='Customer postcode'
                            />
                          </div>
                          <div className='col-12'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Customer state
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.cus_state}
                              name='cus_state'
                              type='text'
                              className='common-input border'
                              placeholder='Customer state'
                            />
                          </div>

                          {/* Shipping */}

                          <div>
                            <p>
                              -------- 🚚 Shipping Information 🛳️ ----------
                            </p>
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Shipping name
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.ship_name}
                              name='ship_name'
                              type='text'
                              className='common-input border'
                              placeholder='Shipping name'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Shipping address
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.ship_add}
                              name='ship_add'
                              type='text'
                              className='common-input border'
                              placeholder='Shipping address'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Shipping city
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.ship_city}
                              name='ship_city'
                              type='text'
                              className='common-input border'
                              placeholder='Shipping city'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Shipping country
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.ship_country}
                              name='ship_country'
                              type='text'
                              className='common-input border'
                              placeholder='Shipping country'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Shipping phone
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.ship_phone}
                              name='ship_phone'
                              type='text'
                              className='common-input border'
                              placeholder='Shipping phone'
                            />
                          </div>
                          <div className='col-sm-6 col-xs-6'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Shipping postcode
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.ship_postcode}
                              name='ship_postcode'
                              type='text'
                              className='common-input border'
                              placeholder='Shipping postcode'
                            />
                          </div>
                          <div className='col-12'>
                            <label className='form-label mb-2 font-18 font-heading fw-600'>
                              Shipping state
                            </label>
                            <input
                              required
                              onChange={handleChange}
                              value={data?.ship_state}
                              name='ship_state'
                              type='text'
                              className='common-input border'
                              placeholder='Shipping state'
                            />
                          </div>

                          <div className='col-sm-12 text-end'>
                            <button
                              disabled={userUpdateLoading}
                              onClick={userSubmit}
                              className='btn btn-main btn-lg pill mt-4'
                            >
                              {userUpdateLoading
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