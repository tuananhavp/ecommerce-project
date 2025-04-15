import Image from "next/image";
import Link from "next/link";

import { footerLegalLinks, paymentMethodIcons } from "../../constants/footer";

const FooterBot = () => {
  return (
    <div className="mt-10 flex xl:flex-row gap-3 flex-col justify-between">
      <div className="">
        <p className="text-gray-primary sm:text-xs text-[10px]">
          Copyright 2024 © Jinstore WooCommerce WordPress Theme. All right reserved. Powered by{" "}
          <span className="ml-1 text-purple-600">BlackRise Themes</span>.
        </p>
        <div className="flex gap-2 items-center mt-3">
          {paymentMethodIcons.map((icon, index) => {
            return (
              <Image key={index} className="sm:size-8 size-6 object-contain" src={icon} width={32} height={32} alt="" />
            );
          })}
        </div>
      </div>
      <div className="flex sm:flex-row flex-col gap-3">
        {footerLegalLinks.map((link, index) => {
          return (
            <Link
              key={index}
              href={link.href}
              className="text-gray-primary sm:text-xs text-[10px] underline underline-offset-2"
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FooterBot;
