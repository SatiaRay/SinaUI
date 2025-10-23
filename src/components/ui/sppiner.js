import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners"

export const Sppiner = ({size = 15, className}) => {
    const [color, setColor] = useState("black");

    useEffect(() => {
      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  
      const updateColor = (e) => {
        setColor(e.matches ? "white" : "black");
      };
  
      // Initial check
      updateColor(darkModeMediaQuery);
  
      // Listen for changes
      darkModeMediaQuery.addEventListener("change", updateColor);
  
      return () => darkModeMediaQuery.removeEventListener("change", updateColor);
    }, []);

    return <PulseLoader size={size} color={color}/>
}