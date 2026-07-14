import { FaRegStar, FaStar } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Paginate from "../helper/Paginate";
import reviewStore from "../store/reviewStore"
import { useEffect } from "react";
import { baseURLFile, hostURL } from "../helper/config"
import { formatDate } from "../helper/Helper"


const AllReviews = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const per_page = 6;
  const page_no = searchParams.get("page_no") || 1;

  let { allReviewRequest, allReview, totalReview } = reviewStore();

  useEffect(() => {
    allReviewRequest(per_page, Number(page_no)); //  page_no কে নাম্বার করে দেওয়া নিরাপদ
  }, [page_no, per_page]);


  const StarRating = ({ star }) => {
    const ratingNum = parseInt(star) || 0;
    const totalStars = 5;
    
    return (
      <>
        {Array(ratingNum).fill(null).map((_, i) => <FaStar key={`f-${i}`} />)}
        {Array(totalStars - ratingNum).fill(null).map((_, i) => <FaRegStar key={`e-${i}`} />)}
      </>
    );
  };


  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  //! pagination function
  const handelPageClick = async (event) => {
    let selectedPage = event.selected + 1;
    await allReviewRequest(per_page, selectedPage);

    navigate(`/super-admin/all-reviews?page_no=${selectedPage}`); 
  };

  return (
    <div className='dashboard-body__content'>
      <div className='card common-card border border-gray-five'>
        <div className='card-body'>
          <div className='table-responsive'>
            
           
            {(!allReview || allReview.length < 1) && <p>No data found!</p>}

            {allReview?.map((item, index) => (
              <div key={index} className='product-review-wrapper'>
                <div className='product-review'>
                  <div className='product-review__top flx-between'>
                    <div className='review_img'>
                      <img
                        src={`${baseURLFile}/${item?.product?.images?.[0]}`}
                        alt="product"
                      />
                      <div>
                        <Link
                          target='_blank'
                          to={`${hostURL}/product-details?product_id=${item?.product_id}`}
                        >
                          <h5>{item?.product?.title}</h5>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <div className='d-flex align-items-center gap-1'>
                        <div className='star'>
                          <p className='font-20 fw-bold'>
                            Name: {item?.user?.cus_name}
                          </p>
                          <strong>Email:</strong> {item?.user?.email}
                        </div>
                      </div>
                      <div className='d-flex align-items-center gap-1'>
                        <div className='star d-flex align-items-center gap-1'>
                          <StarRating star={item?.rating} />
                          <span className='star-rating__text text-body mt-1'>
                            {item?.rating} ({formatDate(item?.updatedAt)})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='product-review__body'>
                    <p className='product-review__desc'>{item?.des}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className='flx-between justify-content-end gap-2'>
              <nav aria-label='Page navigation example'>
                <div>
                  {allReview?.length > 0 && (
                    <Paginate
                      handelPageClick={handelPageClick}
                      page_no={page_no}
                      per_page={per_page}
                      totalCount={totalReview}
                    />
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllReviews;