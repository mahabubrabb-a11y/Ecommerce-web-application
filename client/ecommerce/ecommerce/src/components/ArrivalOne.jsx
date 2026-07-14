import { Link } from "react-router-dom";
import productStore from "../store/productStore";
import { useEffect } from "react";
import { baseURLFile } from "../helper/config";

const ArrivalOne = () => {
  let { allNewArrivalProducts, newArrivalProductsRequest } = productStore();
  useEffect(() => {
    (async () => {
      await newArrivalProductsRequest(8);
    })();
  }, [newArrivalProductsRequest]);

  return (
    <section className='arrival-product padding-y-120 section-bg position-relative z-index-1'>
      <img
        src='assets/images/gradients/product-gradient.png'
        alt=''
        className='bg--gradient white-version'
      />
      <img
        src='assets/images/shapes/element2.png'
        alt=''
        className='element one'
      />
      <div className='container container-two'>
        <div className='section-heading'>
          <h3 className='section-heading__title'>New Arrival Products</h3>
        </div>

        <div className='row gy-4'>
          {allNewArrivalProducts?.map((item, index) => (
            <div key={index} className='col-xl-3 col-lg-4 col-sm-6'>
              <div className='product-item'>
                <div className='product-item__thumb d-flex'>
                  <Link
                    to={`/product-details?product_id=${item?._id}`}
                    className='link w-100'
                  >
                    <img
                      src={`${baseURLFile}/${item?.images?.[0]}`}
                      alt=''
                      className='cover-img'
                    />
                  </Link>
                </div>
                <div className='product-item__content'>
                  <h6 className='product-item__title'>
                    <Link
                      to={`/product-details?product_id=${item?._id}`}
                      className='link'
                    >
                      {item?.title}
                    </Link>
                  </h6>
                  <div className='product-item__info flx-between gap-2'>
                    <span className='product-item__author'>
                      <span className='link hover-text-decoration-underline'>
                        Admin
                      </span>
                    </span>
                  </div>
                  <div className='product-item__bottom flx-between  gap-2'>
                    <div className='flx-align gap-2'>
                      <h6 className='product-item__price mb-0'>
                        {item?.is_discount === false
                          ? `৳${item?.price}`
                          : `৳${item?.discount_price}`}
                      </h6>
                      <span className='product-item__prevPrice text-decoration-line-through'>
                        {item?.is_discount === false ? "" : `৳${item?.price}`}
                      </span>
                    </div>
                    <Link
                      to={`/product-details?product_id=${item?._id}`}
                      className='btn btn-outline-light btn-sm pill'
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center mt-64'>
          <Link
            to='/all-products?category_id=0&brand_id=0&remark=0&keyword=0&per_page=12&page_no=1'
            className='btn btn-main btn-lg pill fw-300'
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArrivalOne;