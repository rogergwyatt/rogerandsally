
import Script from 'next/script';

export default function GoogleAnalytics() {
    const trackingID = process.env.GOOGLE_TRACKING_ID

    
    return (
        <>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${trackingID}`}
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${trackingID}', {'allow_enhanced_conversions':true});
            `}
        </Script>
        </>
    )
}

