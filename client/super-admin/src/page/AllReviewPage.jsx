import MasterLayout from "../layout/Masterlayout"
import Preloader from "../helper/Preloader";
import AllReviews from "../components/AllReviewPage"

const AllReviewPage = () => {
  return (
    <MasterLayout>
      {/* Preloader */}
      <Preloader />

      {/* AllReviews */}
      <AllReviews />
    </MasterLayout>
  );
};

export default AllReviewPage;