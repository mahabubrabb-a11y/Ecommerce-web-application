import { Link } from "react-router-dom";
import productStore from "../store/productStore";

const BreadcrumbProductDetails = () => {
  let { singleProduct } = productStore();
  return (
    <section className='breadcrumb border-bottom p-0 d-block section-bg position-relative z-index-1'>
      <div className='breadcrumb-two'>
        <img
          src='assets/images/gradients/breadcrumb-gradient-bg.png'
          alt=''
          className='bg--gradient'
        />
        <div className='container container-two'>
          <div className='row justify-content-center'>
            <div className='col-lg-12'>
              <div className='breadcrumb-two-content'>
                <ul className='breadcrumb-list flx-align gap-2 mb-2'>
                  <li className='breadcrumb-list__item font-14 text-body'>
                    <Link
                      to='/'
                      className='breadcrumb-list__link text-body hover-text-main'
                    >
                      Home
                    </Link>
                  </li>
                  <li className='breadcrumb-list__item font-14 text-body'>
                    <span className='breadcrumb-list__icon font-10'>
                      <i className='fas fa-chevron-right' />
                    </span>
                  </li>
                  <li className='breadcrumb-list__item font-14 text-body'>
                    <span className='breadcrumb-list__link text-body hover-text-main'>
                      Products Details
                    </span>
                  </li>
                </ul>

                <div className='mt-2'>
                  <h3 className='breadcrumb-two-content__title mb-3 text-capitalize'>
                    {singleProduct?.title || "No Title"}
                  </h3>
                </div>

                <div className='breadcrumb-content flx-align gap-3'>
                  <div className='breadcrumb-content__item text-heading fw-500 flx-align gap-2'>
                    <span className='text'>
                      By <span className='link text-main fw-600'>Admin</span>{" "}
                    </span>
                  </div>

                  <div className='breadcrumb-content__item text-heading fw-500 flx-align gap-2'>
                    <span className='icon'>
                      <img
                        src='assets/images/icons/check-icon.svg'
                        alt=''
                        className='white-version'
                      />
                      <img
                        src='assets/images/icons/check-icon-white.svg'
                        alt=''
                        className='dark-version'
                      />
                    </span>
                    <span className='text'>Recently Updated</span>
                  </div>
                  <div className='breadcrumb-content__item text-heading fw-500 flx-align gap-2'>
                    <span className='icon'>
                      <img
                        src='assets/images/icons/check-icon.svg'
                        alt=''
                        className='white-version'
                      />
                      <img
                        src='assets/images/icons/check-icon-white.svg'
                        alt=''
                        className='dark-version'
                      />
                    </span>
                    <span className='text'>Best Product</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container container-two'>
        <div className='breadcrumb-tab flx-wrap align-items-start gap-lg-4 gap-2'>
          <ul
            className='nav tab-bordered nav-pills'
            id='pills-tab'
            role='tablist'
          >
            <li className='nav-item' role='presentation'>
              <button
                className='nav-link active'
                id='pills-product-details-tab'
                data-bs-toggle='pill'
                data-bs-target='#pills-product-details'
                type='button'
                role='tab'
                aria-controls='pills-product-details'
                aria-selected='true'
              >
                Product Details
              </button>
            </li>
            <li className='nav-item' role='presentation'>
              <button
                className='nav-link'
                id='pills-rating-tab'
                data-bs-toggle='pill'
                data-bs-target='#pills-rating'
                type='button'
                role='tab'
                aria-controls='pills-rating'
                aria-selected='false'
              >
                <span className='d-flex align-items-center gap-1'>
                  <span>Review</span>(
                  <span className='star-rating'>
                    <span className='star-rating__item font-11'>
                      <i className='fas fa-star' />
                    </span>
                    <span className='star-rating__item font-11'>
                      <i className='fas fa-star' />
                    </span>
                    <span className='star-rating__item font-11'>
                      <i className='fas fa-star' />
                    </span>
                    <span className='star-rating__item font-11'>
                      <i className='fas fa-star' />
                    </span>
                    <span className='star-rating__item font-11'>
                      <i className='fas fa-star' />
                    </span>
                  </span>
                  )<span className='star-rating__text text-body'> 5.0</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BreadcrumbProductDetails;