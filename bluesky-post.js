const blueskyPostTemplate = document.createElement("template");

blueskyPostTemplate.innerHTML = `
<figure>
  <blockquote data-key="record.text"></blockquote>
  <figcaption>
    <cite>
      <a data-key="url">@<span data-key="username"></span></a>
    </cite>
    <dl>
      <dt>Reposts</dt><dd data-key="repostCount"></dd>
      <dt>Replies</dt><dd data-key="replyCount"></dd>
      <dt>Likes</dt><dd data-key="likeCount"></dd>
    </dl>
  </figcaption>
</figure>
`;

blueskyPostTemplate.id = "bluesky-post-template";

if (!document.getElementById(blueskyPostTemplate.id)) {
  document.body.appendChild(blueskyPostTemplate);
}

class BlueskyPost extends HTMLElement {
  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || "bluesky-post", BlueskyPost);
    }
  }

  async connectedCallback() {
    this.append(this.template);

    const data = { ...(await this.postData()), ...this.linkData };

    this.slots.forEach((slot) => {
      slot.dataset.key.split(",").forEach((keyItem) => {
        const value = this.getValue(keyItem, data);
        if (keyItem === "record.text") {
          slot.innerHTML = value.replace(/\n/g, "<br/>");
        } else {
          this.populateSlot(slot, value);
        }
      });
    });
  }

  populateSlot(slot, value) {
    if (typeof value == "string" && value.startsWith("http")) {
      if (slot.localName === "img") slot.src = value;
      if (slot.localName === "a") slot.href = value;
    } else {
      slot.textContent = value;
    }
  }

  handleKey(object, key) {
    const parsedKeyInt = parseFloat(key);

    if (Number.isNaN(parsedKeyInt)) {
      return object[key];
    }

    return object[parsedKeyInt];
  }

  getValue(string, data) {
    let keys = string.trim().split(/\.|\[|\]/g);
    keys = keys.filter((string) => string.length);

    const value = keys.reduce(
      (object, key) => this.handleKey(object, key),
      data
    );
    return value;
  }

  get template() {
    return document
      .getElementById(
        this.getAttribute("template") || `${this.localName}-template`
      )
      .content.cloneNode(true);
  }

  get slots() {
    return this.querySelectorAll("[data-key]");
  }

  get link() {
    return this.querySelector("a").href;
  }

  get linkData() {
    const url = new URL(this.link);
    const paths = url.pathname.split("/").filter((string) => string.length);

    return {
      url: this.link,
      hostname: url.hostname,
      username: paths[paths.indexOf("profile") + 1],
      postId: paths[paths.length - 1],
    };
  }

  get userData() {
    return fetch(
      `https://public.api.${this.linkData.hostname}/xrpc/app.bsky.actor.getProfile?actor=${this.linkData.username}`
    ).then((response) => response.json());
  }

  async postData() {
    const user = await this.userData;

    const data = await fetch(
      `https://public.api.${this.linkData.hostname}/xrpc/app.bsky.feed.getPosts?uris=at://${user.did}/app.bsky.feed.post/${this.linkData.postId}`
    ).then((response) => response.json());

    return data.posts[0];
  }
}

BlueskyPost.register();
