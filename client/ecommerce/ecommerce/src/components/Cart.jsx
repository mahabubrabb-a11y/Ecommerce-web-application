import { Link } from "react-router-dom";
import cartStore from "../store/cartStore";
import { useEffect } from "react";
import { baseURLFile } from "../helper/config";
import { ErrorToast } from "../helper/helper";

const Cart = () => {
  let { updateCartRequest, deleteCartRequest, allCart, allCartRequest } =
    cartStore();

  useEffect(() => {
    (async () => {
      await allCartRequest();
    })();
  }, [allCartRequest]);

  let deleteCart = async (id) => {
    await deleteCartRequest(id);
    await allCartRequest();
  };

  let increaseCartQty = async (cart_id, product_id, qty) => {
    await updateCartRequest(cart_id, { product_id, qty: qty + 1, inc: true });
    await allCartRequest();
  };
  let decreaseCartQty = async (cart_id, product_id, qty) => {
    if (qty === 1) {
      return ErrorToast("Cart must have one item.");
    }
    await updateCartRequest(cart_id, { product_id, qty: qty - 1, inc: false });
    await allCartRequest();
  };

  return (
    <div className='cart padding-y-120'>
      <div className='container'>
        <div className='cart-content'>
          <div className='table-responsive'>
            {allCart?.length < 1 && <p>No product add to cart!</p>}
            {allCart?.length > 0 && (
              <>
                <table className='table style-two'>
                  <thead>
                    <tr>
                      <th>Product Details</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCart?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className='cart-item'>
                            <div className='d-flex align-items-center gap-3'>
                              <div className='cart-item__thumb'>
                                <Link
                                  to={`/product-details?product_id=${item?.product_id}`}
                                  className='link'
                                >
                                  <img
                                    src={`${baseURLFile}/${item?.product?.images?.[0]}`}
                                    alt=''
                                    className='cover-img'
                                  />
                                </Link>
                              </div>
                              <div className='cart-item__content'>
                                <h6 className='cart-item__title font-heading fw-700 text-capitalize font-18 mb-4'>
                                  {" "}
                                  <Link
                                    to={`/product-details?product_id=${item?.product_id}`}
                                    className='link'
                                  >
                                    {item?.product_name}
                                  </Link>
                                </h6>
                                <div className='cart-item__price font-15 text-heading fw-500'>
                                  Category:{" "}
                                  <span className='text-body font-18'>
                                    {item?.category?.category_name}
                                  </span>
                                </div>
                                <div className='cart-item__price font-15 text-heading fw-500'>
                                  Size:{" "}
                                  <span className='text-body font-18'>
                                    {item?.size}
                                  </span>
                                </div>
                                <div className='cart-item__price font-15 text-heading fw-500'>
                                  Color:{" "}
                                  <span className='text-body font-18'>
                                    {" "}
                                    {item?.color}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='flx-align gap-4 mt-3 mt-lg-4'>
                              <button
                                onClick={() => deleteCart(item?._id)}
                                className='rounded-btn delete-btn text-danger hover-text-decoration-underline'
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='cart-item__count'>
                            <button
                              data-decrease='data-decrease'
                              onClick={() =>
                                decreaseCartQty(
                                  item?._id,
                                  item?.product_id,
                                  item?.qty
                                )
                              }
                            >
                              <i className='fas fa-minus' />
                            </button>
                            <input
                              data-value='data-value'
                              type='number'
                              value={item?.qty}
                              readOnly
                            />
                            <button
                              data-increase='data-increase'
                              onClick={() =>
                                increaseCartQty(
                                  item?._id,
                                  item?.product_id,
                                  item?.qty
                                )
                              }
                            >
                              <i className='fas fa-plus' />
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className='cart-item__totalPrice text-body font-18 fw-400 mb-0'>
                            {item?.product?.is_discount === false
                              ? `৳${item?.product?.price}`
                              : `৳${item?.product?.discount_price}`}
                            <del className='font-12 text-danger '>
                              {" "}
                              {item?.product?.is_discount === false
                                ? ""
                                : `৳${item?.product?.price}`}
                            </del>{" "}
                          </span>
                        </td>
                        <td>
                          <span className='cart-item__totalPrice text-body font-18 fw-400 mb-0'>
                            {item?.product?.is_discount === false
                              ? `৳${
                                  Number(item?.product?.price) *
                                  Number(item?.qty)
                                }`
                              : `৳${
                                  Number(item?.product?.discount_price) *
                                  Number(item?.qty)
                                }`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          <div className='cart-content__bottom flx-between gap-2'>
            <Link
              to='/all-products?category_id=0&brand_id=0&remark=0&keyword=0&per_page=12&page_no=1'
              className='btn btn-outline-light flx-align gap-2 pill btn-lg'
            >
              <span className='icon line-height-1 font-20'>
                <i className='las la-arrow-left' />
              </span>
              Continue Shopping
            </Link>
            <Link
              to='/cart-personal'
              className='btn btn-main flx-align gap-2 pill btn-lg'
            >
              Next
              <span className='icon line-height-1 font-20'>
                <i className='las la-arrow-right' />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;