"use client"
import { Typography } from "@mui/material";
import logo from "@public/logo.svg";
import Image from 'next/image';

const SplashScreen: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <div className='splash-screen'>
      <div className='splash-screen-content'>
        <Image src={logo} alt="Logo" width={192} height={192} priority />
        <Typography variant='overline' component='h3'>{title}</Typography>
      </div>
    </div>
  );
}
export default SplashScreen;