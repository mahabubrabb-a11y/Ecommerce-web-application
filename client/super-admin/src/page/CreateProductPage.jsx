import MasterLayout from "../layout/Masterlayout"
import Preloader from "../helper/Preloader";
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