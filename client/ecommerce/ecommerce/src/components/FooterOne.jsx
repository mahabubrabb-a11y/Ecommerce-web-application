import { Link } from "react-router-dom";

const FooterOne = () => {
  return (
    <>
      <footer className='footer-section'>
        <img
          src='assets/images/shapes/pattern.png'
          alt=''
          className='bg-pattern'
        />
        <img
          src='assets/images/shapes/element1.png'
          alt=''
          className='element one'
        />
        <img
          src='assets/images/shapes/element2.png'
          alt=''
          className='element two'
        />
        <img
          src='assets/images/gradients/footer-gradient.png'
          alt=''
          className='bg--gradient'
        />
        <div className='container container-two'>
          <div className='row gy-5'>
            <div className='col-xl-4 col-sm-6'>
              <div className='footer-widget'>
                <div className='footer-widget__logo'>
                  <Link to='/'>
                    <img src='assets/images/logo/white-logo.png' alt='' />
                  </Link>
                </div>
                <p className='footer-widget__desc'>
                  Your one-stop online store for fashion, electronics, home
                  essentials, and more. Discover quality products at unbeatable
                  prices
                </p>
              </div>
            </div>
            <div className='col-xl-2 col-sm-6 col-xs-6'>
              <div className='footer-widget'>
                <h5 className='footer-widget__title text-white'>Useful Link</h5>
                <ul className='footer-lists'>
                  <li className='footer-lists__item'>
                    <Link
                      to='/all-products?category_id=0&brand_id=0&remark=0&keyword=0&per_page=12&page_no=1'
                      className='footer-lists__link'
                    >
                      Product
                    </Link>
                  </li>

                  <li className='footer-lists__item'>
                    <Link
                      to='/dashboard-profile'
                      className='footer-lists__link'
                    >
                      Profile
                    </Link>
                  </li>
                  <li className='footer-lists__item'>
                    <Link to='/cart' className='footer-lists__link'>
                      Shopping Cart
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-xl-2 col-sm-6 col-xs-6 ps-xl-5'>
              <div className='footer-widget'>
                <h5 className='footer-widget__title text-white'>Quick Links</h5>
                <ul className='footer-lists'>
                  <li className='footer-lists__item'>
                    <Link
                      to='/dashboard-profile'
                      className='footer-lists__link'
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className='footer-lists__item'>
                    <Link to='/login' className='footer-lists__link'>
                      Login{" "}
                    </Link>
                  </li>
                  <li className='footer-lists__item'>
                    <Link to='/register' className='footer-lists__link'>
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-xl-4 col-sm-6'>
              <div className='footer-widget'>
                <h5 className='footer-widget__title text-white'>Follow Us</h5>
                <p className='footer-widget__desc'>
                  Subscribe our newsletter to get updated the latest news
                </p>
                <div className='footer-widget__social'>
                  <ul className='social-icon-list'>
                    <li className='social-icon-list__item'>
                      <Link
                        to='https://www.facebook.com'
                        className='social-icon-list__link flx-center'
                      >
                        <i className='fab fa-facebook-f' />
                      </Link>
                    </li>
                    <li className='social-icon-list__item'>
                      <Link
                        to='https://www.twitter.com'
                        className='social-icon-list__link flx-center'
                      >
                        <i className='fab fa-twitter' />
                      </Link>
                    </li>
                    <li className='social-icon-list__item'>
                      <Link
                        to='https://www.linkedin.com'
                        className='social-icon-list__link flx-center'
                      >
                        <i className='fab fa-linkedin-in' />
                      </Link>
                    </li>
                    <li className='social-icon-list__item'>
                      <Link
                        to='https://www.pinterest.com'
                        className='social-icon-list__link flx-center'
                      >
                        <i className='fab fa-pinterest-p' />
                      </Link>
                    </li>
                    <li className='social-icon-list__item'>
                      <Link
                        to='https://www.pinterest.com'
                        className='social-icon-list__link flx-center'
                      >
                        <i className='fab fa-youtube' />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* bottom Footer */}
      <div className='bottom-footer'>
        <div className='container container-two'>
          <div className='bottom-footer__inner flx-between gap-3'>
            <p className='bottom-footer__text font-14'>
              Copyright © 2025 PIXBO, All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterOne;
