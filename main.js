const { application } = require("express");

class Poll {
  constructor(root, title) {
    this.root = root;
    this.selected = sessionStorage.getItem("poll-selected");
    this.endpoint = "http://localhost:3000/poll ";

    this.root.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="poll__title">${title}</div>
      `
    );
  }

  async _refresh() {
    const response = await fetch(this.endpoint);
    const data = await response.json();

    this.querySelectorAll(".poll_option").array.forEach((option) => {
      option.remove();
    });

    for (const option of data) {
      const template = document.getElementBy("template");
      const fragment = template.content;

      fragment.innerHTML = `
        <div class="poll_option ${
          this.selected == option.label ? "poll_option--selected" : ""
        }">
        <div class="poll_option_fill"></div>
        <div class="poll_option_info">
          <span class="poll_label">${option.label}</span>
          <span class="poll_percent">${option.percentage} % </span>
        </div>
      </div>
      `;

      if (!this.selected) {
        fragment.querySelector(".poll_option").addEventListener("click", () => {
          fetch(this.endpoint, {
            method: "post",
            body: `add=${option.label}`,
            headers: {
              "Content-Type": "application/x-wwww-form-urlencoded",
            },
          }).then(() => {
            this.selected = option.label;

            sessionStorage.setItem("poll-selected", option.label);

            this._refresh();
          });
        });
      }

      fragment.querySelector(
        ".poll_option-fill"
      ).style.width = `${option.percentage}%`;

      this.root.appendChild(fragment);
    }
  }
}

const p = new Poll(document.querySelector(".poll"), "choose your winner");
