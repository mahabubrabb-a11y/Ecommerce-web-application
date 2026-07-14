import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    emailjs
      .sendForm(
        "service_ljx76ce", // replace with your EmailJS service ID
        "template_71bgc2q", // replace with your EmailJS template ID
        formRef.current,
        "O86rX38MqMjDTy9Xv" // replace with your EmailJS public key
      )
      .then(
        (result) => {
          console.log(result);
          setMessage("✅ Message sent successfully!");
          setLoading(false);
          formRef.current.reset();
        },
        (error) => {
          console.log(error);

          setMessage("❌ Failed to send message. Please try again!");
          setLoading(false);
        }
      );
  };
  return (
    <section className='contact padding-t-120 padding-b-60 section-bg position-relative z-index-1 overflow-hidden'>
      <img
        src='assets/images/gradients/banner-two-gradient.png'
        alt=''
        className='bg--gradient'
      />
      <img
        src='assets/images/shapes/pattern-five.png'
        className='position-absolute end-0 top-0 z-index--1'
        alt=''
      />
      <div className='container container-two'>
        <div className='row gy-4'>
          <div className='col-lg-5'>
            <div className='contact-info'>
              <h3 className='contact-info__title'>
                Get in touch with us today
              </h3>
              <p className='contact-info__desc'>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Voluptatum rem facere labore cupiditate sint? Animi quis illo
                suscipit autem cum.
              </p>
              <div className='contact-info__item-wrapper flx-between gap-4'>
                <div className='contact-info__item'>
                  <span className='contact-info__text text-capitalize d-block mb-1'>
                    Give Us A Call
                  </span>
                  <Link
                    to='tel:01812345678'
                    className='contact-info__link font-24 fw-500 text-heading hover-text-main'
                  >
                    01812345678
                  </Link>
                </div>
                <div className='contact-info__item'>
                  <span className='contact-info__text text-capitalize d-block mb-1'>
                    Give Us An Email
                  </span>
                  <Link
                    to='tel:info@pixbo.com'
                    className='contact-info__link font-24 fw-500 text-heading hover-text-main'
                  >
                    info@pixbo.com
                  </Link>
                </div>
              </div>
              <div className='mt-24'>
                <ul className='social-icon-list'>
                  <li className='social-icon-list__item'>
                    <Link
                      to='https://www.facebook.com'
                      className='social-icon-list__link text-heading flx-center'
                    >
                      <i className='fab fa-facebook-f' />
                    </Link>
                  </li>
                  <li className='social-icon-list__item'>
                    <Link
                      to='https://www.twitter.com'
                      className='social-icon-list__link text-heading flx-center'
                    >
                      {" "}
                      <i className='fab fa-twitter' />
                    </Link>
                  </li>
                  <li className='social-icon-list__item'>
                    <Link
                      to='https://www.linkedin.com'
                      className='social-icon-list__link text-heading flx-center'
                    >
                      {" "}
                      <i className='fab fa-linkedin-in' />
                    </Link>
                  </li>
                  <li className='social-icon-list__item'>
                    <Link
                      to='https://www.pinterest.com'
                      className='social-icon-list__link text-heading flx-center'
                    >
                      {" "}
                      <i className='fab fa-pinterest-p' />
                    </Link>
                  </li>
                  <li className='social-icon-list__item'>
                    <Link
                      to='https://www.pinterest.com'
                      className='social-icon-list__link text-heading flx-center'
                    >
                      {" "}
                      <i className='fab fa-youtube' />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-lg-7 ps-lg-5'>
            <div className='card common-card p-sm-4'>
              <div className='card-body'>
                <form ref={formRef} onSubmit={sendEmail} autoComplete='off'>
                  <div className='row gy-4'>
                    <div className='col-12'>
                      <label
                        htmlFor='name'
                        className='form-label mb-2 font-18 font-heading fw-600'
                      >
                        Subject
                      </label>
                      <input
                        type='text'
                        name='from_subject'
                        className='common-input common-input--grayBg border'
                        id='subject'
                        placeholder='Subject'
                        required
                      />
                    </div>
                    <div className='col-sm-6 col-xs-6'>
                      <label
                        htmlFor='name'
                        className='form-label mb-2 font-18 font-heading fw-600'
                      >
                        Full Name
                      </label>
                      <input
                        type='text'
                        name='from_name'
                        className='common-input common-input--grayBg border'
                        id='name'
                        placeholder='Your name here'
                        required
                      />
                    </div>
                    <div className='col-sm-6 col-xs-6'>
                      <label
                        htmlFor='email'
                        className='form-label mb-2 font-18 font-heading fw-600'
                      >
                        Your Mail
                      </label>
                      <input
                        type='email'
                        name='from_email'
                        className='common-input common-input--grayBg border'
                        id='email'
                        placeholder='Your email here '
                        required
                      />
                    </div>
                    <div className='col-sm-12'>
                      <label
                        htmlFor='message'
                        className='form-label mb-2 font-18 font-heading fw-600'
                      >
                        Your Message
                      </label>
                      <textarea
                        name='message'
                        className='common-input common-input--grayBg border'
                        id='message'
                        placeholder='Write Your Message Here'
                        required
                      />
                    </div>
                    <div className='col-sm-12'>
                      <button
                        type='submit'
                        disabled={loading}
                        className='btn btn-main btn-lg pill w-100'
                      >
                        {loading ? "Sending..." : "Submit Now"}
                      </button>
                    </div>

                    {message && (
                      <div className='col-sm-12 text-center mt-3'>
                        <p>{message}</p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;