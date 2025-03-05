import Header from "./_components/Header";
import React from "react";

import Footer from "./_components/Footer";
import Demo, { GlobeDemo } from "./_components/Demo";
import ScrollBar from "./_components/ScrollBar";
import Sparkle from "./_components/Sparkle";



export default function Home()
 {
  return (
    <div>
      
      {/* HEADER SECTION */}
      <Header />
      
      
      {/* Globe SECTION */}
      <GlobeDemo/>
      

      {/* Feature SECTION */}
      <Footer/>

      {/* ScrollBar */}
      <ScrollBar/>

      {/* Sparkle */}
      <Sparkle/>
    </div>
  );
}
