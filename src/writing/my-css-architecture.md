---
title: Scalable CSS architecture
date: 2022-01-29
tags:
  - css
  - architecture
layout: post
description: >-
  In the last two years, I found that my CSS architecture was becoming too complex. But, utility-first frameworks were not doing it for me either. I needed a mix, I needed utility-enabled. Then came CUBE CSS and it all clicked.
---

For years I have used [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/) as my goto CSS architecture for large projects. It helped me to keep my CSS maintainable with a small team. But in the last two years, I moved to a [utility-first](https://tailwindcss.com/) approach. More and more parts of ITCSS were left untouched and unused. At this point, I came across the [CUBE CSS](https://cube.fyi/) of [Andy Bell](https://twitter.com/piccalilli_). It is the methodology describing how I was, and still am, implementing CSS. So as every self-respecting front-end developer with an online presence, I took it, changed it, created a framework, and wrote about it!

## Core principles

The framework tries to achieve _simplicity_ for developers. To achieve this, everything is designed around three core principles.

- **Flexible**: the framework provides a lot of flexibility in its implementation. You can implement everything yourself to your liking (e.g. CSS custom properties or BEM-like classes), use it with CSS libraries (e.g. tailwind), or even combine it with front-end frameworks and extend the principles there (e.g. Svelte or React).
- **Scalable**: the framework is designed to tackle the most common problems (layout) first, and allow developers to use their preferred method of implementation. This makes the framework scale to the developers’ needs, but with minimal CSS code and knowledge required.
- **Extensible**: the framework can be extended with project-specific requirements through a dedicated layer, based on global configurations, while generic parts remain untouched.

## Architecture

A simple three-layered architecture that can be used as only your CSS architecture, but can be extended towards a design system (by combining it with front-end frameworks like React in the ‘components’ layer). It heavily focuses on layout patterns above anything.

- **Layout**: classes that look at the macro-level of an application. They provide flexible and responsive layout solutions that are common across an application. The patterns can be used on the macro and micro levels. Some good examples can be found [here](https://feo.crinkles.dev) or [here](https://every-layout.dev/).
- **Utilities**: classes that do one job and do one job well. This is often a class that alters a single property. But utilities like the [`.click-area` class](https://github.com/thecrinkles/bace-css/blob/main/src/utilities/_click-area.scss) cover more than a single property but still do only one thing.
- **Components**: correspond to UI components. That what cannot be solved with layout and/or utility classes alone can be solved in blocks. You can choose to cover all styles of a component in a block, or you can only put those styles not covered by other classes in a block.

The modern trend of _utility classes_ is heavily supported in this architecture. Even the layout patterns can be implemented as utilities. They can be accompanied by _class utilities_, dedicated to changing one small property of the layout pattern (e.g. `.switcher-w-0` sets the width of the switcher pattern). These class utilities impact internal CSS custom properties, to avoid collision with other classes as much as possible.

```
styles/
├── components/     // all components
├── layout/         // classes for layout patterns
├── utilities/      // utility classes
├── _global.scss    // global styles targeting HTML tags
├── _reset.scss     // CSS reset
├── _tokens.scss    // design tokens
└── index.scss
```

## Design tokens

A big part of the framework is the correct usage of design tokens. These tokens are used to create a consistent result across the implementation. Design tokens can be ‘literal’ (exact values) or ‘derived’ from literal tokens. All tokens follow the same naming convention `--<type>-<category>-<number>`. The type indicates what the token impacts (e.g. color). The category is an optional level when the type does not suffice or can collide with properties. The number is used to show that we are _increasing_ something of the type. This makes implementation easy for developers, as you do not have to know exactly what value corresponds to the number. The lowest available number is 0.

There are a few different types of design tokens existing within the framework.

- **Color**-based tokens are the only tokens using the ‘category’ of the naming convention. This category indicates the function of the color. There are brand (primary, secondary & accent), functional (info, success, warning & danger), and grey-scale colors. The numbers in the naming convention represent the color’s _darkness_.
- **Size**-based tokens are used for spacing, break-points, line-height, text-sizes, etc. The sizes are defined using the factor 1.333 between two succeeding sizes. If `size-3 = 1rem` then `size-4 = 1.33rem`.
- **Absolute**-based tokens for properties like border-width (in px), or z-index (per 100). The number corresponds with the actual value.

As the framework is _extensible_, other tokens can be defined as well, such as font-families. To ensure scalability, _CSS custom properties_ are used as the baseline, to allow the tokens to be used everywhere consistently. SCSS can be used to define the custom properties more easily, but it is mainly used to generate utility classes.

```scss
$colors: (
  "black": #000,
  "white": #fff,
);

:root {
  @each $name, $color in $colors {
    --#{$name}: #{$color};
  }
}

@each $name, $color in $colors {
  .bg-#{$name} {
    background-color: var(--#{$name});
  }
}
```

## Components

Components are CSS classes created to fill the gaps utility classes cannot fill. They group several CSS properties. Where possible the defined _CSS custom properties_ based on the design tokens are used. Components can be more than CSS only, though. It can be a combination with actual UI components through a JavaScript framework (e.g. React). All (CSS) components follow a simple functional pattern.

- **Category**: an optional layer that gathers a whole family of components. The categories are used to make your components scoped (e.g. separate a search input from a form input) and more maintainable.
- **Component**: the actual classes for components within a category.
- **Type**: used to define different variants of a single component (e.g. input with an icon, or a primary button). The `data-type` attribute is used, as shown in the example below. If the number of variations in this attribute becomes unmaintainable, use named `data-*` attribute instead of a single `data-type`.
- **State**: when a component/type has different states (read-only, clicked, validated, etc.), often based on HTML events or pseudo-classes (e.g. `:hover`). If pseudo-classes cannot be created, use the `data-state` attribute in a similar manner as the `data-type` attribute described above. Similar to types, if the number of variations of state becomes too big for a single `data-state` attribute, use named `data-*` attributes.

Every system has these generic components that you see coming back. Buttons, input fields, tables, you name it. These components are called _foundational_ components. Foundational components exist in four different categories.

- **Form**: input, buttons, checkboxes.
- **Navigation**: link, tabs, breadcrumbs, pagination.
- **Structure**: footer, accordion, table.
- **Utilities**: toast, dialog, tooltip.

Next to foundational components you have _application_ components. These are non-generic components. They cannot be shared between applications. They are often a combination of foundational components, or deviate from the foundational rules. No pre-defined categories exist for these components, but you can make them based on common sense.

## Co-location and data-\* attributes

Where possible, components should be co-located with the actual UI components. Several frameworks support this directly (e.g. Svelte), or CSS Modules can be used to achieve a similar effect as well.

```
components/
├── button/
    ├── Button.js
    └── button.module.scss
```

```js
// Button.js
import styles from "./button.module.scss";

export default function Button() {
  return <button className={styles.btn}>...</button>;
}
```

For both the type and state of components, I advise using `data-*` attributes, as mentioned. These allow a flexible and maintainable way to build your components. The `~=` used in the snippet below allows CSS to check if the value (e.g. `touched`) exists in a space-separated list of strings when used. With the snippet below, it possible to have `data-state="touched error"` on an input field, and have both style definitions applied. The `i` at the end ensures everything is evaluated without case-sensitivity. These attributes can also be combined with CSS Modules.

```scss
.input { ... }
/* case-insensitive, with value check in list of strings */
.input[data-state~="touched" i] { ... }
.input[data-state~="error" i] { ... }
.input[readonly] { ... }
.input:hover { ... }
```

## Wrapping up

The moment I read about CUBE CSS, I was a fan of the methodology. How could I not? It was describing how I felt about CSS and how I was using it. At the same time, I became a big fan of customer properties. So why not combine the two into a framework? Which is what I did. The current version of the framework is open on [GitHub](https://github.com/thecrinkles/bace-css). It is small but used in several projects, including this website. It has several layouts and utility classes built in. For now, I intend to continue to improve and enrich the framework when I can. Let me know in the [GitHub issues](https://github.com/thecrinkles/feo-css/issues) what you think should be added!
