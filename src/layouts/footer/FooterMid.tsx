import Image from "next/image";
import Link from "next/link";

import { CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";

import { FOOTER_SECTIONS } from "../../constants/footer";

const FooterMid = () => {
  return (
    <div className="mt-12 lg:grid-cols-3 xl:grid-cols-5 grid gap-5 pb-16 border-b-2 border-gray-300">
      <div className="">
        <h1 className="font-bold">Do you need help ?</h1>
        <ul>
          <li className="text-gray-primary text-xs mt-4">
            Autoseligen syr. Nek diarask fröbomba. Nör antipol kynoda nynat. Pressa fåmoska.
          </li>
          <li>
            <div className="flex items-center gap-3 mt-4">
              <FiPhone className="size-7" />
              <div>
                <p className="text-gray-primary text-xs">Monday-Friday: 08am-9pm</p>
                <h3 className="text-heading-primary lg:text-xs text-sm font-bold mt-1">0 800 300-353</h3>
              </div>
            </div>
          </li>
          <li>
            <div className="flex items-center gap-3 mt-4">
              <CiMail className="size-7" />
              <div>
                <p className="text-gray-primary md:text-xs text-sm">Need help with your order?</p>
                <h3 className="text-heading-primary lg:text-xs text-sm font-bold mt-1">tuananhavp@gmail.com</h3>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {FOOTER_SECTIONS.map((col, colIndex) => {
        return (
          <div key={colIndex} className="">
            <h1 className="font-bold">{col.heading}</h1>
            <ul className="mt-3">
              {col.navigations.map((nav, navIndex) => {
                return (
                  <li key={navIndex} className="text-gray-secondary text-xs mt-1">
                    <Link href={nav.href}>{nav.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <div>
        <h1 className="font-bold">Dowload our app</h1>
        <div className="flex items-center gap-2.5 mt-3.5">
          <a href="" target="_blank">
            <Image src={"/google.png"} width={120} height={120} alt="google-chplay" />
          </a>
          <div className="flex flex-col">
            <p className="text-gray-primary text-[10px] inline-block">Dowload App Get</p>
            <p className="text-gray-primary text-[10px] inline-block">-10% Discount</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 mt-3.5">
          <a href="" target="_blank">
            <Image src={"/appstore.png"} alt="google-chplay" width={120} height={120} />
          </a>
          <div className="flex flex-col">
            <p className="text-gray-primary text-[10px] inline-block">Dowload App Get</p>
            <p className="text-gray-primary text-[10px] inline-block">-20% Discount</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterMid;
