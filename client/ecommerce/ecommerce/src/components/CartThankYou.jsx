import { Link } from "react-router-dom";

const CartThankYou = () => {
  return (
    <section className='cart-thank section-bg padding-y-120 position-relative z-index-1 overflow-hidden'>
      <img
        src='assets/images/gradients/thank-you-gradient.png'
        alt=''
        className='bg--gradient'
      />
      <div className='container container-two'>
        <div className='row justify-content-center'>
          <div className='col-lg-6 col-md-8 col-sm-10'>
            <div className='cart-thank__content text-center'>
              <h2 className='cart-thank__title mb-48'>
                Thank you for purchased this products!!
              </h2>
              <div className='cart-thank__img'>
                <img src='assets/images/thumbs/thank-evenelope.png' alt='' />
              </div>
            </div>
          </div>
        </div>
        <div className='padding-t-120'>
          <div className='cart-thank__box'>
            <div className='row gy-4'>
              <div className='flx-between gap-2'>
                <p className='text'>Please don’t forget to rating</p>
                <Link to='/' className='btn btn-main flx-align gap-2 pill'>
                  Back To Home
                  <span className='icon line-height-1 font-20'>
                    <i className='las la-arrow-right' />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartThankYou;