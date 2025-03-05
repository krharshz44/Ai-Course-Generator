"use client";
import React from "react";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";
import Image from "next/image";

export function ScrollBar() {
  return (
    (<div className="flex flex-col bg-black overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-white">
              Unleash the power of AI<br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Course Generator
              </span>
            </h1>
          </>
        }>
        <Image
          src={`/linear.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false} />
      </ContainerScroll>
    </div>)
  );
}
export default ScrollBar;
