import { useEffect, useState } from "react";
import { FaHouse } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import cartStore from "../store/cartStore";
import userStore from "../store/userStore";

const HeaderOne = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    var offCanvasNav = document.getElementById("offcanvas-navigation");
    var menuExpand = offCanvasNav.querySelectorAll(
      ".has-submenu > .nav-menu__link"
    );
    var numMenuExpand = menuExpand.length;

    function sideMenuExpand() {
      if (this.parentElement.classList.contains("active") === true) {
        this.parentElement.classList.remove("active");
      } else {
        for (let i = 0; i < numMenuExpand; i++) {
          menuExpand[i].parentElement.classList.remove("active");
        }
        this.parentElement.classList.add("active");
      }
    }

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", sideMenuExpand);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else {
        setScroll(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const mobileMenu = () => {
    setActive(!active);
  };

  // api integrate
  let { allCart, allCartRequest } = cartStore();
  let { user, userRequest } = userStore();

  useEffect(() => {
    (async () => {
      await allCartRequest();
      await userRequest();
    })();
  }, [allCartRequest, userRequest]);

  return (
    <>
      <div className='overlay'></div>
      <div className={`side-overlay ${active && "show"}`}></div>
      {/* ==================== Header Start Here ==================== */}
      <header className={`header ${scroll ? "fixed-header" : ""} `}>
        <div className='container container-full'>
          <nav className='header-inner flx-between'>
            {/* Logo Start */}
            <div className='logo'>
              <Link to='/' className='link white-version'>
                <img src='assets/images/logo/logo-two.png' alt='Logo' />
              </Link>
              <Link to='/' className='link dark-version'>
                <img src='assets/images/logo/white-logo.png' alt='Logo' />
              </Link>
            </div>
            {/* Logo End  */}
            {/* Menu Start  */}
            <div className='header-menu d-lg-block d-none'>
              <ul className='nav-menu flx-align'>
                <li className='nav-menu__item '>
                  <NavLink to='/' className='nav-submenu__link'>
                    Home
                  </NavLink>
                </li>
                <li className='nav-menu__item'>
                  <NavLink
                    to='/all-products?category_id=0&brand_id=0&remark=0&keyword=0&per_page=12&page_no=1'
                    className='nav-submenu__link'
                  >
                    All Products
                  </NavLink>
                </li>

                <li className='nav-menu__item'>
                  <NavLink to='/contact' className='nav-menu__link'>
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>
            {/* Menu End  */}
            {/* Header Right start */}
            <div className='header-right flx-align'>
              <Link
                to='/cart'
                className='header-right__button cart-btn position-relative'
              >
                <img
                  src='assets/images/icons/cart.svg'
                  alt=''
                  className='white-version'
                />
                <img
                  src='assets/images/icons/cart-white.svg'
                  alt=''
                  className='dark-version'
                />
                <span className='qty-badge font-12'>
                  {allCart?.length || 0}
                </span>
              </Link>
              {/* Light Dark Mode */}
              <ThemeToggle />
              {/* Light Dark Mode */}
              {user !== null ? (
                <>
                  <Link to='/dashboard-profile' className='btn btn-main pill'>
                    <span className='icon-left icon'>
                      <FaHouse className='mb-1' />
                    </span>
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <div className='header-right__inner gap-3 flx-align d-lg-flex d-none'>
                    <Link to='/register' className='btn btn-main pill'>
                      <span className='icon-left icon'>
                        <img src='assets/images/icons/user.svg' alt='' />
                      </span>
                      Create Account
                    </Link>
                  </div>
                </>
              )}

              <button
                type='button'
                className='toggle-mobileMenu d-lg-none'
                onClick={mobileMenu}
              >
                <i className='las la-bars' />
              </button>
            </div>
            {/* Header Right End  */}
          </nav>
        </div>
      </header>
      {/* ==================== Header End Here ==================== */}

      <div className={`mobile-menu d-lg-none d-block ${active && "active"}`}>
        <button
          type='button'
          className='close-button text-body hover-text-main'
          onClick={mobileMenu}
        >
          <i className='las la-times' />
        </button>
        <div className='mobile-menu__inner'>
          <Link to='/' className='mobile-menu__logo'>
            <img
              src='assets/images/logo/logo.png'
              alt='Logo'
              className='white-version'
            />
            <img
              src='assets/images/logo/white-logo-two.png'
              alt='Logo'
              className='dark-version'
            />
          </Link>
          <div className='mobile-menu__menu'>
            <ul
              className='nav-menu flx-align nav-menu--mobile'
              id='offcanvas-navigation'
            >
              <li className='nav-menu__item'>
                <NavLink to='/' className='nav-menu__link'>
                  Home
                </NavLink>
              </li>
              <li className='nav-menu__item'>
                <NavLink
                  to='/all-products?category_id=0&brand_id=0&remark=0&keyword=0&per_page=12&page_no=1'
                  className='nav-menu__link'
                >
                  All Products
                </NavLink>
              </li>
              <li className='nav-menu__item'>
                <NavLink to='/contact' className='nav-menu__link'>
                  Contact
                </NavLink>
              </li>
            </ul>
            <div className='header-right__inner d-lg-none my-3 gap-1 d-flex flx-align'>
              <Link to='/register' className='btn btn-main pill'>
                <span className='icon-left icon'>
                  <img src='assets/images/icons/user.svg' alt='' />
                </span>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderOne;