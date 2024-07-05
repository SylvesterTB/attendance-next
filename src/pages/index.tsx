import Image from "next/image";
import { Inter } from "next/font/google";
import FirstComponent from "./firstcomponent";
import SaveChanges from '../components/SaveChanges';

const inter = Inter({ subsets: ["latin"] });

export default function Home()
{
    return(
        <>
        
        <FirstComponent />
                
           
        {/* <SaveChanges /> */}
     
        </>
    );
}