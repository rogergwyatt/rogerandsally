import { Inter, Sofadi_One, Nanum_Gothic, Marhey, Lobster_Two, Anton, Gelasio } from 'next/font/google'
 
export const inter = Inter({ 
    subsets: ["latin"], 
    variable: '--font-inter',
    display: 'swap', 
  });
  
export const sofadi = Lobster_Two({
    subsets: ['latin'],
    variable: '--font-sofadi',
    display: 'swap',
    weight: "400"
  });

export const nanum = Nanum_Gothic({
    variable: '--font-nanum',
    weight: '400',
    subsets: ['latin'],
});

export const anton = Anton({
    variable: '--font-anton',
    display: 'swap',
    subsets: ['latin'],
    weight: '400'
})

export const sans = Inter({
    variable: '--font-sans',
    display: 'swap',
    subsets: ['latin'],
    weight: '400'
})

export const serif = Gelasio({
    variable: '--font-serif',
    display: 'swap',
    subsets: ['latin'],
    weight: '400'
})