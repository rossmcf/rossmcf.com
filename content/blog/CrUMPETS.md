+++
title= "Better Presentations"
description= ""
date= "2009-10-20"
highlight= "true"
+++

## Introduction
Delivery of academic presentations is increasingly reliant upon the effective use of visual aids. The predominant form of visual aid used is the electronic slideset, delivered from a personal computer using data projection. The necessity to prepare such slidesets in advance imposes a restriction on the sequence and duration of academic presentations, hampering the fluidity and spontaineity of the speaker. This article introduces __CrUMPETS__ -- Crumple Zones for Use in Multi-Path Extra-Temporal Slidesets -- a software tool allowing speakers to construct a framework for dynamic presentations that transcend the confines of the fourth dimension.

### Crumple Zones
The first problem for many speakers occurs when the pressures of time require _in-parlo_ adjustment of slideset content. Commonly, small subsets of the slideset are omitted in order to accelarate the talk towards its conclusion. These _Crumple Zones_ afford the speaker an opportunity to dynamically adapt the content of a slideset to the time available for its completion.

### Formalisms
We define a slideset as the set of all available slides, including the terminal slides. The terminal slides do not contain displayed content, but rather represent the entry and exit points to the slideset. Slidesets may be subdivided into _clusters_, which group related slides that can be considered a single entity in terms of their inclusion to or exclusion from the talk. Clusters can be used to navigate the slideset and to parameterise the talk's content. Clusters are defined as discrete subsets such that no slide may be an element in more than one cluster.

The slideset's transition function is defined such that, given a non-terminal source slide, it returns the _outcome set_ set of possible slides to which the source slide may transition directly. For any outcome set with a cardinality >1, a new slide transition path is created, affording the speaker additional flexibility at uttertime.

We define a _Crumple Zone_ (CZ) as any slide cluster in a furcated region such that the previous slide's transition state returns only paths to the cluster and to the cluster's destination slide. Intuitively, a CZ is a cluster that may be 'skipped' at playback.

![A Crumple Zone](/img/crumpets/crumple_zone.png)

## CrUMPETS
CrUMPETS presents a significant improvement over the rigid sequentiality of current 'traditional' presentation tools. Rather than producing an immutable stepswise showset, CrUMPETS responds to speaker input at showtime, maintaining decision-free fluidity.

CrUMPETS is a desktop software application for Macintosh and Windows computers. Crumpets loads in slidesets as pages from a PDF or PostScript file, and then allows users to define the flexible structure by which the slideset may be traversed. CrUMPETS' main window allows users to identify slide clusters by highlighting multiple slides and clicking the 'Cluster' toolbar button. The 'Crumple' toolbar button then allows the user to create a CZ with the selected cluster.

