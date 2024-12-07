# `bluesky-post`

A Web Component to display Bluesky posts and their metadata.

**[Demo](https://daviddarnes.github.io/bluesky-post/demo.html)** | **[Custom template demo](https://daviddarnes.github.io/bluesky-post/demo-custom-template.html)** | **[Further reading](https://darn.es/bluesky-post-web-component/)**

## Examples

General usage example:

```html
<script type="module" src="bluesky-post.js"></script>

<bluesky-post>
  <a href="https://bsky.app/profile/darn.es/post/3l7m6ivb6ha2q">
    Discuss on Bluesky
  </a>
</bluesky-post>
```

Example using a custom template:

```html
<script type="module" src="bluesky-post.js"></script>

<template id="bluesky-post-template">
  <blockquote data-key="content"></blockquote>
</template>

<bluesky-post>
  <a href="https://bsky.app/profile/darn.es/post/3l7m6ivb6ha2q">
    Discuss on Bluesky
  </a>
</bluesky-post>
```

Example using a more complex custom template:

```html
<script type="module" src="bluesky-post.js"></script>

<template id="bluesky-post-template">
  <dl>
    <dt>Reposts</dt>
    <dd data-key="repostCount"></dd>
    <dt>Replies</dt>
    <dd data-key="replyCount"></dd>
    <dt>Likes</dt>
    <dd data-key="likeCount"></dd>
  </dl>
  <a data-key="url">
    View original post from <strong data-key="username"></strong> on <strong data-key="hostname"></strong>
  </a>
</template>

<bluesky-post>
  <a href="https://bsky.app/profile/darn.es/post/3l7m6ivb6ha2q">
    Discuss on Bluesky
  </a>
</bluesky-post>
```

## Features

This Web Component allows you to:

- Turn a regular Bluesky post link into a quoted Bluesky post
- Surface the post metadata alongside the post, e.g. reply count, repost count, like count
- Use a custom template for all instances of the component on the page using a `data-key="name"` data attributes
- Use a custom template for specific instances using the `template` attribute
- Retrieve nested data using the `data-key` attribute and typical JavaScript key referencing, e.g. `data-key="record.text"`

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@daviddarnes/bluesky-post): `npm install @daviddarnes/bluesky-post`
1. [Download the source manually from GitHub](https://github.com/daviddarnes/bluesky-post/releases) into your project.
1. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)

### Usage

Make sure you include the `<script>` in your project (choose one of these):

```html
<!-- Host yourself -->
<script type="module" src="bluesky-post.js"></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://www.unpkg.com/@daviddarnes/bluesky-post@1.0.0/bluesky-post.js"
></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://esm.sh/@daviddarnes/bluesky-post@1.0.0"
></script>
```

### Using a custom template

The default template for the component looks like this:

```html
<figure>
  <blockquote data-key="record.text"></blockquote>
  <figcaption>
    <cite>
      <a data-key="url">@<span data-key="username"></span></a>
    </cite>
    <dl>
      <dt>Reposts</dt>
      <dd data-key="repostCount"></dd>
      <dt>Replies</dt>
      <dd data-key="replyCount"></dd>
      <dt>Likes</dt>
      <dd data-key="likeCount"></dd>
    </dl>
  </figcaption>
</figure>
```

However you can customise the template by using a `<template>` element with an `id` of `bluesky-post-template`, which will be used for every instance of the component on the page. Here's an example which just exposes the vanity metrics of the Bluesky post as a `<dl>`:

```html
<template id="bluesky-post-template">
  <dl>
    <dt>Reposts</dt>
    <dd data-key="repostCount"></dd>
    <dt>Replies</dt>
    <dd data-key="replyCount"></dd>
    <dt>Likes</dt>
    <dd data-key="likeCount"></dd>
  </dl>
</template>
```

You can also use different templates on the same page by using the `template` attribute to target `<template>` elements with a specific `id`:

```html
<template id="custom-template">
  <a data-key="record.text, url"></a>
</template>

<bluesky-post template="custom-template">
  <a href="https://bsky.app/profile/darn.es/post/3l7m6ivb6ha2q">
    Discuss on Bluesky
  </a>
</bluesky-post>
```

Data is applied using a `data-key` data attribute. The value of this attribute should correspond to a data point within a [Bluesky public post API response](https://docs.bsky.app/docs/api/app-bsky-feed-get-posts). The official Bluesky documentation has [an example of a status response here](https://docs.bsky.app/docs/api/app-bsky-feed-get-posts#responses).

_Note that for `<a>` and `<img>` elements the value won't be applied to it's content if the string being returned starts with `http` and instead will be applied to the `href` and `src` attributes respectively._

Check out the [custom template demo](https://daviddarnes.github.io/bluesky-post/demo-custom-template.html) as well as [the source code](https://github.com/daviddarnes/bluesky-post/blob/main/demo-custom-template.html) for reference.

## Credit

With thanks to the following people:

- [Zach Leatherman](https://zachleat.com) for inspiring this [Web Component repo template](https://github.com/daviddarnes/component-template)
