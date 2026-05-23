---
title: Going back to CSS-only after years of SCSS
date: 2023-07-03
tags:
  - css
layout: post
description: >-
  When migrating my website to Eleventy, it ditched SCSS and went old school. I went removed a complexity layer to see if CSS-only is a viable option these days.
---

All these years I was telling people I was doing CSS, and enjoying CSS, I was lying. Kind off. I was doing SCSS for the vast majority of the last years of my life. Of course, most of the code I wrote _was still CSS_. But I was utilizing SCSS features as well. When I migrated my website to [eleventy](https://11ty.dev), I was thinking was I was needing SCSS. I had issues in the past with moving from `node-sass` to the dart-based `sass` library. Do I want this type of headache for my website again?

## What was I using that was specific to SCSS?

My primary reason for SCSS was class generation based on arrays of variables. By defining all my design tokens in a central place, SCSS allows me to generate a vast amount of utility classes. Not to the level of tailwind, but enough for what I require in my projects. Let's illustrate this with an example. The code snippet below shows the `$spaces` SCSS variable. This variable is used to generate utility classes. For example, the `.p-0` generates a class that sets the padding to `1rem`.

```scss
$spaces: (
  "0": 1rem,
  "1": 1.25rem,
  "2": 1.5rem,
);

@each $name, $space in $spaces {
  .p-#{$name} {
    padding: $space;
  }
}
```

Of course, there are a few more features of SCSS I was using. But this was my main reason all those years ago. Do you want to change the value? Boom, all classes are updated. Do you want to add or remove a value? Done.

But throughout the years, CSS gave us custom properties to solve the initial point. So instead of directly putting the values like `1rem` into the classes, I put them into custom properties. The generated classes now use those.

```scss
:root {
  @each $name, $space in $spaces {
    --p-space-{$name}: $space;
  }
}
```

::: info
You can see this approach in its full glory in my SCSS framework [Feo CSS](https://github.com/thecrinkles/feo-css).
:::

## Migrating back to CSS

I came to realize that I was using SCSS-specific features less and less. Of course, I still use it to generate classes. But, in most projects, the design tokens remain stable rather quickly from the start. In addition, there are only so many utility classes I need. Although my [approach](/writing/my-css-architecture/) is utility focused, it is not utility-first. I write bespoke CSS more often. In addition, there are only so many token-based utility functions I use.

Migrating to CSS would require a _one-off_ investment. All tokens need to be converted to CSS custom properties instead of SCSS variables. In addition, all token-based utility functions need to be written one by one. Or more specifically, a lot of copy-pasting. This sounds like a tedious job, and it is.

In the end, it only takes a few hours of brainless work. Setting up a new tool, a plugin for your framework, compile steps, etc. takes an equal amount of time. The only difference is you now already have working CSS code. And if you are selective, you only have the required CSS code, instead of generated a big amount of unused CSS classes.

## Re-evaluating some approaches

Essentially I did a big refactor of my CSS approach. And each big refactoring provides you with the opportunity to reevaluate. This exercise is no different. The biggest change can be found in my approach to defining _class utilities_. Not to be confused with _utility classes_. The former are classes that change a specific value set by _another class_. Let's look at a small example for one of the layout classes. In this case `.tiles-g-0` would be an example of a _class utility_ for the `.tiles` class that changes the `gap` property.

```scss
.tiles {
  --tiles-width: 0;
  --tiles-gap: 0;

  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(var(--tiles-width), 100%), 1fr)
  );
  gap: var(--tiles-gap);
}

/* the $spaces example used earlier */
@each $name, $space in $spaces {
  .tiles-g-#{$name} {
    --tiles-gap: var(--bp-#{$name});
  }
}
```

I use these (token-based) _class utilities_ almost exclusively in different layout composition classes. And guess what? Most of the layout classes have similar class utilities. They are either focused on width, gaps, or amounts. This means we can aggregate all the layout class utilities that are similar.

```css
/* similar to our old spacing example */
.--gap-0 {
  --layout-gap: var(--p-space-0);
}
```

Instead of using `--tiles-gap`, the `.tiles` class, like any other layout class, uses the `--layout-gap` property.

```css
.tiles {
  gap: var(--layout-gap, 0);
}
```

Applying this in HTML would look like something below. The usage of `--` before each class utility makes them recognizable. A nice bonus advantage.

```html
<div class="tiles --gap-0"></div>
```

This change has some benefits for myself and the CSS produced for this website. The most obvious is that this approach allows me to define these _class utilities_ in one place. Remember that adding token-based classes is still the biggest downside of doing CSS-only? Well, this approach mitigates this a bit. In addition, the CSS footprint gets reduced as well, as a lot fewer classes are required.

## Make your CSS production ready

SCSS has a compile step. One of my reasons to migrate back to CSS was to remove this step. I wanted my tooling overhead smaller. This is possible now! But you will quickly notice like I did, that it is suboptimal for a few reasons. The three most important reasons I found were:

- Using `@import` will result in a network call for each file you have in your CSS directory.
- Minifying your CSS (e.g. removing comments) to reduce its carbon footprint cannot be done without additional tooling.
- Not all good new features of CSS are supported by all browsers.

This means that I still needed a tool, in particular for bundling, minifying, and targeting specific browsers. I landed on [Lightning CSS](https://lightningcss.dev/). This tool allowed me to use a single NPM command in my build step to generate the CSS.

```bash
lightningcss --bundle --minify  <file.css> -o <output/file.css>
```

With all of these types of tools, you get a bunch of additional options. Adding the `--nesting` allows nested CSS to be compiled to older CSS syntax. With `--target '> 0.25%, not IE 11'` you can control the target browsers and what they support in CSS for the compile step. Luckily you can define everything in a single NPM command instead of creating another config file.

## When does CSS-only make sense?

Would I recommend this move to everybody? No. It is highly dependent on your way of working and approach to implementing a design. If you are utility-focused in CSS, and use a vast amount of token-based classes, you might be better off with frameworks like [tailwind](https://tailwindcss.com/) or [Feo CSS](https://github.com/thecrinkles/feo-css). If the number of design tokens you use is not stable, this approach is again not for you. But, if you are like me and follow conventions like [Cube CSS](https://cube.fyi/) and have a relatively stable set of design tokens, doing CSS-only is a good viable option.

I enjoyed the entire migration and tend to stick with it. CSS has become powerful enough to not require different tools or languages anymore. The resulting code is maintainable and risk-free of breaking tools.

::: info
If you are curious about the actual changes, compare [Feo CSS](https://github.com/thecrinkles/feo-css) and the [/styles](https://github.com/thecrinkles/crinkles.dev/tree/main/src/styles) directory of this website. The previous version of this website used Feo CSS before the migration.
:::
