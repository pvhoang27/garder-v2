import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";

const PlantGallery = ({ slides, BE_URL }) => {
  if (!slides || slides.length === 0) {
    return (
      <div className="no-media">
        Chưa có hình ảnh/video
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, EffectFade, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      effect={"fade"}
      fadeEffect={{ crossFade: true }}
      speed={600}
      autoplay={{ delay: 5000, disableOnInteraction: true }}
      spaceBetween={10}
      className="gallery-swiper"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          {slide.type === "video" ? (
            <video controls className="gallery-media gallery-video">
              <source src={`${BE_URL}${slide.url}`} />
            </video>
          ) : (
            <img
              src={`${BE_URL}${slide.url}`}
              className="gallery-media"
              alt="Plant"
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/450?text=No+Image")
              }
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PlantGallery;