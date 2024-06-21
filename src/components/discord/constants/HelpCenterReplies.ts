import HelpCenterLinks from "./HelpCenterLinks.js";

export default {
    CLOUDFLARE_CONN_HELP: `I see you're having trouble with Cloudflare. Here are some things to try:

1. Make sure that your Mac is connected to the internet
2. (Android) Temporarily switch your phone to cellular data. Then re-open the app to see if it connects.
    - If it does, your issue was a DNS issue, and you can re-enable your WiFi after 10 minutes or so.
3. (Server) Check to see if you can access your Server URL from your Mac's Browser
4. Check for any alerts/notifications on your Server dashboard
    - If you see any related to Cloudflare, note the error at the end of the message`,
    
    NO_SUCH_HOST_HELP: `It looks like you're having a DNS issue. Please make sure that your Mac is connected to the internet by opening a browser and navigating to a website. If you can't access the internet, you may need to troubleshoot your network connection.
If you can access the internet, you may have something blocking the proxy service connection.
If you have a DNS blocker, VPN, firewall, or other network security software, try disabling it temporarily to see if that resolves the issue.
You may need to add an exception for the proxy service host.`,

    NO_NOTIFICATIONS_HELP: `If you're not receiving notifications, please read this help center article: [Not Receiving Notifications - BlueBubbles Documentation](${HelpCenterLinks.no_notifications})`,

    HOW_TO_DONATE_HELP: `If you're looking to support the project, you have a few options:

- [PayPal | One-Time Donation](${HelpCenterLinks.donate})
- [GitHub | Sponsor Us](${HelpCenterLinks.sponsor})
- [Venmo | @bluebubblesmessaging](https://venmo.com/code?user_id=3296196424630272198)

Thank you for your support!`,

    BEST_MACOS_HELP: `To find out which macOS version is best for you, please visit our [FAQ page](${HelpCenterLinks.faq}) and find the "What is the best macOS device and version to use?" section.
When making your decision, consider what hardware you are using. For instance, if you are using an older Mac Mini, it may not natively support the latest macOS version.
If you have older hardware and still would like to install newer macOS versions, you may want to look into using [OpenCore Legacy Patcher (OCLP)](https://dortania.github.io/OpenCore-Legacy-Patcher/).`,

    WHICH_PROXY_HELP: `If you're looking for a proxy service recommendation, a Reddit user has graciously put together a breakdown of the pros and cons of each service. You can find it here: [Positives and Negatives with each Proxy option in BlueBubbles | Reddit](https://www.reddit.com/r/BlueBubbles/comments/1au7u4n/positives_and_negatives_with_each_proxy_option_in/).`,

    PORT_FORWARDING_HELP: `If you'd like to learn more about port forwarding, see our help center article: [Port Forwarding & Dynamic DNS - BlueBubbles Documentation](https://docs.bluebubbles.app/server/basic-guides/port-forwarding-and-dynamic-dns)`,

    WHY_NEED_MAC_HELP: `Because Apple has not released an official API for iMessage, we need to use a Mac to act as a relay server. The server is responsible for sending and receiving messages on your behalf.
    
We do not have a server that can run on a Jailbroken iPhone. This is why you need a Mac to use BlueBubbles.`,

    HOW_TO_GET_PAPI_FEATURES_HELP: `In order to use reactions, replies, and other complex features in BlueBubbles, you will need to set up the Private API. You can find instructions on how to set up the Private API in our help center article: [Private API - BlueBubbles Documentation](${HelpCenterLinks.private_api})`,

    APPLE_SCRIPT_REBOOT_HELP: `If you're seeing an AppleScript error, sometimes a simple macOS reboot will fix the issues.
AppleScript errors can be caused by a variety of "environmental" issues, including bugs in the system. Often times, rebooting your Mac will resolve these issues.
If a reboot resolves your issues, great. If not, please reach out to us for further assistance.

_We highly recommend you look into setting up the Private API to avoid AppleScript errors in the future._`,

    APPLE_SCRIPT_EVENTS_HELP: `If you're seeing an Apple Events error, this means that you have not granted BlueBubbles permission to send Apple Events.
You most likely have a popup on your Mac asking you to grant the permission. Go ahead and grant the permission, and the error should go away.
If you are using an VNC viewer to access your mac, you may not see the popup. In this case, you will need to physically access the Mac to grant the permission.

_We highly recommend you look into setting up the Private API to avoid AppleScript errors in the future._`,

    BB_ON_IOS_HELP: `Unfortunately, the BlueBubbles server cannot be deployed to iOS or iPadOS. It can only be deployed to a MacOS device (virtual or physical).

If you do not have access to a physical Mac, you can set up a virtual one using our guides here: ${HelpCenterLinks.mac_virtualization}.
If that is too difficult, you can also purchase an older Mac Mini to use as a dedicated BlueBubbles Server.`,

    LOGGED_OUT_IMESSAGE_HELP: `If you get logged out of iMessage shortly after logging in, the issue is likely due to a backend iCloud restriction for your Mac.
You'll likely need to contat Apple to get the issue resolved.

Here is a link to a Reddit post that you may find helpful: ${HelpCenterLinks.logged_out_of_imessage}`,
}