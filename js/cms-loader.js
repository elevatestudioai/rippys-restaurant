(function () {
  "use strict";

  // Helper: fetch JSON with graceful fallback
  function loadJSON(path) {
    return fetch(path)
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .catch(function () {
        return null;
      });
  }

  // Helper: set text content safely
  function setText(el, text) {
    if (el && text != null) el.textContent = text;
  }

  // Helper: set innerHTML safely
  function setHTML(el, html) {
    if (el && html != null) el.innerHTML = html;
  }

  // ── ABOUT SECTION ──
  function loadAbout(data) {
    if (!data) return;

    var label = document.getElementById("cms-about-label");
    var title = document.getElementById("cms-about-title");
    var p1 = document.getElementById("cms-about-p1");
    var p2 = document.getElementById("cms-about-p2");
    var statsContainer = document.getElementById("cms-about-stats");
    var photo = document.getElementById("cms-about-photo");

    setText(label, data.sectionLabel);
    if (title && data.sectionTitle) {
      title.innerHTML = data.sectionTitle.replace(/\n/g, "<br>");
    }
    setText(p1, data.paragraph1);
    setText(p2, data.paragraph2);

    if (statsContainer && data.stats && data.stats.length) {
      var html = "";
      data.stats.forEach(function (stat) {
        html +=
          '<div><div class="about-stat-number">' +
          stat.number +
          '</div><div class="about-stat-label">' +
          stat.label +
          "</div></div>";
      });
      statsContainer.innerHTML = html;
    }

    if (photo && data.photo) {
      photo.src = data.photo;
    }
  }

  // ── PHOTO GALLERY ──
  function loadGallery(data) {
    if (!data || !data.photos || !data.photos.length) return;

    var strip = document.getElementById("cms-gallery");
    if (!strip) return;

    // Only replace if we have actual image URLs (not empty strings)
    var hasImages = data.photos.some(function (p) {
      return p.image && p.image.length > 0;
    });
    if (!hasImages) return;

    var html = "";
    data.photos.forEach(function (photo) {
      if (photo.image) {
        html += '<img src="' + photo.image + '" alt="' + (photo.alt || "") + '">';
      }
    });
    strip.innerHTML = html;
  }

  // ── MENU ──
  function loadMenu(data) {
    if (!data || !data.categories || !data.categories.length) return;

    var tabsContainer = document.getElementById("cms-menu-tabs");
    var menuInner = document.getElementById("cms-menu-inner");
    if (!tabsContainer || !menuInner) return;

    // Build tabs
    var tabsHTML = "";
    data.categories.forEach(function (cat, i) {
      tabsHTML +=
        '<button class="menu-tab' +
        (i === 0 ? " active" : "") +
        '" onclick="switchTab(\'' +
        cat.id +
        "')\"> " +
        cat.name +
        "</button>";
    });
    tabsContainer.innerHTML = tabsHTML;

    // Remove old menu-content divs (but keep tabs and header)
    var oldContents = menuInner.querySelectorAll(".menu-content");
    oldContents.forEach(function (el) {
      el.remove();
    });

    // Build menu content for each category
    data.categories.forEach(function (cat, i) {
      var section = document.createElement("div");
      section.id = cat.id;
      section.className = "menu-content";
      if (i !== 0) section.style.display = "none";

      var html = '<div class="menu-columns">';

      if (cat.items) {
        cat.items.forEach(function (item) {
          html += '<div class="menu-item">';
          html += "<div>";
          html += '<div class="menu-item-name">' + item.name + "</div>";
          if (item.description) {
            html += '<div class="menu-item-desc">' + item.description + "</div>";
          }
          html += "</div>";
          html += '<div class="menu-item-price">' + item.price + "</div>";
          html += "</div>";
        });
      }

      html += "</div>";

      // Options groups (for Plates & Sides)
      if (cat.optionsGroups && cat.optionsGroups.length) {
        html += '<div class="menu-options-grid">';
        cat.optionsGroups.forEach(function (group) {
          html += '<div class="menu-options-col">';
          html += '<h4 class="menu-options-heading">' + group.heading + "</h4>";
          html += '<ul class="menu-options-list">';
          if (group.options) {
            group.options.forEach(function (opt) {
              html += "<li>" + opt + "</li>";
            });
          }
          html += "</ul></div>";
        });
        html += "</div>";
      }

      section.innerHTML = html;
      menuInner.appendChild(section);
    });
  }

  // ── FOOTER ──
  function loadFooter(data) {
    if (!data) return;

    var tagline = document.getElementById("cms-footer-tagline");
    var motto = document.getElementById("cms-footer-motto");
    var hours = document.getElementById("cms-footer-hours");
    var contact = document.getElementById("cms-footer-contact");
    var socials = document.getElementById("cms-footer-socials");

    setText(tagline, data.tagline);
    setText(motto, data.motto);

    if (hours && data.hours && data.hours.length) {
      var html = "";
      data.hours.forEach(function (h) {
        html += "<li><a href=\"#\">" + h.days + ": " + h.time + "</a></li>";
      });
      hours.innerHTML = html;
    }

    if (contact && (data.address || data.phone || data.email)) {
      var contactHTML = "";
      if (data.address) contactHTML += data.address + "<br>";
      if (data.phone)
        contactHTML += '<a href="tel:' + data.phone.replace(/[^+\d]/g, "") + '">' + data.phone + "</a><br>";
      if (data.email)
        contactHTML += '<a href="mailto:' + data.email + '">' + data.email + "</a>";
      contact.innerHTML = "<p>" + contactHTML + "</p>";
    }

    if (socials && data.socialLinks && data.socialLinks.length) {
      var socialsHTML = "";
      data.socialLinks.forEach(function (link) {
        if (link.url && link.url !== "#") {
          socialsHTML += '<a href="' + link.url + '" target="_blank" rel="noopener">' + link.platform + "</a>";
        } else {
          socialsHTML += "<a href=\"#\">" + link.platform + "</a>";
        }
      });
      socials.innerHTML = socialsHTML;
    }
  }

  // ── INSTAGRAM SECTION ──
  function loadInstagram(data) {
    if (!data) return;

    var handle = document.getElementById("cms-instagram-handle");
    var grid = document.getElementById("cms-instagram-grid");

    if (handle && data.handle && data.profileUrl) {
      handle.innerHTML =
        'Follow us at <a href="' +
        data.profileUrl +
        '" target="_blank" rel="noopener">@' +
        data.handle +
        "</a>";
    }

    if (grid && data.photos && data.photos.length) {
      var hasImages = data.photos.some(function (p) {
        return p.image && p.image.length > 0;
      });
      if (!hasImages) return;

      var igIcon =
        '<div class="ig-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg></div>';

      var html = "";
      data.photos.forEach(function (photo) {
        if (photo.image) {
          html +=
            '<div class="instagram-post"><img src="' +
            photo.image +
            '" alt="' +
            (photo.alt || "Instagram post") +
            '">' +
            igIcon +
            "</div>";
        }
      });
      grid.innerHTML = html;
    }
  }

  // ── LOAD ALL ──
  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      loadJSON("/_data/about.json"),
      loadJSON("/_data/gallery.json"),
      loadJSON("/_data/menu.json"),
      loadJSON("/_data/footer.json"),
      loadJSON("/_data/instagram.json"),
    ]).then(function (results) {
      loadAbout(results[0]);
      loadGallery(results[1]);
      loadMenu(results[2]);
      loadFooter(results[3]);
      loadInstagram(results[4]);
    });
  });
})();
