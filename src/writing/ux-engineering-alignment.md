---
title: Engineering, UX design and agile
archived: true
date: 2021-06-16
tags:
  - engineering
layout: post
description: >-
  In agile we focus on the delivery of solutions. As this is the playing field of engineers, UX designers get left behind. However, we should seek more alignment with them.
---

Almost two years ago I wrote my [first blog post](/writing/ux-design-process-for-engineers) on this website about the alignment between UX and engineering. I got my inspiration based on a conference talk of [Steph Troeth](https://twitter.com/sniffles) on the [CSS Day of 2019](https://cssday.nl/2019). Since that time, I have learned a lot by working with UX designers. Although my initial ideas did not change, I did get a more complete picture of what the alignment between UX and engineering should and could be.

::: callout
Everything is described from an engineering point of view. It can very well be that it is incorrect when looking from a UX point of view. If so, let me know!
:::

## Delivery vs. Discovery

Agile gave us engineers many things. Its promise allowed engineers to start focusing on things that matter for them, that add value to a product. Things like performance, reliability, scalability, and security are now at the forefront of many engineering teams. In addition, work is made smaller, so engineers can more comfortably give some sort of indication of how much effort it requires. Businesses gain more productivity and predictability in _delivering_ software that works.

This works perfectly well in stable environments where the focus is on existing IT landscapes, with no big appetite for change. Change is scary and unpredictable. I mean, who could ever break a venture into uncharted territories ineffective user stories. Let alone actually doing such user stories in a two-week window? Agile's focus on delivery makes it difficult to tap into big changes.

> It’s just important to realize agile is really about delivery. <cite>Marty Cagan</cite>

But innovation regardless if it is for a potentially new or existing solution requires change. It is a _discovery_ journey to find something valuable, usable, feasible, and viable for a given problem. Sometimes we know the destination but not the path. But more often we just get a hunch of the direction. UX plays a big part in these ventures into the unknown. They can act as a business' navigator, showing us which paths to follow to find not a destination, but the correct destination.

## Designing a solution

I think it is fair to assume that as engineers we spent most of our time in delivery, while our UX colleagues are on discovery. At some point, we need to come together and align. Both need to enable the other to do a better job than they already did. Engineers can create products that enable UX designers to easily extract metrics that help them make better decisions. On the other hand, UX designers can enable engineers to create better products faster, by providing systems they can implement and use in decision making. The primary alignment happens in a _design_ step.

![The development process to align UX and engineering](/img/development-process.png)

Design is more than just creating UI designs and hand them over. Design starts with a set of requirements found during the discovery phase. Engineers and UX designers come together to design (a part of) a solution. By working together, effective models can be created that only together can be seen as the design of a solution. When these models are disjoint, issues will arise during the delivery phase. Either by poor quality or poor response of users. Some examples of models that can be created by UX designers and engineers are:

- Architecture and infrastructure design
- Information architecture
- User-, screen- and system-flows
- Design systems

By just looking at these names, most of you will already see the importance of the various models. By putting enough time and focus in the design phase, many future issues can be avoided. It also creates greater understanding and alignment between UX designers and engineers. But, we live in an agile world. In this world, the primary focus is on delivery only. As a team, it is important to take the time required to do proper discovery and design.

## Feedback cycles

Both in agile software development and UX design, feedback is essential. As engineers, we want bug reports from our users. But, we also want live feedback showing the health of the systems we build and maintain. Feedback gives us opportunities to improve. It allows us to identify where we made a mistake. Is it a mistake in the code, or is there a mistake in the design? Did we make design decisions based on a wrong assumption (e.g. amount of usage of a database)?

When evaluating (user) feedback, we can also find that designed a solution, but not _the_ solution. At this point, we see learning points for both UX designers and engineers in the design step. In more extreme cases you can even find that not only did you create the wrong solution, but you have the wrong requirements, to begin with. At this point, improvements can be made in the discovery phase.

But feedback does not have to wait until users are using a solution. Mistakes and improvements can be identified earlier. When building a solution, you can already identify design flaws. Similarly, when designing the solution you can find that too many questions are left unanswered. This increases the risk of building a faulty solution. Depending on your way of working. You can either decide to accept this and wait for user feedback or go back to the discovery phase.

## Wrapping up

The _discovery_, _design_ and _delivery_ phases are common when building software solutions. It shows that UX design and engineering are not too far apart and overlap. A UX designer focuses on discovery and design, but also has a role in the delivery. On a similar note, engineers focus on delivery but have to spend designing the system and exploring new technical options during the discovery phase. All three phases play an important part when developing solutions for users. With agile, we shorten the discovery and design phases and focus on delivery and feedback cycles. But, we should never forget the power of discovery and proper design. Never.
