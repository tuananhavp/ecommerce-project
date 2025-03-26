import React from "react";
import { CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import google from "./../assets/google.png";
import appstore from "./../assets/appstore.png";
import inter from "./../assets/inter.png";
import visa from "./../assets/visa.svg";
import skrill from "./../assets/skrill.png";
import paypal from "./../assets/paypal.png";
import klarna from "./../assets/klama.png";
const Footer = () => {
  return (
    <footer className="flex items-center justify-center px-3 py-12 bg-[#F3F4F6]">
      <div className="w-9/12">
        {/* Footer Top */}
        <div className="pb-16 border-b-2 border-gray-300">
          <div className="flex md:flex-row flex-col justify-between gap-5 md:items-center items-start ">
            {/* FT-Left */}
            <div className="md:w-3/12 w-full">
              <h3 className="text-heading-primary lg:text-xl text-sm font-bold">
                Join our newsletter for £10 offs
              </h3>
              <p className="text-gray-primary lg:text-sm text-xs mt-2.5">
                Register now to get latest updates on promotions & coupons.Don’t
                worry, we not spam!
              </p>
            </div>
            {/* FT-Right */}
            <div className="flex-col">
              <div className="flex gap-1.5 items-center bg-white text-gray-primary text-sm md:pl-4 pl-2 shadow-sm rounded-l-2xl">
                <CiMail className="size-5 mr-1" />
                <input
                  type="text"
                  placeholder="Enter Email..."
                  className="focus:outline-none grow-1 xl:text-base lg:text-xs text-[8px]"
                />
                <button className="border-0 text-white bg-purple-800 font-bold xl:text-base text-[10px] rounded-r-2xl xl:p-4 p-2 hover:opacity-85">
                  SEND
                </button>
              </div>
              {/* Bottom */}
              <div className="mt-2 pl-3 text-gray-primary">
                <h1 className="md:text-xs text-[10px]">
                  By subscribing you agree to our
                  <a
                    className="ml-1 text-purple-700"
                    target="_blank"
                    href="https://termly.io/resources/articles/privacy-policy-vs-terms-and-conditions/"
                  >
                    Terms & Conditions and Privacy & Cookies Policy.
                  </a>
                </h1>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Middle */}
        <div className="mt-12 lg:grid-cols-3 xl:grid-cols-5 grid gap-5 pb-16 border-b-2 border-gray-300">
          {/* Col 1 */}
          <div className="">
            <h1 className="font-bold">Do you need help ?</h1>
            <ul>
              <li className="text-gray-primary text-xs mt-4">
                Autoseligen syr. Nek diarask fröbomba. Nör antipol kynoda nynat.
                Pressa fåmoska.
              </li>
              <li>
                <div className="flex items-center gap-3 mt-4">
                  <FiPhone className="size-7" />
                  <div>
                    <p className="text-gray-primary text-xs">
                      Monday-Friday: 08am-9pm
                    </p>
                    <h3 className="text-heading-primary lg:text-xs text-sm font-bold mt-1">
                      0 800 300-353
                    </h3>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 mt-4">
                  <CiMail className="size-7" />
                  <div>
                    <p className="text-gray-primary md:text-xs text-sm">
                      Need help with your order?
                    </p>
                    <h3 className="text-heading-primary lg:text-xs text-sm font-bold mt-1">
                      tuananhavp@gmail.com
                    </h3>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          {/* Col 2 */}
          <div className="">
            <h1 className="font-bold">Make Money with Us</h1>
            <ul className="mt-3">
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Sell on Grogin</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Sell Your Services on Grogin</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Sell on Grogin Business</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Sell Your Apps on Grogin</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Advertise Your Products</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Sell-Publish with Us</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Become an Blowwe Vendor</Link>
              </li>
            </ul>
          </div>
          {/* Col 3 */}
          <div className="">
            <h1 className="font-bold">Let Us Help You</h1>
            <ul className="mt-3">
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Accessibility Statement</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Your Orders</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Returns & Replacements</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Refund and Returns Policy</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Privacy Policy</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Cookie Settings</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Terms and Conditions</Link>
              </li>
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Help Center</Link>
              </li>
            </ul>
          </div>
          {/* Col 4 */}
          <div className="">
            <h1 className="font-bold">Get to Know Us</h1>
            <ul className="mt-3">
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Careers for Grogin</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>About Grogin</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Inverstor Relations</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Grogin Devices</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Customer reviews</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Social Responsibility</Link>
              </li>{" "}
              <li className="text-gray-secondary text-xs mt-1">
                <Link to={"/"}>Store Locations</Link>
              </li>
            </ul>
          </div>
          {/* Col 5 */}
          <div>
            <h1 className="font-bold">Dowload our app</h1>
            <div className="flex items-center gap-2.5 mt-3.5">
              <a href="" target="_blank">
                <img src={google} alt="google-chplay" />
              </a>
              <div className="flex flex-col">
                <p className="text-gray-primary text-[10px] inline-block">
                  Dowload App Get
                </p>
                <p className="text-gray-primary text-[10px] inline-block">
                  -10% Discount
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 mt-3.5">
              <a href="" target="_blank">
                <img src={appstore} alt="google-chplay" />
              </a>
              <div className="flex flex-col">
                <p className="text-gray-primary text-[10px] inline-block">
                  Dowload App Get
                </p>
                <p className="text-gray-primary text-[10px] inline-block">
                  -20% Discount
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="mt-10 flex xl:flex-row gap-3 flex-col justify-between">
          {/* FB-Left */}
          <div className="">
            <p className="text-gray-primary sm:text-xs text-[10px]">
              Copyright 2024 © Jinstore WooCommerce WordPress Theme. All right
              reserved. Powered by{" "}
              <span className="ml-1 text-purple-600">BlackRise Themes</span>.
            </p>
            <div className="flex gap-2 items-center mt-3">
              <img
                className="sm:size-8 size-6 object-contain"
                src={visa}
                alt=""
              />
              <img
                className="sm:size-8 size-6 object-contain"
                src={inter}
                alt=""
              />
              <img
                className="sm:size-8 size-6 object-contain"
                src={paypal}
                alt=""
              />
              <img
                className="sm:size-8 size-6 object-contain"
                src={skrill}
                alt=""
              />
              <img
                className="sm:size-8 size-6 object-contain"
                src={klarna}
                alt=""
              />
            </div>
          </div>
          {/* FB-Right */}
          <div className="flex sm:flex-row flex-col gap-3">
            <Link className="text-gray-primary sm:text-xs text-[10px] underline underline-offset-2">
              Term and Conditions
            </Link>
            <Link className="text-gray-primary sm:text-xs text-[10px] underline underline-offset-2">
              Privacy Policy
            </Link>
            <Link className="text-gray-primary sm:text-xs text-[10px] underline underline-offset-2">
              Order Tracking
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
