
export const translations = {
  tr: {
    // Genel
    appName: "Hesap Makinesi",
    menu: "Menü",
    openMenu: "Menüyü aç",
    close: "Kapat",
    cancel: "Vazgeç",
    delete: "Sil",
    save: "Kaydet",
    error: "Hata",
    
    // Geçmiş
    history: "Geçmiş",
    historyTitle: "Son İşlemler",
    historyDesc: "Hesaplama kayıtlarını incele",
    clearAll: "Tümünü Temizle",
    noRecords: "Kayıt Bulunamadı",
    noRecordsDesc: "Henüz bir hesaplama yapmadınız. Geçmiş burada görünecektir.",
    confirmDeleteTitle: "Emin misiniz?",
    confirmDeleteDesc: "Tüm işlem geçmişi kalıcı olarak silinecek.",
    
    // Ayarlar
    settings: "Ayarlar",
    settingsDesc: "Sistem tercihlerini yönet",
    appearance: "Görünüm",
    darkMode: "Koyu Mod",
    darkModeDesc: "Gece kullanımına uygun koyu arayüz",
    language: "Dil",
    selectLanguage: "Dil tercihini seçin",
    numBtnColor: "Sayı Tuşu Rengi",
    numBtnColorDesc: "Sayı butonlarının vurgu rengini özelleştir",
    aboutApp: "Uygulama Hakkında",
    appVersion: "Uygulama Sürümü",
    
    // Alt Bilgi & Diğer
    copyright: "2019 © Onur KOL Tarafından Yapılmıştır.",
  },
  en: {
    // General
    appName: "Calculator",
    menu: "Menu",
    openMenu: "Open menu",
    close: "Close",
    cancel: "Cancel",
    delete: "Delete",
    save: "Save",
    error: "Error",

    // History
    history: "History",
    historyTitle: "Recent Calculations",
    historyDesc: "View calculation records",
    clearAll: "Clear All",
    noRecords: "No Records Found",
    noRecordsDesc: "You haven't made any calculations yet. History will appear here.",
    confirmDeleteTitle: "Are you sure?",
    confirmDeleteDesc: "All calculation history will be permanently deleted.",

    // Settings
    settings: "Settings",
    settingsDesc: "Manage system preferences",
    appearance: "Appearance",
    darkMode: "Dark Mode",
    darkModeDesc: "Dark interface suitable for night use",
    language: "Language",
    selectLanguage: "Select language preference",
    numBtnColor: "Number Button Color",
    numBtnColorDesc: "Customize the accent color of number buttons",
    aboutApp: "About Application",
    appVersion: "Application Version",

    // Footer & Misc
    copyright: "2019 © Made by Onur KOL.",
  }
};

export type Language = 'tr' | 'en';
export type ButtonColor = 'default' | 'violet' | 'emerald' | 'rose' | 'amber' | 'slate';