![CrUMPETS' Structure Window](/img/crumpets/crumpets_screenshot_structure.png)

### Alternate Paths
On some occasions, simple omission of slides may be lead to disjointedness of the presented material. For this reason, CrUMPETS affords the creation of alternate paths through the slideset, such that an abbreviated slide or small cluster may be presented in place of the 'crumpled' cluster.

![Abbreviation using Alternate Paths](/img/crumpets/abbreviated_slide.png)

In the above diagram, abbreviation slides are denoted by ripe-gooseberry-coloured quadrangles.

Beyond simple abbreviation, users may define up to 10 paths per slide allowing them to adapt their slideset based on the speaker's intuition, instinct and 'feel' for their audience. For example, a speaker may prepare several slides dealing with the same topic. During the presentation, should the speaker detect audential fatigue, he may opt for a humorous slide, perhaps containing a picture of a domesticated animal. When met with higher degrees of listener interaction, the speaker may wish to select a slide containing more advanced content, so as to quell the enthusiasm of a particularly exuberant student. CrUMPETs makes such flexibility easily manageable with an intuitive graphical user interface, through which the user may interact using a 'mouse' or other pointing device.

### Maintaining Narritive
Despite their inherent usefulness, Crumple Zones (CZs) and alternate paths (APs) present new difficulties to the speaker in the maintenance of narrative throughout the slideset. For example, following a slide containing a humorous photograph of a domesticated animal, one may wish to segue into the next slide in a different fashion than if transitioning from a mathematical proof. In the first instance, the speaker's notes may read:

+ Pause as laughter dies down.
+ Ensure the audience understand that I'm just kidding about the cat.
+ Link using Liono and Snarf analogy.

In the second instance, they might read:

+ Recap definition of Sigma.
+ Accept questions.
+ Open the kimono.

This invaluable flexibility is provided by CrUMPETs by allowing users to 'attach' 'notes' to 'slides' _and_ 'paths'. Notes attached to slides will be available irrespective of how the slide was reached, while notes attached to a path will only be available having made a transition along that path. This allows users to react spontaneously to each of the innumerable possibilities that may face them during mid-speech certainty flux.

### Paths with History
Notes attached to paths enrich traditional presentation 'crib' notes by providing contextual information on the slide from which the current slide was transitioned from to the current slide, giving the speaker a form of short-term 'memory' over their slide traversal from the previous slide to the current one. CrUMPETS further expands this notion to include discrete note fields for every possible slideo-temporal outcome possible.

_Path Histories_ (PHs) allow users to design their notes based on what slides the audience have already been presented with. This can be particularly useful if an earlier CZ or AP has omitted content on which the speaker later relies. If required to mention, when questioned, data pertaining to the earlier omitted material, it may harm the speakers thesis defence, reputation or credit rating. PHs ensure that no such oversight is overlooked.

![Slide History Paths](/img/crumpets/path_history.png)

In the above diagram, the conditional polyfurcating paths created by the possibility of variances in slide destiny are represented by cadmium-coloured, dashed pentagons; their resulting paths leading to concrete slide display states. Concurrent parallel slide destinies are shown in uniform vertical alignment.

At slideauthortime, slide authors may manipulate the content of a slideset as normal, allowing CrUMPETS' `docbrown` module to assess the destinal impact of the alterations, and alert the user to any input that may be required.

![CrUMPETS' DocBrown Module in Action](/img/crumpets/docbrown.png)

### Cascading Content Tags
Managing the content of any decisio-commitment free speaking engagement requires the fluid understanding of content importance, sequence, reference and difference. For any given utterance, the speaker must ascertain what supporting material, if any, should have preceded such a statement. Since supporting statements are the legs on which any conjecture may stand, it is of the utmost importance that no such conjecture be left hopping.

Cascading content tags allow the slideauthor to identify, labelise and escalate themes, concepts and mental pictures based on their place in a concept hierarchy. The concept hierarchy is established using the hierarchy outliner on the left hand side of the main CrUMPETS window.

![Content Hierarchy](/img/crumpets/contenthierarchy.png)

Having resolved the temporal balance of his/her/its notes, and consistently eradicated contential inconsistencies, the slidemaster may produce a presenttoaudiencetime reference notepack, to be referred to when presenting to an audience of any kind. Such a reference notepack is exported from CrUMPETS as a PDF or postscript document.

### Extra-Temporal Notepacks in Practice
Prior to presenttime, CrUMPETS labels each of the prepared crib notes numerically. These are then arranged for use in a paper document. Notes are automatically annotated with the label of their successor. In the case of bifurcated paths, choices are listed, along with target note numbers. Each choice is also labelled, so that CrUMPETS' presenttime engine may be informed of the choice, and transition the projected slide appropriately. Physical transitiontime navigation of the notepack is assisted by an indexed page margin.

![Content Hierarchy](/img/crumpets/notepack.png)

### Discussion
CrUMPETS presents an intuitive and flexible tool for the creation of slidesets capable of accommodating spontaneity, commitment-free and flittingly decoupled presentation. Arguably, some of the problems solved by CrUMPETS could be managed with a modicum of authortime preparation and meatspace rehearsal. This, of course, overlooks the opportunity presented by CrUMPETS to create disjointed, misdirected and perplexing presentations with narratives akin to a [Choose Your Own Adventure novel][cyoa], a liberty never to be denied to any presentation artist.

[cyoa]: http://en.wikipedia.org/wiki/Choose_your_own_adventure
