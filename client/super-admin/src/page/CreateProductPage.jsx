import MasterLayout from "../layout/Masterlayout"
import Preloader from "../helper/preloader";
import CreateProduct from "../components/CreateProduct"

const CreateProductPage = () => {
  return (
    <MasterLayout>
      {/* Preloader */}
      <Preloader />

      {/* CreateProduct */}
      <CreateProduct />
    </MasterLayout>
  );
};

export default CreateProductPage;