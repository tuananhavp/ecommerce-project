import React from "react";

import Image from "next/image";

const AnalysisTab = () => {
  return (
    <div className="overflow-x-auto w-full lg:w-1/2 mt-4 lg:mt-0 lg:mr-4 h-auto md:h-60">
      <table className="table bg-white table-pin-rows">
        <thead>
          <tr>
            <th className="text-xs sm:text-sm">ID</th>
            <th className="text-xs sm:text-sm">Country</th>
            <th className="text-xs sm:text-sm">Totals</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th className="text-xs sm:text-sm">1</th>
            <td>
              <div className="flex gap-2 items-center">
                <div>
                  <Image
                    className="size-6 sm:size-8 md:size-10 rounded-box"
                    src="/avatar.png"
                    alt="avatar"
                    width={40}
                    height={40}
                  />
                </div>
                <span className="font-semibold text-xs sm:text-sm">Vietnam</span>
              </div>
            </td>
            <td className="text-xs sm:text-sm">1636.34$</td>
          </tr>
          {/* row 2 */}
          <tr>
            <th className="text-xs sm:text-sm">2</th>
            <td>
              <div className="flex gap-2 items-center">
                <div>
                  <Image
                    className="size-6 sm:size-8 md:size-10 rounded-box"
                    src="/avatar.png"
                    alt="avatar"
                    width={40}
                    height={40}
                  />
                </div>
                <span className="font-semibold text-xs sm:text-sm">American</span>
              </div>
            </td>
            <td className="text-xs sm:text-sm">1636.34$</td>
          </tr>
          {/* row 3 */}
          <tr>
            <th className="text-xs sm:text-sm">3</th>
            <td>
              <div className="flex gap-2 items-center">
                <div>
                  <Image
                    className="size-6 sm:size-8 md:size-10 rounded-box"
                    src="/avatar.png"
                    alt="avatar"
                    width={40}
                    height={40}
                  />
                </div>
                <span className="font-semibold text-xs sm:text-sm">China</span>
              </div>
            </td>
            <td className="text-xs sm:text-sm">1636.34$</td>
          </tr>
          {/* row 4 */}
          <tr>
            <th className="text-xs sm:text-sm">4</th>
            <td>
              <div className="flex gap-2 items-center">
                <div>
                  <Image
                    className="size-6 sm:size-8 md:size-10 rounded-box"
                    src="/avatar.png"
                    alt="avatar"
                    width={40}
                    height={40}
                  />
                </div>
                <span className="font-semibold text-xs sm:text-sm">Thailand</span>
              </div>
            </td>
            <td className="text-xs sm:text-sm">1636.34$</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisTab;
