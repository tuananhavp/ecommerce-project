import { CiMail } from "react-icons/ci";

const FooterTop = () => {
  return (
    <div className="pb-16 border-b-2 border-gray-300">
      <div className="flex md:flex-row flex-col justify-between gap-5 md:items-center items-start ">
        <div className="md:w-3/12 w-full">
          <h3 className="text-heading-primary lg:text-xl text-sm font-bold">Join our newsletter for £10 offs</h3>
          <p className="text-gray-primary lg:text-sm text-xs mt-2.5">
            Register now to get latest updates on promotions & coupons.Don’t worry, we not spam!
          </p>
        </div>
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
  );
};

export default FooterTop;
