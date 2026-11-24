
document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 1. МОБИЛЬНОЕ МЕНЮ
  // ==============================

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      menuToggle.textContent = nav.classList.contains("open") ? "×" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.textContent = "☰";
      });
    });
  }


  // ==============================
  // 2. ТЁМНАЯ И СВЕТЛАЯ ТЕМА
  // ==============================

  const themeToggle = document.getElementById("themeToggle");

  function updateThemeButton() {
    if (!themeToggle) return;

    const isLight = document.body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "Тёмный режим" : "Светлый режим";
  }

  const savedTheme = localStorage.getItem("redline-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");

      const isLight = document.body.classList.contains("light-mode");

      localStorage.setItem(
        "redline-theme",
        isLight ? "light" : "dark"
      );

      updateThemeButton();
    });
  }


  // ==============================
  // 3. ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА
  // ==============================

  const languageSelect = document.getElementById("languageSelect");

  const translations = {
    ru: {
      home: "Главная",
      services: "Услуги",
      gallery: "Галерея",
      about: "О нас",
      contacts: "Контакты",
      book: "Записаться в сервис",
      servicesTitle: "Наши услуги",
      servicesText: "Нажмите на услугу, чтобы узнать подробности",
      galleryTitle: "Автомобили и мастерская",
      contactsTitle: "Контакты",
      bookingTitle: "Запись в автосервис",
      send: "Отправить заявку",
      admin: "Администратор"
    },
    uz: {
      home: "Bosh sahifa",
      services: "Xizmatlar",
      gallery: "Galereya",
      about: "Biz haqimizda",
      contacts: "Kontaktlar",
      book: "Xizmatga yozilish",
      servicesTitle: "Bizning xizmatlar",
      servicesText: "Batafsil ma'lumot uchun xizmatni bosing",
      galleryTitle: "Avtomobillar va ustaxona",
      contactsTitle: "Kontaktlar",
      bookingTitle: "Avtoservisga yozilish",
      send: "Ariza yuborish",
      admin: "Administrator"
    },
    en: {
      home: "Home",
      services: "Services",
      gallery: "Gallery",
      about: "About us",
      contacts: "Contacts",
      book: "Book a service",
      servicesTitle: "Our services",
      servicesText: "Click a service to see details",
      galleryTitle: "Cars and workshop",
      contactsTitle: "Contacts",
      bookingTitle: "Book an appointment",
      send: "Send request",
      admin: "Administrator"
    }
  };

  function changeLanguage(lang) {
    const t = translations[lang] || translations.ru;

    const navLinks = document.querySelectorAll(".nav a");
    const navTexts = [t.home, t.services, t.gallery, t.about, t.contacts];

    navLinks.forEach((link, index) => {
      if (navTexts[index]) link.textContent = navTexts[index];
    });

    const heroButton = document.querySelector(".hero-content .button");
    if (heroButton) heroButton.textContent = t.book;

    const servicesHeading = document.querySelector("#services .section-title h2");
    if (servicesHeading) servicesHeading.textContent = t.servicesTitle;

    const servicesDescription = document.querySelector("#services .section-title p");
    if (servicesDescription) servicesDescription.textContent = t.servicesText;

    const galleryHeading = document.querySelector("#gallery .section-title h2");
    if (galleryHeading) galleryHeading.textContent = t.galleryTitle;

    const contactsHeading = document.querySelector("#contacts .section-title h2");
    if (contactsHeading) contactsHeading.textContent = t.contactsTitle;

    const bookingHeading = document.querySelector("#booking .section-title h2");
    if (bookingHeading) bookingHeading.textContent = t.bookingTitle;

    const sendButton = document.querySelector("#bookingForm button[type='submit']");
    if (sendButton) sendButton.textContent = t.send;

    const adminButton = document.getElementById("adminOpen");
    if (adminButton) adminButton.textContent = t.admin;

    localStorage.setItem("redline-language", lang);
  }

  if (languageSelect) {
    const savedLanguage = localStorage.getItem("redline-language") || "ru";
    languageSelect.value = savedLanguage;
    changeLanguage(savedLanguage);

    languageSelect.addEventListener("change", () => {
      changeLanguage(languageSelect.value);
    });
  }


  // ==============================
  // 4. РАСКРЫТИЕ УСЛУГ
  // ==============================

  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("toggle", () => {
      if (!card.open) return;

      document.querySelectorAll(".service-card").forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.open = false;
        }
      });
    });
  });


  // ==============================
  // 5. ОТПРАВКА ЗАЯВКИ
  // ==============================

  const bookingForm = document.getElementById("bookingForm");
  const formMessage = document.getElementById("formMessage");

  if (bookingForm) {
    bookingForm.addEventListener("submit", async event => {
      event.preventDefault();

      const submitButton = bookingForm.querySelector("button[type='submit']");
      const originalText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = "Отправка...";

      const formData = new FormData(bookingForm);

      const requestData = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        car: formData.get("car"),
        service: formData.get("service"),
        comment: formData.get("comment")
      };

      try {
        const response = await fetch("api.php?action=submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Не удалось отправить заявку");
        }

        formMessage.textContent = "Заявка успешно отправлена!";
        bookingForm.reset();

      } catch (error) {
        formMessage.textContent =
          "Не удалось отправить заявку. Проверьте подключение и работу сервера.";
        console.error("Ошибка отправки:", error);

      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }


  // ==============================
  // 6. ПАНЕЛЬ АДМИНИСТРАТОРА
  // ==============================

  const adminModal = document.getElementById("adminModal");
  const adminOpen = document.getElementById("adminOpen");
  const adminClose = document.getElementById("adminClose");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminRequests = document.getElementById("adminRequests");

  let adminCsrf = null;

  async function adminApi(action, data = {}) {
    const response = await fetch(`api.php?action=${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "Ошибка сервера");
    }

    return result;
  }

  if (adminOpen && adminModal) {
    adminOpen.addEventListener("click", () => {
      adminModal.hidden = false;
    });
  }

  if (adminClose && adminModal) {
    adminClose.addEventListener("click", () => {
      adminModal.hidden = true;
    });
  }

  if (adminModal) {
    adminModal.addEventListener("click", event => {
      if (event.target === adminModal) {
        adminModal.hidden = true;
      }
    });
  }

  async function loadAdminRequests() {
    if (!adminRequests) return;

    adminRequests.textContent = "Загрузка заявок...";

    try {
      const result = await adminApi("list", {
        csrf: adminCsrf
      });

      adminRequests.innerHTML = "";

      const heading = document.createElement("h3");
      heading.textContent = "Заявки клиентов";
      adminRequests.appendChild(heading);

      const requests = result.requests || [];

      if (requests.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "Пока заявок нет.";
        adminRequests.appendChild(empty);
      }

      requests.forEach(request => {
        const item = document.createElement("div");
        item.className = "admin-request";

        const details = document.createElement("p");
        details.textContent =
          `Имя: ${request.name || ""}\n` +
          `Телефон: ${request.phone || ""}\n` +
          `Автомобиль: ${request.car || ""}\n` +
          `Услуга: ${request.service || ""}\n` +
          `Комментарий: ${request.comment || ""}`;

        details.style.whiteSpace = "pre-line";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "button";
        deleteButton.textContent = "Удалить заявку";

        deleteButton.addEventListener("click", async () => {
          if (!confirm("Удалить эту заявку?")) return;

          try {
            await adminApi("delete", {
              csrf: adminCsrf,
              id: request.id
            });

            await loadAdminRequests();
          } catch (error) {
            alert(error.message);
          }
        });

        item.appendChild(details);
        item.appendChild(deleteButton);
        adminRequests.appendChild(item);
      });

      const logoutButton = document.createElement("button");
      logoutButton.className = "button button-outline";
      logoutButton.textContent = "Выйти из панели";

      logoutButton.addEventListener("click", async () => {
        try {
          await adminApi("logout", { csrf: adminCsrf });
        } catch (error) {
          console.error(error);
        }

        adminCsrf = null;
        adminRequests.innerHTML = "";
        if (adminLoginForm) adminLoginForm.hidden = false;
      });

      adminRequests.appendChild(logoutButton);

    } catch (error) {
      adminRequests.textContent = error.message;
    }
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async event => {
      event.preventDefault();

      const passwordInput = document.getElementById("adminPassword");
      const password = passwordInput.value;

      try {
        const result = await adminApi("login", { password });

        adminCsrf = result.csrf;

        adminLoginForm.hidden = true;
        passwordInput.value = "";

        await loadAdminRequests();

      } catch (error) {
        alert("Ошибка входа: " + error.message);
      }
    });
  }

});
