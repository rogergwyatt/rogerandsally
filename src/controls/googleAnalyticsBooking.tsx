
import Script from 'next/script';

export default function GoogleAnalyticsBooking() {
    const trackingID = process.env.GOOGLE_TRACKING_ID

    
    return (
        <>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${trackingID}`}
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
                gtag('event', 'conversion', {'send_to': '${trackingID}/x45fCIeckdcZEOnklqI-'});
                gtag('set', 'user_data', {
                "email": email_address, 
                "phone_number": phone_number}});
            `}
        </Script>
        </>
    )
}