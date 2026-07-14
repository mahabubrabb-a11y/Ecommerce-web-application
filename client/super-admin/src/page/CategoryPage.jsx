import MasterLayout from "../layout/Masterlayout"
import Preloader from "../helper/Preloader";
import Category from "../components/Category"

const CategoryPage = () => {
  return (
    <MasterLayout>
      {/* Preloader */}
      <Preloader />

      {/* Category */}
      <Category />
    </MasterLayout>
  );
};

export default CategoryPage;