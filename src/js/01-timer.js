// Kütüphaneleri ve CSS'lerini içe aktarıyoruz
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// HTML elemanlarını seçiyoruz
const datetimePicker = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

// Yönerge: flatpickr ayarları
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    
    // Geçmiş bir tarih seçildiyse
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Hata',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startBtn.disabled = true; // Butonu kapat
    } else {
      // Gelecek bir tarih seçildiyse
      userSelectedDate = selectedDate;
      startBtn.disabled = false; // Butonu aç
    }
  },
};

// Takvimi input alanına bağlıyoruz
flatpickr(datetimePicker, options);

// Yönerge: Sayıları 04, 09 formatına çeviren fonksiyon
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Yönerge: Milisaniyeyi gün, saat, dakika ve saniyeye çeviren fonksiyon
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Ekrana yazdırma fonksiyonu
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Start butonuna tıklanma olayı
startBtn.addEventListener("click", () => {
  // Sayaç başlarken butonu ve inputu kilitliyoruz
  startBtn.disabled = true;
  datetimePicker.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const msDifference = userSelectedDate - currentTime;

    // Süre dolduğunda sayacı durdur
    if (msDifference <= 0) {
      clearInterval(timerId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false; // Süre bitince takvimi geri aç
      return;
    }

    // Kalan süreyi hesapla ve ekrana yazdır
    const timeData = convertMs(msDifference);
    updateTimerDisplay(timeData);
  }, 1000); // Her 1000 milisaniyede (1 saniye) bir çalıştır
});