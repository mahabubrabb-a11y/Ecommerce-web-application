import { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import userStore from "../store/userStore";

const MasterLayout = ({ children }) => {
  const navigate = useNavigate();
  let { userLogoutRequest } = userStore();

  let logout = async () => {
    let res = await userLogoutRequest();
    if (res) {
      navigate("/login");
    }
  };

  let [active, setActive] = useState(false);
  let [show, setShow] = useState(false);

  let dashboardControl = () => {
    setActive(!active);
  };
  let showProfileControl = () => {
    setShow(!show);
  };

  return (
    <>
      <section
        className={`dashboard ${active && "active"}`}
        onClick={() => show === true && setShow(false)}
      >
        <div className='dashboard__inner d-flex'>
          {/* Dashboard Sidebar Start */}
          <div className={`dashboard-sidebar ${active && "active"}`}>
            <button
              onClick={dashboardControl}
              type='button'
              className='dashboard-sidebar__close d-lg-none d-flex text-body hover-text-main'
            >
              <i className='las la-times' />
            </button>
            <div className='dashboard-sidebar__inner'>
              <Link to='/' className='logo mb-48'>
                <img
                  src='assets/images/logo/logo.png'
                  alt=''
                  className='white-version'
                />
                <img
                  src='assets/images/logo/white-logo-two.png'
                  alt=''
                  className='dark-version'
                />
              </Link>
              <Link to='/' className='logo favicon mb-48'>
                <img src='assets/images/logo/favicon.png' alt='' />
              </Link>
              {/* Sidebar List Start */}
              <ul className='sidebar-list'>
                <li className='sidebar-list__item'>
                  <NavLink
                    to='/dashboard-profile'
                    className={(navData) =>
                      navData.isActive
                        ? "sidebar-list__link activePage"
                        : "sidebar-list__link"
                    }
                  >
                    <span className='sidebar-list__icon'>
                      <img
                        src='assets/images/icons/sidebar-icon2.svg'
                        alt=''
                        className='icon'
                      />
                      <img
                        src='assets/images/icons/sidebar-icon-active2.svg'
                        alt=''
                        className='icon icon-active'
                      />
                    </span>
                    <span className='text'>Profile</span>
                  </NavLink>
                </li>

                <li className='sidebar-list__item'>
                  <NavLink
                    to='/dashboard-all-orders'
                    className={(navData) =>
                      navData.isActive
                        ? "sidebar-list__link activePage"
                        : "sidebar-list__link"
                    }
                  >
                    <span className='sidebar-list__icon'>
                      <img
                        src='assets/images/icons/sidebar-icon12.svg'
                        alt=''
                        className='icon'
                      />
                      <img
                        src='assets/images/icons/sidebar-icon-active12.svg'
                        alt=''
                        className='icon icon-active'
                      />
                    </span>
                    <span className='text'>All Orders</span>
                  </NavLink>
                </li>

                <li className='sidebar-list__item'>
                  <NavLink
                    to='/dashboard-review?&page_no=1'
                    className={(navData) =>
                      navData.isActive
                        ? "sidebar-list__link activePage"
                        : "sidebar-list__link"
                    }
                  >
                    <span className='sidebar-list__icon'>
                      <img
                        src='assets/images/icons/sidebar-icon7.svg'
                        alt=''
                        className='icon'
                      />
                      <img
                        src='assets/images/icons/sidebar-icon-active7.svg'
                        alt=''
                        className='icon icon-active'
                      />
                    </span>
                    <span className='text'>All orders products</span>
                  </NavLink>
                </li>
              </ul>
              {/* Sidebar List End */}
            </div>
          </div>

          <div className='dashboard-body'>
            {/* Dashboard Nav Start */}
            <div className='dashboard-nav bg-white flx-between gap-md-3 gap-2'>
              <div className='dashboard-nav__left flx-align gap-md-3 gap-2'>
                <button
                  onClick={dashboardControl}
                  type='button'
                  className='icon-btn bar-icon text-heading bg-gray-seven flx-center'
                >
                  <i className='las la-bars' />
                </button>
                <button
                  onClick={dashboardControl}
                  type='button'
                  className='icon-btn arrow-icon text-heading bg-gray-seven flx-center'
                >
                  <img src='assets/images/icons/angle-right.svg' alt='' />
                </button>
                <form action='#' className='search-input d-sm-block d-none'>
                  <span className='icon'>
                    <img
                      src='assets/images/icons/search-dark.svg'
                      alt=''
                      className='white-version'
                    />
                    <img
                      src='assets/images/icons/search-dark-white.svg'
                      alt=''
                      className='dark-version'
                    />
                  </span>
                  <input
                    type='text'
                    className='common-input common-input--md common-input--bg pill w-100'
                    placeholder='Search here...'
                  />
                </form>
              </div>
              <div className='dashboard-nav__right'>
                <div className='header-right flx-align'>
                  <div className='header-right__inner gap-sm-3 gap-2 flx-align d-flex'>
                    {/* Light Dark Mode */}
                    <ThemeToggle />
                    <div className='user-profile'>
                      <button
                        className='user-profile__button flex-align'
                        onClick={showProfileControl}
                      >
                        <span className='user-profile__thumb inner'>
                          <FaRegUser />
                        </span>
                      </button>
                      <ul
                        className={`user-profile-dropdown ${show && "show"} `}
                      >
                        <li className='sidebar-list__item'>
                          <Link
                            to='/dashboard-profile'
                            className='sidebar-list__link'
                          >
                            <span className='sidebar-list__icon'>
                              <img
                                src='assets/images/icons/sidebar-icon2.svg'
                                alt=''
                                className='icon'
                              />
                              <img
                                src='assets/images/icons/sidebar-icon-active2.svg'
                                alt=''
                                className='icon icon-active'
                              />
                            </span>
                            <span className='text'>Profile</span>
                          </Link>
                        </li>

                        <li className='sidebar-list__item'>
                          <button
                            onClick={logout}
                            className='sidebar-list__link'
                          >
                            <span className='sidebar-list__icon'>
                              <img
                                src='assets/images/icons/sidebar-icon13.svg'
                                alt=''
                                className='icon'
                              />
                              <img
                                src='assets/images/icons/sidebar-icon-active13.svg'
                                alt=''
                                className='icon icon-active'
                              />
                            </span>
                            <span className='text'>Logout</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* children */}
            {children}
            {/* Dashboard Footer */}
            <div className='dashboard-footer bottom-footer-two mt-32 border-0 bg-white'>
              <div className='bottom-footer__inner flx-between gap-3'>
                <p className='bottom-footer__text font-14'>
                  {" "}
                  Copyright © 2025-2026 PIXBO, All rights reserved.
                </p>
                <div className='footer-links gap-4'>
                  <Link
                    to='/#'
                    className='footer-link hover-text-heading font-14'
                  >
                    Terms of service
                  </Link>
                  <Link
                    to='/#'
                    className='footer-link hover-text-heading font-14'
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to='/#'
                    className='footer-link hover-text-heading font-14'
                  >
                    cookies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MasterLayout;
