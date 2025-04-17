import Image from "next/image";
import React from "react";

const AnalysisTab = () => {
  return (
    <div className="overflow-x-auto w-full mt-9 mr-8 h-60">
      <table className="table bg-white table-pin-rows">
        <thead>
          <tr>
            <th>ID</th>
            <th>Country</th>
            <th>Totals</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th>1</th>
            <td>
              <div className="flex gap-2 items-center">
                <div>
                  <Image className="size-10 rounded-box" src="/avatar.png" alt="avatar" width={40} height={40} />
                </div>
                <span className="font-semibold">Vietnam</span>
              </div>
            </td>
            <td>1636.34$</td>
          </tr>
          {/* row 2 */}
          <tr>
            <th>2</th>
            <td>
              <div className="flex gap-2 items-center">
                <div>
                  <Image className="size-10 rounded-box" src="/avatar.png" alt="avatar" width={40} height={40} />
                </div>
                <span className="font-semibold">American</span>
              </div>
            </td>
            <td>1636.34$</td>
          </tr>
          {/* row 3 */}
          <tr>
            <th>3</th>
            <td>
              <div className="flex gap-2 items-center">
                <div>
                  <Image className="size-10 rounded-box" src="/avatar.png" alt="avatar" width={40} height={40} />
                </div>
                <span className="font-semibold">China</span>
              </div>
            </td>
            <td>1636.34$</td>
          </tr>
          {/* row 4 */}
          <tr>
            <th>4</th>
            <td>
              <div className="flex gap-2 items-center">
                <div>
                  <Image className="size-10 rounded-box" src="/avatar.png" alt="avatar" width={40} height={40} />
                </div>
                <span className="font-semibold">Thailand</span>
              </div>
            </td>
            <td>1636.34$</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnalysisTab;
