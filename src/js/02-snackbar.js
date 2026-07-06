// iziToast kütüphanesini ve CSS'ini içe aktarıyoruz
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Form elementini seçiyoruz
const form = document.querySelector(".form");

// Form gönderildiğinde çalışacak olay dinleyicisi
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Sayfanın yenilenmesini engeller

  // Formdaki değerleri alıyoruz
  const delayInput = Number(form.elements.delay.value);
  const stateInput = form.elements.state.value;

  // Promise'i oluşturuyoruz ve ardından iziToast ile ekrana basıyoruz
  createPromise(stateInput, delayInput)
    .then((delay) => {
      // Promise 'fulfilled' (başarılı) dönerse çalışır
      iziToast.success({
        title: 'OK',
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        icon: '✅' // Yönergedeki yeşil tik ikonu
      });
    })
    .catch((delay) => {
      // Promise 'rejected' (hatalı) dönerse çalışır
      iziToast.error({
        title: 'Error',
        message: `Rejected promise in ${delay}ms`,
        position: 'topRight',
        icon: '❌' // Yönergedeki kırmızı çarpı ikonu
      });
    });

  // Formu sıfırlamak istersen bu satırı açabilirsin:
  // form.reset(); 
});

// Yönerge: Dinamik Promise üreten fonksiyon
function createPromise(state, delay) {
  return new Promise((resolve, reject) => {
    // Belirtilen milisaniye kadar bekletiyoruz
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}