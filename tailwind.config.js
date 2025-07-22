/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
         inter: ['Inter', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
         archivo: ['"Archivo Narrow"', 'sans-serif'],
          figtree: ['Figtree', 'sans-serif'],
      },
      colors: {
        desktopBg: '#F2F2F2',
        loginBtn: '#F6630A',
        inputBox: '#FFEBDF',
        sendOtpBtn: '#624534',
        verifyOtpBtn: '#161616',
        nav:'#FFC490',
        background:'#F2E3D6',
        
      },
      backgroundImage: {
        mobileGradient: 'linear-gradient(178.5deg, #FFFFFF 6.48%, #FFAE67 71.31%)',
      },
       screens: {
        xxxl: '1920px',    
        hd:'1440px' ,
        laptop: '1280px',  

          },
           boxShadow: {
        'around': '0 4px 20px rgba(0, 0, 0, 0.08), 0 -4px 20px rgba(0, 0, 0, 0.06), 4px 0 20px rgba(0, 0, 0, 0.06), -4px 0 20px rgba(0, 0, 0, 0.06)',
        'around-soft': '0 2px 8px rgba(0,0,0,0.08), 0 -2px 8px rgba(0,0,0,0.05), 2px 0 8px rgba(0,0,0,0.05), -2px 0 8px rgba(0,0,0,0.05)',
      },
      
    },
  },
  plugins: [],
}
