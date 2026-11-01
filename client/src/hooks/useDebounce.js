import {useState,useEffect} from "react";

function useDebounce(value,delay=500){
    const [debounce,setDEbounce] =useState(value);

    useEffect(() => {
        const timer=setTimeout(() => {
            setDEbounce(value);
        },delay);

        return () => {
            clearTimeout(timer);
        }
    },[value,delay]);

    return debounce;
}

export default useDebounce;
