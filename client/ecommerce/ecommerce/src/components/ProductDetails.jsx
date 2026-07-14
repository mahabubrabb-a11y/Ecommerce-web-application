import { FaRegStar, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import parse from "html-react-parser";
import Skeleton from "react-loading-skeleton";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useEffect, useState } from "react";
import productStore from "../store/productStore";
import { baseURLFile } from "../helper/config";
import cartStore from "../store/cartStore";
import { ErrorToast, formatDate, IsEmpty } from "../helper/helper";
import reviewStore from "../store/reviewStore";

const ProductDetails = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  let [data, setData] = useState({
    size: "",
    color: "",
    qty: 1,
    activeColor: null,
    activeSize: null,
  });

  const product_id = searchParams.get("product_id");

  // product Store
  let { singleProduct, singleProductsRequest } = productStore();
  useEffect(() => {
    (async () => {
      await singleProductsRequest(product_id);
    })();
  }, [product_id, singleProductsRequest]);

  const discount =
    ((singleProduct?.price - singleProduct?.discount_price) /
      singleProduct?.price) *
    100;

  // cart Store
  let { createCartLoading, createCartRequest, allCartRequest } = cartStore();
  // Validation rules
  const validations = [
    { field: product_id, message: "product id is required!" },
    { field: singleProduct?.title, message: "Title is required!" },
    { field: data.color, message: "Color is required!" },
    { field: data.qty, message: "Qty is required!" },
    { field: data.size, message: "Size is required!" },
  ];

  const cartSubmit = async () => {
    for (const { field, message } of validations) {
      if (IsEmpty(field)) {
        return ErrorToast(message);
      }
    }

    let submitData = {
      product_id,
      product_name: singleProduct?.title,
      color: data.color,
      qty: data.qty,
      size: data.size,
    };

    let res = await createCartRequest(submitData);
    await singleProductsRequest(product_id);
    if (res === 401) {
      navigate("/login");
    }
    await allCartRequest();
  };

  // Review Store
  let { allReviewByProductRequest, allReviewByProduct } = reviewStore();
  useEffect(() => {
    (async () => {
      await allReviewByProductRequest(product_id);
    })();
  }, [product_id, allReviewByProductRequest]);

  const StarRating = ({ star }) => {
    star = parseInt(star);
    const totalStars = 5;
    const filledStars = Array(star).fill(<FaStar />);
    const emptyStars = Array(totalStars - star).fill(<FaRegStar />);

    return (
      <div className='star'>
        {filledStars.concat(emptyStars).map((star, index) => (
          <span key={index}>{star}</span>
        ))}
      </div>
    );
  };



  return (
    <div className='product-details mt-32 padding-b-120'>
      <div className='container container-two'>
        <div className='row gy-4'>
          {/* Left Column - Product Images and Description */}
          {singleProduct === null ? (
            <>
              {[...Array(6)].map(() => (
                <div className='col-lg-6'>
                  <div className='Skeleton'>
                    <Skeleton count={8} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className='col-lg-6'>
                <div className='tab-content' id='pills-tabContent'>
                  <div
                    className='tab-pane fade show active'
                    id='pills-product-details'
                    role='tabpanel'
                    aria-labelledby='pills-product-details-tab'
                    tabIndex={0}
                  >
                    {/* Product Details Content Start */}
                    <div className='product-details'>
                      <div>
                        <Swiper
                          style={{
                            "--swiper-navigation-color": "#fff",
                            "--swiper-pagination-color": "#fff",
                          }}
                          spaceBetween={10}
                          navigation={true}
                          thumbs={{ swiper: thumbsSwiper }}
                          modules={[FreeMode, Navigation, Thumbs]}
                          className='mySwiper2'
                        >
                          {singleProduct?.images?.map((img, index) => (
                            <SwiperSlide>
                              <div
                                key={index}
                                className='main-product-image mb-3'
                              >
                                <img src={`${baseURLFile}/${img}`} />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        {/* Thumbnail Images */}
                        <div className='product-thumbnails d-flex gap-2'>
                          <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className='mySwiper'
                          >
                            {singleProduct?.images?.map((img, index) => (
                              <SwiperSlide>
                                <div
                                  key={index}
                                  className='main-product-image mb-3'
                                >
                                  <img src={`${baseURLFile}/${img}`} />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      </div>

                      <h5 className='product-details__desc mt-4'>
                        Product Description
                      </h5>
                      <div className='product-details__item'>
                        {parse(singleProduct?.description || "")}
                      </div>
                    </div>
                    {/* Product Details Content End */}
                  </div>

                  {/* Reviews Tab */}
                  <div
                    className='tab-pane fade'
                    id='pills-rating'
                    role='tabpanel'
                    aria-labelledby='pills-rating-tab'
                    tabIndex={0}
                  >
                    <div className='product-review-wrapper'>
                      {allReviewByProduct?.map((item, index) => (
                        <div key={index} className='product-review'>
                          <div className='product-review__top flx-between'>
                            <div className='product-review__rating flx-align'>
                              <div className='d-flex align-items-center gap-1'>
                                <div className='star'>
                                  <StarRating star={item?.rating} />
                                </div>
                                <span className='star-rating__text text-body'>
                                  {item?.rating}.0
                                </span>
                              </div>
                              <span className='product-review__reason'>
                                For{" "}
                                <span className='product-review__subject'>
                                  Customer Support
                                </span>
                              </span>
                            </div>
                            <div className='product-review__date'>
                              by{" "}
                              <strong className='product-review__user text--base'>
                                {item?.user?.cus_name}
                              </strong>{" "}
                              ({formatDate(item?.updatedAt)})
                            </div>
                          </div>
                          <div className='product-review__body'>
                            <p className='product-review__desc'>{item?.des}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Right Column - Product Info and Purchase Options */}

          {singleProduct === null ? (
            <>
              {" "}
              {[...Array(6)].map(() => (
                <div className='col-lg-6'>
                  <div className='Skeleton'>
                    <Skeleton count={8} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {" "}
              <div className='col-lg-6'>
                <div className='product-sidebar pt-0'>
                  <div className='product-sidebar__top position-relative flx-between gap-1'>
                    <div className='title_box'>
                      <h3 className='product-sidebar__title'>
                        {singleProduct?.title}
                      </h3>
                    </div>

                    <div className='price py-3'>
                      <h4>
                        {singleProduct?.is_discount === false
                          ? `৳${singleProduct?.price}`
                          : `৳${singleProduct?.discount_price}`}{" "}
                        <del>
                          {singleProduct?.is_discount === false
                            ? ""
                            : `৳${singleProduct?.price}`}{" "}
                        </del>{" "}
                        {singleProduct?.is_discount === true && (
                          <>
                            <span className='discount_percent'>
                              - {discount.toFixed(0)} % Off
                            </span>
                          </>
                        )}
                      </h4>
                      <p>{singleProduct?.sort_description}</p>
                    </div>

                    <div className='size py-3'>
                      <h5>Size: {data?.size}</h5>
                      <div className='size_varient'>
                        {singleProduct?.size?.map((item, index) => (
                          <button
                            className={data?.activeSize === index && "active"}
                            key={index}
                            onClick={() => {
                              setData({
                                ...data,
                                size: item,
                                activeSize: index,
                              });
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className='color py-3'>
                      <h5>Color: {data?.color}</h5>
                      <div className='size_varient'>
                        {singleProduct?.color?.map((item, index) => (
                          <button
                            className={data?.activeColor === index && "active"}
                            key={index}
                            onClick={() => {
                              setData({
                                ...data,
                                color: item,
                                activeColor: index,
                              });
                            }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className='quantity py-3'>
                      <div className='w-100'>
                        <h5 className='text-danger'>
                          Stock: {singleProduct?.stock}
                        </h5>
                        <div className='inner'>
                          <button
                            className='btn-quantity btn-decrease'
                            onClick={() => {
                              setData({
                                ...data,
                                qty: data.qty > 1 ? data.qty - 1 : 1,
                              });
                            }}
                          >
                            -
                          </button>
                          <span className='quantity-product'>{data?.qty}</span>
                          <button
                            className='btn-quantity btn-increase'
                            onClick={() => {
                              setData({ ...data, qty: data.qty + 1 });
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className='w-100 pt-5'>
                        {singleProduct?.stock === 0 ? (
                          <>
                            <button
                              disabled={true}
                              className='btn not-allow btn-main d-flex w-100 justify-content-center align-items-center gap-2 pill px-sm-5 '
                            >
                              <img
                                src='assets/images/icons/add-to-cart.svg'
                                alt=''
                              />
                              Product out of stock
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              disabled={createCartLoading}
                              onClick={cartSubmit}
                              className='btn btn-main d-flex w-100 justify-content-center align-items-center gap-2 pill px-sm-5'
                            >
                              <img
                                src='assets/images/icons/add-to-cart.svg'
                                alt=''
                              />
                              {createCartLoading ? "Loading..." : "Add To Cart"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meta Attribute List Start */}
                  <ul className='meta-attribute'>
                    <li className='meta-attribute__item'>
                      <span className='name'>Last Update</span>
                      <span className='details'>
                        {formatDate(singleProduct?.updatedAt)}
                      </span>
                    </li>
                    <li className='meta-attribute__item'>
                      <span className='name'>Published</span>
                      <span className='details'>
                        {formatDate(singleProduct?.createdAt)}
                      </span>
                    </li>
                    <li className='meta-attribute__item'>
                      <span className='name'>Category</span>
                      <span className='details'>
                        {singleProduct?.category?.[0]?.category_name}
                      </span>
                    </li>
                    <li className='meta-attribute__item'>
                      <span className='name'>Brand</span>
                      <span className='details'>
                        {singleProduct?.brand?.[0]?.brand_name}
                      </span>
                    </li>
                    <li className='meta-attribute__item'>
                      <span className='name'>Is Discount</span>
                      <span className='details'>
                        {" "}
                        {singleProduct?.is_discount ? "True" : "False"}
                      </span>
                    </li>
                    {singleProduct?.is_discount === true && (
                      <li className='meta-attribute__item'>
                        <span className='name'>Discount Percent</span>
                        <span className='details'>{discount.toFixed(0)}%</span>
                      </li>
                    )}
                  </ul>
                  {/* Meta Attribute List End */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;