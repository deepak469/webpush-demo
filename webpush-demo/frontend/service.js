// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option 
const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async subscription => {
  const SERVER_URL = "http://localhost:4000/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  });
  return response.json();
};

self.addEventListener("activate", async () => {
  // This will be called only once when the service worker is installed for first time.
  // BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk
  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BCWz6gK2piRTR3FH_tiJcTnKc91u4Sxk3k_zrjoTWD6SK33flAR31SMqvdkyLrGKQLvQLr0AnJinZ0_gnAPR7PE="
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    console.log("subss details "+ JSON.stringify(subscription));
    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (err) {
    console.log("Error", err);
  }
});

self.addEventListener("push", function(event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
    showLocalNotification('Yolo', event.data.text(), self.registration, event)
  } else {
    console.log("Push event but no data");
  }
});

const showLocalNotification = (title, body, swRegistration, event) => {
  const options = {
    body,
    // here you can add more properties like icon, image, vibrate, etc.
  }
  swRegistration.showNotification(title, options);
}

self.addEventListener('notificationclick', function(event) {
  if(event.data){
    console.log('push event '+event.data.text());
  }
  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://google.com')
  );
})
