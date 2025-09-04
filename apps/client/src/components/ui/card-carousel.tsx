import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules"


interface CarouselProps {
  images: { src: string; alt: string }[]
  autoplayDelay?: number
  showPagination?: boolean
  showNavigation?: boolean
}

export const CardCarousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {

  return (
    <section className="w-ace-y-4">
      <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">

          <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
            <div className="flex gap-2">
              <div>
                <h3 className="text-4xl opacity-85 font-bold tracking-tight">
                  Create Members
                </h3>
                <p>Add Family Members </p>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="size-full rounded-3xl">
                      <img
                        src={image.src}
                        width={500}
                        height={500}
                        className="size-full rounded-xl"
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))}
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="size-full rounded-3xl">
                      <img
                        src={image.src}
                        width={200}
                        height={200}
                        className="size-full rounded-xl"
                        alt={image.alt}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
