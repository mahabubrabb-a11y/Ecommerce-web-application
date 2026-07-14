import { Link } from "react-router-dom";
import SliderComponent from "react-slick";
const Slider = SliderComponent.default || SliderComponent;
import categoryStore from "../store/categoryStore";
import { useEffect } from "react";
import { baseURLFile } from "../helper/config";

const PopularOne = () => {
  let { allCategory, allCategoryRequest } = categoryStore();
  useEffect(() => {
    (async () => {
      await allCategoryRequest(100, 1);
    })();
  }, [allCategoryRequest]);

  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button className={className} onClick={onClick}>
        <i className='las la-arrow-right' />
      </button>
    );
  }
  function SamplePrevArrow(props) {
    const { className, onClick } = props;

    return (
      <button className={className} onClick={onClick}>
        <i className='las la-arrow-left' />
      </button>
    );
  }
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  return (
    <section className='popular padding-y-120 overflow-hidden'>
      <div className='container container-two'>
        <div className='section-heading style-left mb-64'>
          <h5 className='section-heading__title'>Popular Categories</h5>
        </div>
        <div className='popular-slider arrow-style-two row gy-4'>
          <Slider {...settings}>
            {allCategory?.map((item, index) => (
              <div key={index}>
                <Link
                  to={`all-products?category_id=${item?._id}&brand_id=0&remark=0&keyword=0&per_page=12&page_no=1`}
                  className='popular-item w-100'
                >
                  <span className='popular-item__icon'>
                    <img src={`${baseURLFile}/${item?.category_img}`} alt='' />{" "}
                  </span>
                  <h6 className='popular-item__title font-18'>
                    {item?.category_name}
                  </h6>
                  <p>
                    <span className='popular-item__qty text-body'>
                      {" "}
                      {item?.totalProduct}
                    </span>
                  </p>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
        <div className='popular__button text-center'>
          <Link
            to='/all-products?category_id=0&brand_id=0&remark=0&keyword=0&per_page=12&page_no=1'
            className='font-18 fw-600 text-heading hover-text-main text-decoration-underline font-heading'
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularOne;
