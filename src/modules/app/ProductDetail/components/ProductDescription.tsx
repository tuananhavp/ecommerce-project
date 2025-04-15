import React from "react";

const ProductDescription = () => {
  const productDesc = {
    desc: `This versatile backpack is designed to meet your everyday needs, whether 
        you're heading to work, school, or an outdoor adventure. Made with high-quality, durable materials, 
        it features multiple compartments for organizing your belongings, padded straps for comfortable carrying, 
        and a sleek, modern design that suits various styles. Its spacious interior allows you to carry your laptop, 
        books, and other essentials effortlessly, while the water-resistant fabric ensures protection during unexpected weather conditions. 
        Perfect for those who value both functionality and style, this backpack is your ultimate companion for a busy lifestyle.`,
    review: [
      {
        userId: "user12345",
        name: "Mai Lan",
        comment: "Very comfortable and spacious! Highly recommend.",
        rating: 5,
      },
      {
        userId: "user67890",
        name: "Khai Nguyen",
        comment: "Decent quality, but the color fades quickly.",
        rating: 3,
      },
      {
        userId: "user24680",
        name: "Huy Pham",
        comment: "The material feels cheap and is not durable.",
        rating: 2,
      },
    ],
  };

  return (
    <div className="mt-10">
      <div className="tabs tabs-lift">
        <input type="radio" name="my_tabs_3" className="tab" aria-label="Description" defaultChecked />
        <div className="tab-content bg-base-100 border-base-300 p-6 text-text-primary text-justify">
          {productDesc.desc}
        </div>

        <input type="radio" name="my_tabs_3" className="tab" aria-label={`Review[${productDesc.review.length}]`} />
        <div className="tab-content bg-base-100 border-base-300 p-6">Review{`[${productDesc.review.length}]`}</div>
      </div>
    </div>
  );
};
export default ProductDescription;
